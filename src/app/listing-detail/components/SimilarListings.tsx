import React from 'react';
import Link from 'next/link';
import ListingCard from '@/components/ui/ListingCard';
import { ArrowRight } from 'lucide-react';
import type { ListingCardData } from '@/components/ui/ListingCard';
import { listingsService } from '@/services/listings';

export default async function SimilarListings({ currentId }: {currentId: string;}) {
  let similar: ListingCardData[] = [];
  try {
    const data = await listingsService.getListings({});
    similar = data
      .filter((l: any) => l.id !== currentId)
      .slice(0, 3)
      .map((l: any) => ({
        id: l.id,
        slug: l.slug,
        title: l.title,
        type: l.type as 'rental' | 'airbnb',
        area: l.area || '',
        city: l.cities?.name || '',
        bedrooms: l.bedrooms,
        bathrooms: l.bathrooms,
        pricePerMonth: l.price_per_month,
        pricePerNight: l.price_per_night,
        currency: l.currency || 'KES',
        isVerified: l.is_verified,
        isFeatured: l.is_featured,
        unlockFee: l.unlock_fee || 499,
        primaryPhoto: l.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        primaryPhotoAlt: l.title
      }));
  } catch (error) {
    console.error('Failed to fetch similar listings:', error);
  }

  if (similar.length === 0) return null;

  return (
    <div className="border-t border-gray-100 pt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-gray-900">Similar listings nearby</h2>
        <Link
          href="/search-results"
          className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
          
          Browse all
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {similar.map((listing) =>
        <ListingCard key={listing.id} listing={listing} />
        )}
      </div>
    </div>);

}