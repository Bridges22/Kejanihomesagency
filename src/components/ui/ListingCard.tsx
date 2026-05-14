'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { Heart, MapPin, Bed, Bath, Users, ShieldCheck, Star, Zap, TrendingUp, ChevronRight } from 'lucide-react';

import RatingBadge from '@/components/ui/RatingBadge';

export interface ListingCardData {
  id: string;
  slug: string;
  title: string;
  type: 'rental' | 'airbnb' | 'sale';
  property_category?: string;
  area: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests?: number;
  category?: string;
  listing_type_detailed?: string;
  price_per_night?: number;
  price_per_month?: number;
  sale_price?: number;
  land_price?: number;
  commercial_rent_price?: number;
  commercial_sale_price?: number;
  check_in_time?: string;
  check_out_time?: string;
  land_size?: string;
  property_size?: string;
  title_deed_status?: string;
  utilities_details?: string;
  parking_details?: string;
  lease_duration?: string;
  deposit?: string;
  total_price?: number;
  totalPrice?: number; // Legacy support
  currency: string;
  isVerified: boolean;
  isFeatured: boolean;
  avgRating?: number;
  reviewCount?: number;
  unlockFee?: number;
  primaryPhoto: string;
  primaryPhotoAlt: string;
}

interface ListingCardProps {
  listing: ListingCardData;
  variant?: 'grid' | 'list' | 'compact';
}

