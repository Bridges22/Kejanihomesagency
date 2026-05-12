'use client';

import React, { useState } from 'react';
import { ShieldCheck, Star, Eye, Unlock, Bed, Bath, Maximize, Building2, Calendar, Share2, Heart, Flag, Sparkles, Home, MapPin, Tag } from 'lucide-react';
import { toast } from 'sonner';
import RatingBadge from '@/components/ui/RatingBadge';

interface ListingMainInfoProps {
  listing: any;
}

export default function ListingMainInfo({ listing }: ListingMainInfoProps) {
  const [saved, setSaved] = useState(false);

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      const shareData = {
        title: listing.title,
        text: `Check out this property: ${listing.title} at ${listing.area}`,
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // User cancelled or share failed, fallback to copy
          navigator.clipboard.writeText(window.location.href);
          toast.success('Link copied to clipboard');
        }
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? 'Removed from saved listings' : 'Added to saved listings');
  };

  const isSale = listing.listing_type === 'sale' || listing.type === 'sale';
  const isAirbnb = listing.listing_type === 'airbnb' || listing.type === 'airbnb';
  
  const price = isSale 
    ? (listing.total_price || listing.price)
    : (isAirbnb ? (listing.pricePerNight || listing.price) : (listing.pricePerMonth || listing.price));

  const frequencyLabel = isSale 
    ? 'Total Price' 
    : (isAirbnb ? 'Per Night' : 'Per Month');

  return (
    <div>
      {/* Top row: badges + actions */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {listing.isVerified && (
            <span className="badge-verified">
              <ShieldCheck size={12} />
              Verified Agency Listing
            </span>
          )}
          {listing.isFeatured && (
            <span className="badge-featured inline-flex items-center gap-1">
              <Star size={12} className="fill-amber-400 text-amber-400" /> Featured
            </span>
          )}
          <span className={`${(listing.listing_type === 'rental' || listing.type === 'rental') ? 'badge-rental' : (listing.listing_type === 'airbnb' || listing.type === 'airbnb') ? 'badge-airbnb' : 'badge-sale'} inline-flex items-center gap-1.5`}>
            {isSale ? <><Tag size={14} /> For Sale</> : isAirbnb ? <><Home size={14} /> Short Stay</> : <><Home size={14} /> For Rent</>}
          </span>
          {listing.is_negotiable && (
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-widest border border-teal-100">
              Negotiable
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Share2 size={18} />
          </button>
          <button
            onClick={handleSave}
            className={`p-2 rounded-xl transition-all duration-200 ${
              saved
                ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' :'hover:bg-gray-100 text-gray-500 hover:text-rose-500'
            }`}
          >
            <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Price + Title */}
      <div className="mb-4">
        <h1 className="font-display text-3xl lg:text-4xl font-black text-gray-900 mb-2 leading-tight tracking-tight">
          {listing.title}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-teal-600 text-sm font-semibold">
            <MapPin size={16} />
            <span className="underline decoration-teal-600/30 underline-offset-4 cursor-pointer hover:text-teal-700">
              {listing.area}, {listing.city}, {listing.country}
            </span>
            <span className="text-gray-400 font-normal ml-1">• Show on map</span>
          </div>
          
          {listing.avgRating && (
            <RatingBadge 
              rating={listing.avgRating * 2} 
              count={listing.reviewCount} 
              size="lg"
            />
          )}
        </div>
      </div>

      {/* Key specs grid */}
      <div className={`grid ${listing.property_category === 'Land' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'} gap-3 p-4 bg-gray-50 rounded-2xl mb-4`}>
        {listing.property_category !== 'Land' && (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                <Bed size={16} className="text-teal-600" />
              </div>
              <div>
                <div className="font-display text-sm font-bold text-gray-900">
                  {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BR`}
                </div>
                <div className="text-xs text-gray-400">Bedrooms</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                <Bath size={16} className="text-blue-500" />
              </div>
              <div>
                <div className="font-display text-sm font-bold text-gray-900">{listing.bathrooms}</div>
                <div className="text-xs text-gray-400">Bathrooms</div>
              </div>
            </div>
          </>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
            <Maximize size={16} className="text-purple-500" />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-gray-900">{listing.size_sqft || '—'} {listing.property_category === 'Land' ? 'Acres/Sqft' : 'sqft'}</div>
            <div className="text-xs text-gray-400">Size</div>
          </div>
        </div>
        {listing.property_category !== 'Land' ? (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
              <Building2 size={16} className="text-amber-500" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-gray-900">
                {listing.floor ? `Floor ${listing.floor}` : 'Ground'}
              </div>
              <div className="text-xs text-gray-400">Level</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
              <MapPin size={16} className="text-amber-500" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-gray-900">Land Plot</div>
              <div className="text-xs text-gray-400">Property Type</div>
            </div>
          </div>
        )}
      </div>

      {/* Social proof stats */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <Eye size={13} className="text-gray-300" />
          {(listing.viewCount || 0).toLocaleString()} views
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={13} className="text-gray-300" />
          Listed {listing.listedAt}
        </span>
      </div>
    </div>
  );
}
