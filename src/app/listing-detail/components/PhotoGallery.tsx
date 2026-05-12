'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

interface Photo {
  id?: string;
  url: string;
  alt?: string;
  is_primary?: boolean;
}

interface PhotoGalleryProps {
  photos?: Photo[];
}

export default function PhotoGallery({ photos = [] }: PhotoGalleryProps) {
  const [showAll, setShowAll] = useState(false);

  // Fallback if no photos
  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-[400px] bg-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-400">
        <ImageIcon size={48} className="mb-4 opacity-50" />
        <p className="font-medium">No photos available</p>
      </div>
    );
  }

  // Ensure we have a primary photo
  const primaryPhoto = photos.find(p => p.is_primary) || photos[0];
  const secondaryPhotos = photos.filter(p => p !== primaryPhoto).slice(0, 4);

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[500px]">
        {/* Main Photo */}
        <div 
          className={`relative cursor-pointer group ${secondaryPhotos.length > 0 ? 'md:col-span-2' : 'md:col-span-4'}`}
          onClick={() => setShowAll(true)}
        >
          <img 
            src={primaryPhoto.url} 
            alt={primaryPhoto.alt || "Property main view"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Secondary Photos */}
        {secondaryPhotos.length > 0 && (
          <div className="hidden md:grid col-span-2 grid-cols-2 grid-rows-2 gap-2">
            {secondaryPhotos.map((photo, index) => (
              <div 
                key={photo.id || index} 
                className="relative cursor-pointer group overflow-hidden"
                onClick={() => setShowAll(true)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.alt || `Property view ${index + 2}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        )}

        {/* Show All Button */}
        {photos.length > 5 && (
          <button 
            onClick={() => setShowAll(true)}
            className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold text-slate-800 shadow-lg border border-white/20 hover:bg-white hover:scale-105 transition-all flex items-center gap-2"
          >
            <ImageIcon size={16} />
            Show all {photos.length} photos
          </button>
        )}
      </div>

      {/* Full Screen Modal */}
      {showAll && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
          <div className="flex items-center justify-between p-6">
            <span className="text-white/60 text-sm font-medium">
              {photos.length} photos
            </span>
            <button 
              onClick={() => setShowAll(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-10 pb-20 space-y-4 max-w-4xl mx-auto w-full">
            {photos.map((photo, index) => (
              <div key={photo.id || index} className="w-full relative rounded-2xl overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={photo.alt || `Property view ${index + 1}`}
                  className="w-full h-auto object-contain bg-black/50"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