export default function ListingCard({ listing, variant = 'grid' }: ListingCardProps) {
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  let displayPrice = '';
  let priceLabel = '';
  
  // Check the new specific category field first
  if (listing.category === 'Airbnb' || listing.category === 'Short Stay' || listing.type === 'airbnb') {
    displayPrice = `${listing.currency} ${(listing.price_per_night ?? 0).toLocaleString()}`;
    priceLabel = 'per night';
  } else if (listing.category === 'Rental' || listing.category === 'Rent' || listing.type === 'rental') {
    displayPrice = `${listing.currency} ${(listing.price_per_month ?? 0).toLocaleString()}`;
    priceLabel = 'per month';
  } else if (listing.category === 'Land') {
    displayPrice = `${listing.currency} ${(listing.price_per_night || listing.land_price || listing.total_price || listing.totalPrice || 0).toLocaleString()}`;
    priceLabel = 'Total';
  } else if (listing.category === 'Commercial') {
    if (listing.listing_type_detailed === 'commercial_rent') {
      displayPrice = `${listing.currency} ${(listing.commercial_rent_price ?? 0).toLocaleString()}`;
      priceLabel = 'per month';
    } else {
      displayPrice = `${listing.currency} ${(listing.commercial_sale_price ?? listing.total_price ?? listing.totalPrice ?? 0).toLocaleString()}`;
      priceLabel = 'Total';
    }
  } else if (listing.category === 'Sale' || listing.type === 'sale') {
    displayPrice = `${listing.currency} ${(listing.sale_price ?? listing.total_price ?? listing.totalPrice ?? 0).toLocaleString()}`;
    priceLabel = 'Total';
  } else {
    displayPrice = `${listing.currency} 0`;
    priceLabel = 'Contact for price';
  }

  if (variant === 'list') {
    return (
      <div className="relative group flex flex-col md:flex-row bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-card-hover transition-all duration-300">
        {/* Photo Container */}
        <div className="relative w-full md:w-72 lg:w-80 flex-shrink-0 aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-100">
          <AppImage
            src={listing.primaryPhoto}
            alt={listing.primaryPhotoAlt}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className={`object-cover group-hover:scale-105 transition-transform duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          <button
            onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
            className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 z-10 ${
              saved
                ? 'bg-rose-500 text-white shadow-lg scale-110'
                : 'bg-white/80 text-gray-500 hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
          </button>

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {listing.isVerified && (
              <span className="badge-verified flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <ShieldCheck size={12} />
                Verified
              </span>
            )}
            {listing.isFeatured && (
              <span className="badge-featured flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <TrendingUp size={12} />
                Preferred
              </span>
            )}
          </div>
        </div>

        {/* Info Container */}
        <div className="flex-1 flex flex-col p-5 lg:p-6 min-w-0">
          <div className="flex justify-between items-start gap-4 mb-2">
            <div className="min-w-0 flex-1">
              <Link href={`/listing-detail/${listing.slug}`} className="before:absolute before:inset-0 before:z-0">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-1 mb-1 relative z-10">
                  {listing.title}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 text-teal-600 text-sm font-semibold mb-2">
                <MapPin size={14} />
                <span className="underline decoration-teal-600/30 underline-offset-4 cursor-pointer hover:text-teal-700">{listing.area}, {listing.city}</span>
                <span className="text-gray-400 font-normal ml-1">• Show on map</span>
              </div>
            </div>
            
            {listing.avgRating && listing.avgRating > 0 ? (
              <RatingBadge 
                rating={listing.avgRating * 2} // Converting 5-star to 10-point scale for Booking feel
                count={listing.reviewCount} 
              />
            ) : (
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100 font-medium whitespace-nowrap">No reviews yet</span>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {/* Features/Highlights like Booking */}
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 flex items-center gap-1">
                <Zap size={10} />
                Instant Booking
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                {listing.type === 'rental' ? 'Long-term' : listing.type === 'sale' ? 'For Sale' : 'Short Stay'}
              </span>
              {listing.property_category !== 'Land' && listing.bedrooms > 0 && (
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-1 bg-gray-50 text-gray-600 rounded-md border border-gray-200">
                  {listing.bedrooms} Bedroom
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {listing.property_category === 'Land' 
                ? `Secure this prime land located in the heart of ${listing.area}. Fully verified and ready for purchase.` 
                : `Experience modern coastal living in this beautiful ${listing.bedrooms} bedroom property located in the heart of ${listing.area}. Fully verified and ready for you to move in.`
              }
            </p>
          </div>

          {/* Pricing Row */}
          <div className="mt-auto pt-4 flex items-end justify-between border-t border-gray-50 relative z-10">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium mb-1">Price {priceLabel}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-gray-900 tabular-nums">
                  {displayPrice}
                </span>
              </div>
              <span className="text-[11px] text-gray-400">+ no hidden fees</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original Grid Layout
  return (
    <div className="relative group card overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5">
      {/* Photo */}
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-100" />
        )}
        <AppImage
          src={listing.primaryPhoto}
          alt={listing.primaryPhotoAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {listing.isVerified && (
            <span className="badge-verified flex items-center gap-1 shadow-md backdrop-blur-md">
              <ShieldCheck size={11} />
              Verified
            </span>
          )}
          {listing.isFeatured && (
            <span className="badge-featured flex items-center gap-1 shadow-md backdrop-blur-md">
              <TrendingUp size={11} />
              Preferred
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            saved
              ? 'bg-rose-500 text-white shadow-md scale-110'
              : 'bg-white/90 text-gray-500 hover:bg-white hover:text-rose-500 opacity-0 group-hover:opacity-100'
          }`}
          aria-label={saved ? 'Remove from saved' : 'Save listing'}
        >
          <Heart size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Link href={`/listing-detail/${listing.slug}`} className="min-w-0 before:absolute before:inset-0 before:z-0">
            <h3 className="font-display text-[15px] font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-teal-700 transition-colors relative z-10">
              {listing.title}
            </h3>
          </Link>
          {listing.avgRating && listing.avgRating > 0 ? (
            <RatingBadge 
              rating={listing.avgRating * 2} 
              size="sm" 
              showLabel={false} 
            />
          ) : (
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100 font-medium whitespace-nowrap">New</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-[11px] font-medium mb-3">
          <MapPin size={12} className="text-teal-500 flex-shrink-0" />
          <span className="truncate">{listing.area}, {listing.city}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-4">
          {listing.property_category !== 'Land' ? (
            <>
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600 px-2 py-0.5 bg-gray-50 rounded-md border border-gray-100">
                <Bed size={12} className="text-gray-400" />
                <span>{listing.bedrooms} bd</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600 px-2 py-0.5 bg-gray-50 rounded-md border border-gray-100">
                <Bath size={12} className="text-gray-400" />
                <span>{listing.bathrooms} ba</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600 px-2 py-0.5 bg-gray-50 rounded-md border border-gray-100">
              <MapPin size={12} className="text-gray-400" />
              <span>Land Plot</span>
            </div>
          )}
          {listing.type === 'airbnb' && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 px-2 py-0.5 bg-rose-50 rounded-md border border-rose-100 ml-auto">
              Airbnb
            </div>
          )}
          {listing.type === 'sale' && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-md border border-blue-100 ml-auto">
              For Sale
            </div>
          )}
        </div>

        {/* Price & CTA row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex flex-col relative z-10">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{priceLabel}</span>
            <span className="font-display text-base font-black text-gray-900 tabular-nums">
              {displayPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}