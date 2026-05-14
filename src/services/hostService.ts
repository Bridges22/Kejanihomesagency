import { createClient } from '@/lib/supabase/client';

export const hostService = {
  /**
   * Fetch KPI metrics for the host dashboard
   */
  async getHostMetrics(hostId: string) {
    const supabase = createClient();
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id, view_count, unlock_count, status, area')
      .eq('host_id', hostId);
      
    if (listingsError) console.error('Error fetching host listings:', listingsError);

    let activeListings = 0;
    let draftListings = 0;
    let totalViews = 0;
    let totalLeads = 0;
    const areaBreakdown: Record<string, { views: number, leads: number }> = {};
    const listingIds: string[] = [];

    if (listings) {
      listings.forEach(l => {
        listingIds.push(l.id);
        if (l.status?.toLowerCase() === 'active') activeListings++;
        if (l.status?.toLowerCase() === 'pending') draftListings++;
        totalViews += (l.view_count || 0);
        totalLeads += (l.unlock_count || 0);
        
        const area = l.area || 'Unknown';
        if (!areaBreakdown[area]) areaBreakdown[area] = { views: 0, leads: 0 };
        areaBreakdown[area].views += (l.view_count || 0);
        areaBreakdown[area].leads += (l.unlock_count || 0);
      });
    }

    let recentLeads: any[] = [];
    if (listingIds.length > 0) {
      const { data: unlocksData } = await supabase
        .from('unlocks')
        .select(`
          id, amount, created_at,
          seeker:profiles!seeker_id (full_name, email),
          listing:listings!listing_id (title, slug, type)
        `)
        .in('listing_id', listingIds)
        .order('created_at', { ascending: false })
        .limit(10);
      if (unlocksData) recentLeads = unlocksData;
    }

    return {
      activeListings,
      draftListings,
      totalViews,
      totalLeads,
      recentLeads,
      areaBreakdown
    };
  },

  async getHostListings(hostId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        cities (name, slug),
        photos:listing_photos!listing_id (*)
      `)
      .eq('host_id', hostId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getListingById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('listings')
      .select('*, photos:listing_photos!listing_id (*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Create a new property listing - FULL DATA VERSION
   */
  async createListing(listingData: any, photoFiles: File[]) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Helper for stable UUIDs
    const generateId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
      // Fallback for older browsers
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    const listingId = generateId();
    const slug = `${listingData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;


    // 1. Compress & Upload photos
    const photoUrls = [];
    for (const file of photoFiles) {
      let fileToUpload = file;
      
      // Professional Touch: Client-side compression to save storage & speed up loading
      try {
        const imageCompression = (await import('browser-image-compression')).default;
        const options = {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
          initialQuality: 0.8
        };
        fileToUpload = await imageCompression(file, options);
      } catch (e) {
        console.warn('Image compression failed, uploading original:', e);
      }

      const photoId = generateId();
      const extension = file.name.split('.').pop();
      const objectPath = `${user.id}/${listingId}/${photoId}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('listing-photos')
        .upload(objectPath, fileToUpload);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('listing-photos').getPublicUrl(objectPath);
        photoUrls.push(publicUrl);
      }
    }

    const safeNum = (val: any) => {
      if (val === null || val === undefined || val === '') return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };

    // 2. Insert Listing with ALL FIELDS
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        id: listingId,
        host_id: user.id,
        slug: slug,
        title: listingData.title,
        type: listingData.listing_type || 'rental',
        property_category: listingData.type, // Apartment, Villa, etc.
        description: listingData.description,
        short_description: listingData.short_description,
        area: listingData.area,
        city_id: listingData.city_id, // Verified live column name is city_id
        county: listingData.county,
        landmark: listingData.landmark,
        latitude: safeNum(listingData.latitude),
        longitude: safeNum(listingData.longitude),
        
        // Structural
        bedrooms: safeNum(listingData.bedrooms),
        bathrooms: safeNum(listingData.bathrooms),
        toilets: safeNum(listingData.toilets),
        kitchens: safeNum(listingData.kitchens),
        balconies: safeNum(listingData.balconies),
        size_sqft: safeNum(listingData.size_sqft),
        floor_number: listingData.floor_number,
        total_floors: safeNum(listingData.total_floors),
        year_built: safeNum(listingData.year_built),
        furnishing_status: listingData.furnishing_status,
        parking_spaces: safeNum(listingData.parking_spaces),
        has_sq: listingData.has_sq,
        max_guests: safeNum(listingData.max_guests),
        
        // Pricing (New Specific Columns)
        price_per_night: safeNum(listingData.price_per_night),
        price_per_month: safeNum(listingData.price_per_month),
        sale_price: safeNum(listingData.sale_price),
        land_price: safeNum(listingData.land_price),
        commercial_rent_price: safeNum(listingData.commercial_rent_price),
        commercial_sale_price: safeNum(listingData.commercial_sale_price),
        total_price: listingData.category === 'Sale' || listingData.category === 'Land' || listingData.listing_type_detailed === 'commercial_sale' 
          ? safeNum(listingData.sale_price || listingData.land_price || listingData.commercial_sale_price) 
          : null,
        
        category: listingData.category,
        listing_type_detailed: listingData.listing_type_detailed,
        currency: listingData.currency || 'KES',
        is_negotiable: listingData.is_negotiable,
        
        // Terms (Only relevant for Rentals)
        deposit: listingData.category === 'Rental' ? safeNum(listingData.deposit) : undefined,
        deposit_months: listingData.category === 'Rental' ? safeNum(listingData.deposit_months) : undefined,
        lease_period: listingData.lease_period,
        lease_duration: listingData.lease_duration,
        service_charge_included: listingData.service_charge_included,
        available_from: listingData.available_from || null,
        
        // Specifics
        check_in_time: listingData.check_in_time,
        check_out_time: listingData.check_out_time,
        land_size: safeNum(listingData.land_size),
        property_size: safeNum(listingData.property_size),
        floor_area: safeNum(listingData.floor_area),
        parking_details: listingData.parking_details,
        utilities_details: listingData.utilities_details,
        
        // Sale/Land specific
        has_title_deed: listingData.has_title_deed,
        title_deed_status: listingData.title_deed_status,
        tenure_type: listingData.tenure_type,
        remaining_lease_years: safeNum(listingData.remaining_lease_years),
        property_condition: listingData.property_condition,
        
        // Contacts
        agent_name: listingData.agent_name,
        agency_name: listingData.agency_name,
        agent_phone: listingData.agent_phone,
        agent_whatsapp: listingData.agent_whatsapp,
        agent_email: listingData.agent_email,
        show_contact_publicly: listingData.show_contact_publicly,
        
        amenities_config: listingData.amenities_config || {},
        images: photoUrls, // Send photos directly to the 'images' column too
        status: 'active'
      })
      .select()
      .single();

    if (listingError) {
      console.error('DATABASE INSERT ERROR:', listingError);
      throw new Error(`Database Error: ${listingError.message}`);
    }

    // 3. Link Amenities for Search Connectivity
    if (listingData.amenities_config) {
      // Get the labels of all selected amenities (where value is true)
      const selectedLabels = Object.entries(listingData.amenities_config)
        .filter(([_, value]) => value === true)
        .map(([key, _]) => {
          // Map technical keys to human labels if necessary
          return key.replace(/_/g, ' '); 
        });

      if (selectedLabels.length > 0) {
        // Find the corresponding amenity IDs from the database
        const { data: amenityRecords } = await supabase
          .from('amenities')
          .select('id, label')
          .in('label', selectedLabels);

        if (amenityRecords && amenityRecords.length > 0) {
          const amenityInserts = amenityRecords.map(a => ({
            listing_id: listingId,
            amenity_id: a.id
          }));
          await supabase.from('listing_amenities').insert(amenityInserts);
        }
      }
    }

    // 4. Insert Photos
    if (photoUrls.length > 0) {
      const photoInserts = photoUrls.map((url, index) => ({
        listing_id: listingId,
        url: url,
        is_primary: index === 0,
        sort_order: index
      }));
      await supabase.from('listing_photos').insert(photoInserts);
    }

    return listing;
  },

  async updateListing(id: string, listingData: any) {
    const supabase = createClient();
    
    const safeNum = (val: any) => {
      if (val === null || val === undefined || val === '') return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };

    const { error } = await supabase
      .from('listings')
      .update({
        title: listingData.title,
        type: listingData.listing_type,
        property_category: listingData.type,
        description: listingData.description,
        short_description: listingData.short_description,
        area: listingData.area,
        city_id: listingData.city_id,
        county: listingData.county,
        landmark: listingData.landmark,
        latitude: safeNum(listingData.latitude),
        longitude: safeNum(listingData.longitude),
        bedrooms: safeNum(listingData.bedrooms),
        bathrooms: safeNum(listingData.bathrooms),
        toilets: safeNum(listingData.toilets),
        kitchens: safeNum(listingData.kitchens),
        balconies: safeNum(listingData.balconies),
        size_sqft: safeNum(listingData.size_sqft),
        floor_number: listingData.floor_number,
        total_floors: safeNum(listingData.total_floors),
        year_built: safeNum(listingData.year_built),
        furnishing_status: listingData.furnishing_status,
        parking_spaces: safeNum(listingData.parking_spaces),
        has_sq: listingData.has_sq,
        max_guests: safeNum(listingData.max_guests),
        price_per_night: safeNum(listingData.price_per_night),
        price_per_month: safeNum(listingData.price_per_month),
        sale_price: safeNum(listingData.sale_price),
        land_price: safeNum(listingData.land_price),
        commercial_rent_price: safeNum(listingData.commercial_rent_price),
        commercial_sale_price: safeNum(listingData.commercial_sale_price),
        total_price: listingData.category === 'Sale' || listingData.category === 'Land' || listingData.listing_type_detailed === 'commercial_sale' 
          ? safeNum(listingData.sale_price || listingData.land_price || listingData.commercial_sale_price) 
          : null,
        category: listingData.category,
        listing_type_detailed: listingData.listing_type_detailed,
        currency: listingData.currency,
        is_negotiable: listingData.is_negotiable,
        deposit: listingData.category === 'Rental' ? safeNum(listingData.deposit) : undefined,
        deposit_months: listingData.category === 'Rental' ? safeNum(listingData.deposit_months) : undefined,
        lease_period: listingData.lease_period,
        lease_duration: listingData.lease_duration,
        service_charge_included: listingData.service_charge_included,
        available_from: listingData.available_from || null,
        check_in_time: listingData.check_in_time,
        check_out_time: listingData.check_out_time,
        land_size: safeNum(listingData.land_size),
        property_size: safeNum(listingData.property_size),
        floor_area: safeNum(listingData.floor_area),
        parking_details: listingData.parking_details,
        utilities_details: listingData.utilities_details,
        has_title_deed: listingData.has_title_deed,
        title_deed_status: listingData.title_deed_status,
        tenure_type: listingData.tenure_type,
        remaining_lease_years: safeNum(listingData.remaining_lease_years),
        property_condition: listingData.property_condition,
        agent_name: listingData.agent_name,
        agency_name: listingData.agency_name,
        agent_phone: listingData.agent_phone,
        agent_whatsapp: listingData.agent_whatsapp,
        agent_email: listingData.agent_email,
        show_contact_publicly: listingData.show_contact_publicly,
        amenities_config: listingData.amenities_config || {}
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async deleteListing(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async deleteListingPhoto(photoId: string) {
    const supabase = createClient();
    
    // 1. Get the URL to find the storage path
    const { data: photo } = await supabase
      .from('listing_photos')
      .select('url')
      .eq('id', photoId)
      .single();

    if (photo?.url) {
      // Extract path from public URL
      const path = photo.url.split('/public/listing-photos/')[1];
      if (path) {
        await supabase.storage.from('listing-photos').remove([path]);
      }
    }

    // 2. Delete from DB
    const { error } = await supabase
      .from('listing_photos')
      .delete()
      .eq('id', photoId);

    if (error) throw error;
    return true;
  }
};
