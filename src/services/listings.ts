import { createClient } from '@/lib/supabase/client';

export type ListingType = 'rental' | 'airbnb' | 'sale';

export interface ListingFilter {
  city?: string;
  type?: ListingType;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number[];
  search?: string;
  category?: string;
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
  guests?: number;
  amenities?: string[];
}

export const listingsService = {
  /**
   * Fetch all listings with optional filters
   */
  async getListings(filters: ListingFilter & { amenityMode?: 'AND' | 'OR', verifiedOnly?: boolean, minRating?: number } = {}) {
    const supabase = createClient();
    
    // Map our frontend sortBy string to the DB column and direction
    let sortCol = 'created_at';
    let sortDesc = true;
    
    if (filters.sortBy === 'price-desc') { sortCol = 'price'; sortDesc = true; } // The RPC will handle 'price' logic
    else if (filters.sortBy === 'price-asc') { sortCol = 'price'; sortDesc = false; }
    else if (filters.sortBy === 'rating') { sortCol = 'avg_rating'; sortDesc = true; }
    else if (filters.sortBy === 'newest') { sortCol = 'created_at'; sortDesc = true; }
    else if (filters.sortBy === 'relevance' || !filters.sortBy) { sortCol = 'relevance'; sortDesc = true; }
    
    // Send a consistent payload shape with all 12 parameters to ensure stable RPC signature matching
    const payload = {
      p_city_slug: filters.city && filters.city !== 'all' ? filters.city.toLowerCase() : null,
      p_type: filters.type && filters.type !== 'all' ? filters.type : null,
      p_search: filters.search && filters.search.trim() !== '' ? filters.search : null,
      p_amenity_labels: filters.amenities && filters.amenities.length ? filters.amenities : [],
      p_amenity_mode: filters.amenityMode ?? 'AND',
      p_min_rating: filters.minRating || null,
      p_verified_only: typeof filters.verifiedOnly === 'boolean' ? filters.verifiedOnly : null,
      p_price_min: filters.priceMin !== undefined ? filters.priceMin : null,
      p_price_max: filters.priceMax !== undefined ? filters.priceMax : null,
      p_bedrooms: filters.bedrooms && filters.bedrooms.length ? filters.bedrooms : null,
      p_property_category: filters.category && filters.category !== 'all' ? filters.category : null,
      p_sort_col: sortCol || 'created_at',
      p_sort_desc: sortDesc ?? true
    };

    // We call the custom RPC function which handles all the complex OR/AND logic efficiently
    // This now expects 13 parameters
    const { data, error } = await supabase.rpc('search_listings', payload).select(`
      *,
      cities (name, slug),
      amenities:listing_amenities (
        amenity:amenities (*)
      ),
      photos:listing_photos!listing_id (*)
    `);

    if (error) {
      console.warn('RPC search_listings failed:', error);
      console.warn('Falling back to standard database query...');
      
      // Emergency Fallback: If the developer's RPC is still broken, we use a standard query
      // so the user can at least see properties (similar to the Map view).
      let fallbackQuery = supabase
        .from('listings')
        .select(`
          *,
          cities!inner (name, slug),
          amenities:listing_amenities (
            amenity:amenities (*)
          ),
          photos:listing_photos!listing_id (*)
        `)
        .eq('status', 'active');
        
      if (filters.city && filters.city !== 'all') {
        const citySlug = filters.city.toLowerCase();
        if (citySlug === 'diani') {
          fallbackQuery = fallbackQuery.in('cities.slug', ['diani', 'kwale']);
        } else {
          fallbackQuery = fallbackQuery.eq('cities.slug', citySlug);
        }
      }
      if (filters.type && filters.type !== 'all') {
        fallbackQuery = fallbackQuery.eq('type', filters.type);
      }
      
      // We do a simple fallback sort
      const { data: fallbackData, error: fallbackError } = await fallbackQuery
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (fallbackError) throw fallbackError;
      return fallbackData;
    }
    
    return data;
  },

  /**
   * Fetch a single listing by slug
   */
  async getListingBySlug(slug: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        cities (*),
        host:profiles (*),
        amenities:listing_amenities (
          amenity:amenities (*)
        ),
        photos:listing_photos!listing_id (*)
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch listings within a map bounding box (Simplified Lat/Lng approach)
   * This is more reliable across different DB configurations.
   */
  async getListingsInBounds(bounds: { ne: { lat: number, lng: number }, sw: { lat: number, lng: number } }) {
    const supabase = createClient();
    
    // We use standard comparison for Latitude and Longitude
    // Use numeric range filters for performance and accuracy
    // If your DB columns are text, Supabase will attempt to cast them
    const { data, error } = await supabase
      .from('listings')
      .select('*, cities(name), photos:listing_photos!listing_id (*)')
      .eq('status', 'active')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .gte('latitude', bounds.sw.lat)
      .lte('latitude', bounds.ne.lat)
      .gte('longitude', bounds.sw.lng)
      .lte('longitude', bounds.ne.lng)
      .limit(50);

    if (error) {
      console.error('Database Map Error:', error);
      throw error;
    }

    return data;
  },

  /**
   * Fetch featured listings
   */
  async getFeaturedListings(limit = 4) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('listings')
      .select('*, cities(name), photos:listing_photos!listing_id (*)')
      .eq('status', 'active')
      .eq('is_featured', true)
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Fetch weekend deals (Airbnb listings)
   */
  async getWeekendDeals(limit = 4) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('listings')
      .select('*, cities(name), photos:listing_photos!inner (*)')
      .eq('status', 'active')
      .eq('type', 'airbnb')
      .eq('photos.is_primary', true)
      .order('avg_rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
  
  /**
   * Fetch all cities
   */
  async getCities() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('cities')
      .select(`
        *,
        listings!city_id (count)
      `)
      .eq('listings.status', 'active')
      .order('name', { ascending: true });

    if (error) throw error;
    return data.map(city => ({
      ...city,
      listing_count: city.listings?.[0]?.count || 0
    }));
  }
};
