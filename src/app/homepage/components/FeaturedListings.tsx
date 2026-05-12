import React from 'react';
import Link from 'next/link';
import ListingCard from '@/components/ui/ListingCard';
import { ArrowRight } from 'lucide-react';
import type { ListingCardData } from '@/components/ui/ListingCard';
import { listingsService } from '@/services/listings';

export default async function FeaturedListings() {
  let featured: ListingCardData[] = [];
  
  try {
    const data = await listingsService.getFeaturedListings();
    featured = data.map((l: any) => ({
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
      avgRating: 4.8,
      reviewCount: 20,
      unlockFee: l.unlock_fee || 499,
      primaryPhoto: l.photos?.find((p: any) => p.is_primary)?.url || l.photos?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      primaryPhotoAlt: l.title
    }));
  } catch (error) {
    console.error('Failed to fetch featured listings:', error);
  }

  if (featured.length === 0) return null;
  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-2">Hand-Picked</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900">
              Featured listings this week
            </h2>
          </div>
          <Link
            href="/search-results"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
            
            Browse all listings
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/search-results" className="btn-primary inline-flex">
            Browse all listings
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>);

}