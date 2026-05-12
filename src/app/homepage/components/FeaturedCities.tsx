import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { ArrowRight, MapPin } from 'lucide-react';
import { listingsService } from '@/services/listings';

export default async function FeaturedCities() {
  let cities: any[] = [];
  try {
    cities = await listingsService.getCities();
  } catch (err) {
    console.error('Failed to fetch cities', err);
  }

  // Use the generated images for matching cities
  const cityImages: Record<string, string> = {
    'diani': '/images/locations/diani.png',
    'nyali': '/images/locations/nyali.png',
    'nairobi': '/images/locations/nairobi.png',
    'taita-taveta': '/images/locations/taita-taveta.png',
    'busia': 'https://images.unsplash.com/photo-1580237072617-771c3ecc4a24',
    'malindi': 'https://images.unsplash.com/photo-1544161513-0179fe746fd5',
    'kisumu': 'https://images.unsplash.com/photo-1731181475186-3633474eb8ca',
    'mombasa': 'https://images.unsplash.com/photo-1580237072617-771c3ecc4a24',
    'watamu': 'https://images.unsplash.com/photo-1544161513-0179fe746fd5',
    'kilifi': 'https://images.unsplash.com/photo-1516690561799-46d8f74f90f6',
    'lamu': 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b',
    'kwale': 'https://images.unsplash.com/photo-1518111956557-ca5e592652a6',
    'kombani': 'https://images.unsplash.com/photo-1544161513-0179fe746fd5',
  };

  if (cities.length === 0) return null;

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-black text-gray-900 mb-3 tracking-tight">
              Trending destinations
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
              Explore the most popular locations across Kenya.
            </p>
          </div>
          <Link
            href="/search-results"
            className="hidden sm:flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-all border border-gray-100"
          >
            Explore all
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Compact Grid Layout - Booking.com Small Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {cities.filter(city => city.slug !== 'kwale').map((city) => (
            <Link
              key={city.id}
              href={`/search-results?city=${city.slug}`}
              className="group flex flex-col gap-3"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500">
                <AppImage
                  src={cityImages[city.slug] || city.image_url || "https://images.unsplash.com/photo-1699530259689-d0c8bafe20a4"}
                  alt={city.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors mb-0.5">
                  {city.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {city.listing_count || 0} properties available
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}