'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { listingsService } from '@/services/listings';

import ListingCard from '@/components/ui/ListingCard';
import ListingCardSkeleton from '@/components/ui/ListingCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import type { FilterState } from './SearchResultsContent';
import type { ListingCardData } from '@/components/ui/ListingCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Removed ALL_LISTINGS - data now comes from Supabase


const ITEMS_PER_PAGE = 8;

interface ListingsGridProps {
  filters: FilterState;
  onCountChange?: (count: number) => void;
}

export default function ListingsGrid({ filters, onCountChange }: ListingsGridProps) {
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listingsService.getListings({
        city: filters.city,
        type: filters.type,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        bedrooms: filters.bedrooms,
        search: filters.search,
        sortBy: filters.sortBy,
        amenityMode: filters.amenityMode,
        amenities: filters.amenities,
        verifiedOnly: filters.verifiedOnly
      });

      if (!data || data.length === 0) {
        setListings([]);
        setTotalCount(0);
        return;
      }

      // Map Supabase data to frontend interface
      const mapped: ListingCardData[] = data.map((l: any) => ({
        id: l.id,
        slug: l.slug,
        title: l.title,
        type: l.type as 'rental' | 'airbnb' | 'sale',
        property_category: l.property_category,
        area: l.area || '',
        city: l.cities?.name || l.city || '', // Fallback to raw city text if cities relation is null
        bedrooms: l.bedrooms,
        bathrooms: l.bathrooms,
        maxGuests: l.max_guests,
        price_per_month: l.price_per_month,
        price_per_night: l.price_per_night,
        sale_price: l.sale_price,
        total_price: l.total_price,
        currency: l.currency || 'KES',
        isVerified: l.is_verified,
        isFeatured: l.is_featured,
        avgRating: l.avg_rating || 0,
        reviewCount: l.review_count || 0,
        unlockFee: l.unlock_fee || 499,
        primaryPhoto: l.photos?.find((p: any) => p.is_primary)?.url || l.photos?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        primaryPhotoAlt: l.title
      }));

      // Client-side category filtering
      let filtered = mapped;
      if (filters.category && filters.category !== 'all') {
        filtered = mapped.filter(l => l.property_category === filters.category);
      } else {
        // As requested: Never mix lands with houses. If no category is specified, hide lands.
        filtered = mapped.filter(l => l.property_category !== 'Land');
      }

      setListings(filtered);
      setTotalCount(filtered.length);
      if (onCountChange) onCountChange(filtered.length);
    } catch (err) {
      console.error('Failed to load listings', err);
      setListings([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const paginated = listings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <ListingCardSkeleton count={5} variant="list" />
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <EmptyState
        icon="search"
        title="No listings match your search"
        subtitle="Try widening your search terms or filters to see more results."
        ctaLabel="Clear all filters"
        onCta={() => window.location.reload()} />);
  }

  return (
    <div className="space-y-6">
      {/* Search Result Summary */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {filters.city && filters.city !== 'all' ? `${filters.city.charAt(0).toUpperCase() + filters.city.slice(1)}: ` : ''}
            {totalCount} properties found
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing <span className="font-semibold text-gray-900">{(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, totalCount)}</span> results
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {paginated.map((listing) =>
          <ListingCard key={listing.id} listing={listing} variant="list" />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 &&
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={`page-${p}`}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                p === page ?
                'bg-teal-600 text-white shadow-sm' :
                'text-gray-500 hover:bg-gray-100'}`
                }>
                
                  {p}
                </button>);

          })}
          </div>

          <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      }
    </div>);

}