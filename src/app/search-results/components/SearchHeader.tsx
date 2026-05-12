'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import type { FilterState } from './SearchResultsContent';
import { listingsService } from '@/services/listings';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
];

interface SearchHeaderProps {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resultsCount: number | null;
}

export default function SearchHeader({ filters, updateFilter, resultsCount }: SearchHeaderProps) {

  return (
    <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          placeholder="Search by area, street or building..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Results count */}
      <span className="text-sm text-gray-500 whitespace-nowrap hidden md:block">
        <span className="font-semibold text-gray-900">{resultsCount !== null ? `${resultsCount} listings` : 'Loading...'}</span> in {filters.city === 'all' ? 'Coastal Kenya' : filters.city}
      </span>

      {/* Sort */}
      <div className="relative ml-auto">
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value as FilterState['sortBy'])}
          className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={`sort-${opt.value}`} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}