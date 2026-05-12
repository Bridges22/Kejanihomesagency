import React from 'react';

export default function ListingCardSkeleton({ count = 4, variant = 'grid' }: { count?: number, variant?: 'grid' | 'list' }) {
  if (variant === 'list') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={`skeleton-list-${i}`} className="flex flex-col md:flex-row bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse h-[280px]">
            <div className="w-full md:w-72 lg:w-80 flex-shrink-0 bg-gray-200" />
            <div className="flex-1 p-6 space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
              </div>
              <div className="flex gap-2">
                <div className="w-20 h-6 bg-gray-100 rounded-md" />
                <div className="w-20 h-6 bg-gray-100 rounded-md" />
                <div className="w-20 h-6 bg-gray-100 rounded-md" />
              </div>
              <div className="h-16 bg-gray-50 rounded-xl w-full" />
              <div className="flex justify-between items-end pt-4">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-16" />
                  <div className="h-8 bg-gray-200 rounded-lg w-32" />
                </div>
                <div className="h-12 bg-gray-200 rounded-2xl w-40" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={`skeleton-card-${i}`} className="card overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded-lg w-4/5" />
            <div className="h-3 bg-gray-100 rounded-lg w-2/5" />
            <div className="flex gap-3">
              <div className="h-3 bg-gray-100 rounded w-12" />
              <div className="h-3 bg-gray-100 rounded w-12" />
              <div className="h-3 bg-gray-100 rounded w-14" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
              <div className="h-5 bg-gray-200 rounded w-28" />
              <div className="h-6 bg-gray-100 rounded-lg w-20" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}