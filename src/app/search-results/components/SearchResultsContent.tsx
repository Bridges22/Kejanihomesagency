'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterSidebar from './FilterSidebar';
import ListingsGrid from './ListingsGrid';
import SearchHeader from './SearchHeader';
import ActiveFilterPills from './ActiveFilterPills';
import MapPanel from './MapPanel';
import { SlidersHorizontal, Map, List } from 'lucide-react';

export interface FilterState {
  type: 'all' | 'rental' | 'airbnb' | 'sale';
  category: string;
  city: string;
  search: string;
  priceMin: number;
  priceMax: number;
  bedrooms: number[];
  verifiedOnly: boolean;
  amenities: string[];
  amenityMode: 'AND' | 'OR';
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
}

const DEFAULT_FILTERS: FilterState = {
  type: 'all',
  category: 'all',
  city: 'all',
  search: '',
  priceMin: 0,
  priceMax: 500000,
  bedrooms: [],
  verifiedOnly: false,
  amenities: [],
  amenityMode: 'AND',
  sortBy: 'relevance',
};

export default function SearchResultsContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => {
    return {
      ...DEFAULT_FILTERS,
      city: searchParams.get('city') || 'all',
      type: (searchParams.get('type') as any) || 'all',
      category: searchParams.get('category') || 'all',
      search: searchParams.get('search') || ''
    };
  });
  
  // Sync filters if URL parameters change (e.g. browser back button)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      city: searchParams.get('city') || 'all',
      type: (searchParams.get('type') as any) || 'all',
      category: searchParams.get('category') || 'all',
      search: searchParams.get('search') || ''
    }));
  }, [searchParams]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [resultsCount, setResultsCount] = useState<number | null>(null);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const removeFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: DEFAULT_FILTERS[key] }));
  };

  const clearAll = () => setFilters(DEFAULT_FILTERS);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.type !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.city !== 'all') count++;
    if (filters.search !== '') count++;
    if (filters.priceMin > 0 || filters.priceMax < 500000) count++;
    if (filters.bedrooms.length > 0) count++;
    if (filters.verifiedOnly) count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    return count;
  }, [filters]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <SearchHeader filters={filters} updateFilter={updateFilter} resultsCount={resultsCount} />

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all relative"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Map / List toggle */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              <List size={15} />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              <Map size={15} />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Pills */}
      <ActiveFilterPills filters={filters} removeFilter={removeFilter} clearAll={clearAll} />

      {/* Main Content Layout */}
      <div className="flex gap-6 mt-4">
        {/* Sidebar — Desktop */}
        <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
          <FilterSidebar filters={filters} updateFilter={updateFilter} clearAll={clearAll} />
        </aside>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto animate-slide-up">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                <span className="font-display font-bold text-gray-900">Filters</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                >
                  Done
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar filters={filters} updateFilter={updateFilter} clearAll={clearAll} />
              </div>
            </div>
          </div>
        )}

        {/* Listings Grid + Map */}
        <div className="flex-1 min-w-0">
          <div className={`flex gap-6 ${viewMode === 'map' ? 'flex-col xl:flex-row' : ''}`}>
            <div className={viewMode === 'map' ? 'xl:flex-1' : 'w-full'}>
              <ListingsGrid filters={filters} onCountChange={setResultsCount} />
            </div>
            {viewMode === 'map' && (
              <div className="xl:w-[400px] xl:flex-shrink-0">
                <MapPanel />
              </div>
            )}
          </div>
        </div>

        {/* Sticky Map — Desktop always visible on right */}
        {viewMode === 'list' && (
          <aside className="hidden xl:block w-[380px] 2xl:w-[420px] flex-shrink-0">
            <div className="sticky top-20">
              <MapPanel />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}