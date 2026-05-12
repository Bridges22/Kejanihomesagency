import React from 'react';
import Link from 'next/link';
import ListingCard from '@/components/ui/ListingCard';
import { ArrowRight, Sparkles, Clock } from 'lucide-react';
import type { ListingCardData } from '@/components/ui/ListingCard';
import { listingsService } from '@/services/listings';

export default async function WeekendDeals() {
  let deals: ListingCardData[] = [];
  
  try {
    const data = await listingsService.getWeekendDeals();
    deals = data.map((l: any) => ({
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
      avgRating: l.avg_rating || 4.5,
      reviewCount: l.review_count || 12,
      unlockFee: l.unlock_fee || 499,
      primaryPhoto: l.photos?.find((p: any) => p.is_primary)?.url || l.photos?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      primaryPhotoAlt: l.title
    }));
  } catch (error) {
    console.error('Failed to fetch weekend deals:', error);
  }

  if (deals.length === 0) {
    // Fallback to sample deals for preview if DB is empty
    deals = [
      {
        id: 'sample-1',
        slug: 'beachfront-villa-diani',
        title: 'Luxury Beachfront Villa',
        type: 'airbnb',
        area: 'Diani Beach',
        city: 'Diani',
        bedrooms: 4,
        bathrooms: 4,
        pricePerNight: 18000,
        currency: 'KES',
        isVerified: true,
        isFeatured: true,
        avgRating: 4.9,
        reviewCount: 45,
        primaryPhoto: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2',
        primaryPhotoAlt: 'Luxury Beachfront Villa'
      },
      {
        id: 'sample-2',
        slug: 'modern-apartment-nyali',
        title: 'Modern Coastal Apartment',
        type: 'airbnb',
        area: 'Nyali',
        city: 'Mombasa',
        bedrooms: 2,
        bathrooms: 2,
        pricePerNight: 6500,
        currency: 'KES',
        isVerified: true,
        isFeatured: false,
        avgRating: 4.7,
        reviewCount: 28,
        primaryPhoto: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        primaryPhotoAlt: 'Modern Coastal Apartment'
      },
      {
        id: 'sample-3',
        slug: 'urban-loft-nairobi',
        title: 'Chic Urban Loft',
        type: 'airbnb',
        area: 'Westlands',
        city: 'Nairobi',
        bedrooms: 1,
        bathrooms: 1,
        pricePerNight: 4500,
        currency: 'KES',
        isVerified: true,
        isFeatured: true,
        avgRating: 4.8,
        reviewCount: 56,
        primaryPhoto: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        primaryPhotoAlt: 'Chic Urban Loft'
      },
      {
        id: 'sample-4',
        slug: 'safari-lodge-tsavo',
        title: 'Tsavo Safari Lodge',
        type: 'airbnb',
        area: 'Tsavo East',
        city: 'Taita Taveta',
        bedrooms: 3,
        bathrooms: 3,
        pricePerNight: 12000,
        currency: 'KES',
        isVerified: true,
        isFeatured: true,
        avgRating: 4.6,
        reviewCount: 32,
        primaryPhoto: '/images/locations/tsavo-safari-lodge-new.png',
        primaryPhotoAlt: 'Tsavo Safari Lodge'
      }
    ];
  }

  return (
    <section className="py-20 lg:py-24 bg-teal-50/30">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-widest mb-3">
              <Clock size={16} />
              Limited Time Offers
            </div>
            <h2 className="font-display text-3xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Deals for the weekend
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Find the perfect getaway for your next break. Verified stays with exclusive weekend rates.
            </p>
          </div>
          <Link
            href="/search-results?type=airbnb"
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-bold px-6 py-3.5 rounded-2xl transition-all border border-gray-200 shadow-sm self-start md:self-auto"
          >
            View all deals
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {deals.map((listing) => (
            <div key={listing.id} className="relative">
              <div className="absolute -top-3 -right-3 z-20 bg-rose-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
                <Sparkles size={12} />
                WEEKEND DEAL
              </div>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
