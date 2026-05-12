'use client';

import React from 'react';

export default function ListingSkeleton() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-48 bg-gray-200 rounded mb-6"></div>

      {/* Photo Gallery & Map Skeleton */}
      <div className="mt-4 mb-8 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="h-[450px] w-full bg-gray-200 rounded-3xl"></div>
        </div>
        <div className="h-[400px] lg:h-auto">
          <div className="h-full w-full bg-gray-200 rounded-3xl"></div>
        </div>
      </div>

      {/* Main Content + Sidebar Skeleton */}
      <div className="flex flex-col xl:flex-row gap-10">
        <div className="flex-1 min-w-0 space-y-8">
          {/* Main Info */}
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-gray-200 rounded-xl"></div>
            <div className="h-6 w-1/4 bg-gray-200 rounded-lg"></div>
            <div className="flex gap-4">
              <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-100 rounded"></div>
            <div className="h-4 w-full bg-gray-100 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-12 bg-gray-50 rounded-2xl"></div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="xl:w-[380px] 2xl:w-[420px]">
          <div className="h-[500px] bg-gray-100 rounded-[32px]"></div>
        </div>
      </div>
    </div>
  );
}
