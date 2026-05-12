'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, ShieldCheck, Wifi, Car, Waves, Dumbbell, 
  Shield, Wind, Droplets, Zap, Layout, Dog, MapPin, Star, Search,
  Umbrella, Mountain, Heart, Trophy, Building2, Home, Map as MapIcon,
  Accessibility, Globe, Sparkles, Maximize, FileText, Trees, Fence, Navigation
} from 'lucide-react';
import type { FilterState } from './SearchResultsContent';

interface FilterSidebarProps {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearAll: () => void;
}

interface FilterItem {
  id: string;
  label: string;
  count: number;
}

interface SectionProps {
  label: string;
  items: FilterItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  showSearch?: boolean;
  maxItems?: number;
}

function FilterSection({ 
  label, items, selectedIds, onToggle, icon, 
  defaultExpanded = true, showSearch = false, maxItems = 6 
}: SectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, maxItems);

  return (
    <div className="p-4 border-b border-gray-100 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left group mb-2"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-display text-[13px] font-black text-gray-900 uppercase tracking-tight">{label}</span>
        </div>
        {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>

      {expanded && (
        <div className="space-y-2 mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {showSearch && (
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder={`Search ${label.toLowerCase()}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          )}
          
          {displayedItems.map((item) => {
            const isChecked = selectedIds.includes(item.label);
            return (
              <label key={item.id} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    isChecked ? 'bg-teal-600 border-teal-600' : 'border-gray-300 group-hover:border-teal-400 bg-white'
                  }`}>
                    {isChecked && (
                      <svg width="10" height="8" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggle(item.label)}
                    className="sr-only"
                  />
                  <span className={`text-[13px] transition-colors ${isChecked ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900 font-medium'}`}>
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium tabular-nums">{item.count}</span>
              </label>
            );
          })}

          {filteredItems.length > maxItems && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[11px] font-bold text-teal-600 hover:text-teal-700 mt-2 block"
            >
              {showAll ? 'Show less' : `Show all ${filteredItems.length}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar({ filters, updateFilter, clearAll }: FilterSidebarProps) {
  // We'll use local state for many of these fine-grained filters since the backend 
  // might not support them all yet, but we want the UI to be interactive.
  const toggleAmenity = (id: string) => {
    const current = filters.amenities;
    if (current.includes(id)) {
      updateFilter('amenities', current.filter((a) => a !== id));
    } else {
      updateFilter('amenities', [...current, id]);
    }
  };

  const selectedIds = filters.amenities;

  return (
    <div className="space-y-4">
      {/* Map View Trigger */}
      <div className="relative group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 shadow-sm h-32 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b" 
          alt="Map Preview"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/30 transition-colors" />
        <button className="relative z-10 px-5 py-2.5 bg-white shadow-xl rounded-xl text-sm font-bold text-gray-900 border border-gray-100 flex items-center gap-2 hover:bg-gray-50 active:scale-95 transition-all">
          <MapPin size={16} className="text-teal-600" />
          Show on map
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-slate-900/5 overflow-hidden">
        {/* Main Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-black text-gray-900">Filter by:</h3>
          </div>
          {(selectedIds.length > 0 || Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== 'all' && v !== 0 && v !== false)) && (
            <button
              onClick={() => { clearAll(); }}
              className="text-[11px] font-bold text-teal-600 hover:text-teal-700 underline uppercase tracking-wider"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-50">
          {/* Smart Filters */}
          <div className="p-5 bg-teal-50/20 border-b border-gray-100">
            <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest mb-3">Smart Filters</h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Ex: place with great reviews..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm"
              />
            </div>
            <button className="w-full mt-3 py-2.5 bg-gray-900 text-white text-[11px] font-black rounded-xl hover:bg-teal-600 transition-colors uppercase tracking-widest shadow-lg shadow-gray-900/10">
              Find properties
            </button>
          </div>

          {/* Popular Filters */}
          <FilterSection
            label="Popular filters"
            icon={<Sparkles size={14} className="text-teal-600" />}
            items={[
              { id: 'pop-beach', label: 'Beach', count: 169 },
              { id: 'pop-pool', label: 'Swimming pool', count: 284 },
              { id: 'pop-wifi', label: 'Free WiFi', count: 361 },
              { id: 'pop-5star', label: '5 stars', count: 11 },
              { id: 'pop-superb', label: 'Superb: 9+', count: 94 },
            ]}
            selectedIds={selectedIds}
            onToggle={toggleAmenity}
          />

          {/* Property Type */}
          <FilterSection
            label="Property type"
            icon={<Building2 size={14} className="text-gray-400" />}
            items={[
              { id: 'type-hotels', label: 'Hotels', count: 60 },
              { id: 'type-apartments', label: 'Apartments', count: 190 },
              { id: 'type-land', label: 'Land', count: 42 },
              { id: 'type-resorts', label: 'Resorts', count: 16 },
              { id: 'type-holiday', label: 'Holiday homes', count: 34 },
              { id: 'type-villas', label: 'Villas', count: 57 },
              { id: 'type-hostels', label: 'Hostels', count: 3 },
              { id: 'type-lodges', label: 'Lodges', count: 1 },
              { id: 'type-guesthouses', label: 'Guest houses', count: 14 },
              { id: 'type-chalets', label: 'Chalets', count: 2 },
              { id: 'type-bnb', label: 'Bed and breakfasts', count: 17 },
            ]}
            selectedIds={selectedIds}
            onToggle={toggleAmenity}
          />
          
          {/* Land Specific Filters - Only shown if Land is selected or by default for discoverability */}
          {(filters.category === 'Land' || filters.category === 'all') && (
            <>
              {/* Land Size */}
              <FilterSection
                label="Land size"
                icon={<Maximize size={14} className="text-gray-400" />}
                items={[
                  { id: 'size-1-8', label: '1/8 Acre', count: 12 },
                  { id: 'size-1-4', label: '1/4 Acre', count: 8 },
                  { id: 'size-1-2', label: '1/2 Acre', count: 5 },
                  { id: 'size-1', label: '1 Acre', count: 10 },
                  { id: 'size-5plus', label: '5+ Acres', count: 7 },
                ]}
                selectedIds={selectedIds}
                onToggle={toggleAmenity}
              />

              {/* Title Type */}
              <FilterSection
                label="Title type"
                icon={<FileText size={14} className="text-gray-400" />}
                items={[
                  { id: 'title-freehold', label: 'Freehold', count: 24 },
                  { id: 'title-leasehold', label: 'Leasehold', count: 15 },
                  { id: 'title-certificate', label: 'Certificate of Lease', count: 3 },
                ]}
                selectedIds={selectedIds}
                onToggle={toggleAmenity}
              />

              {/* Land Features */}
              <FilterSection
                label="Land features"
                icon={<Trees size={14} className="text-gray-400" />}
                items={[
                  { id: 'feat-fenced', label: 'Fenced', count: 18 },
                  { id: 'feat-water', label: 'Water on-site', count: 22 },
                  { id: 'feat-electricity', label: 'Electricity on-site', count: 25 },
                  { id: 'feat-road', label: 'Near main road', count: 30 },
                  { id: 'feat-cleared', label: 'Cleared land', count: 12 },
                ]}
                selectedIds={selectedIds}
                onToggle={toggleAmenity}
              />
            </>
          )}

          {/* Property Rating */}
          <FilterSection
            label="Property rating"
            icon={<Star size={14} className="text-gray-400" />}
            items={[
              { id: 'rate-2', label: '2 stars', count: 2 },
              { id: 'rate-3', label: '3 stars', count: 57 },
              { id: 'rate-4', label: '4 stars', count: 100 },
              { id: 'rate-5', label: '5 stars', count: 11 },
            ]}
            selectedIds={selectedIds}
            onToggle={toggleAmenity}
          />

          {/* Facilities */}
          <FilterSection
            label="Facilities"
            icon={<Zap size={14} className="text-gray-400" />}
            showSearch
            items={[
              { id: 'fac-parking', label: 'Parking', count: 361 },
              { id: 'fac-pool', label: 'Swimming pool', count: 284 },
              { id: 'fac-hottub', label: 'Hot tub/Jacuzzi', count: 10 },
              { id: 'fac-spa', label: 'Spa and wellness centre', count: 27 },
              { id: 'fac-freepark', label: 'Free parking', count: 359 },
              { id: 'fac-wifi', label: 'WiFi', count: 361 },
              { id: 'fac-gym', label: 'Fitness centre', count: 24 },
            ]}
            selectedIds={selectedIds}
            onToggle={toggleAmenity}
          />

          {/* Room Facilities */}
          <FilterSection
            label="Room facilities"
            icon={<Layout size={14} className="text-gray-400" />}
            items={[
              { id: 'room-dressing', label: 'Dressing room', count: 48 },
              { id: 'room-landmark', label: 'Landmark view', count: 19 },
              { id: 'room-entrance', label: 'Private entrance', count: 160 },
              { id: 'room-linen', label: 'Linen', count: 244 },
              { id: 'room-plunge', label: 'Plunge pool', count: 44 },
            ]}
            selectedIds={selectedIds}
            onToggle={toggleAmenity}
          />

          {/* Review Score */}
          <FilterSection
            label="Review score"
            icon={<Heart size={14} className="text-gray-400" />}
            items={[
              { id: 'rev-superb', label: 'Superb: 9+', count: 94 },
              { id: 'rev-verygood', label: 'Very good: 8+', count: 185 },
              { id: 'rev-good', label: 'Good: 7+', count: 228 },
              { id: 'rev-pleasant', label: 'Pleasant: 6+', count: 259 },
            ]}
            selectedIds={selectedIds}
            onToggle={toggleAmenity}
          />

          {/* Accessibility */}
          <FilterSection
            label="Accessibility"
            icon={<Accessibility size={14} className="text-gray-400" />}
            items={[
              { id: 'acc-toilet-rails', label: 'Toilet with grab rails', count: 3 },
              { id: 'acc-emergency', label: 'Emergency cord in bathroom', count: 3 },
              { id: 'acc-raised-toilet', label: 'Raised toilet', count: 4 },
              { id: 'acc-lower-sink', label: 'Lower bathroom sink', count: 6 },
              { id: 'acc-elevator', label: 'Upper floors accessible by elevator', count: 13 },
              { id: 'acc-wheelchair', label: 'Entire unit wheelchair accessible', count: 47 },
              { id: 'acc-walkin-shower', label: 'Walk-in shower', count: 104 },
            ]}
            selectedIds={selectedIds}
            onToggle={toggleAmenity}
          />

          {/* Fun Things To Do */}
          <FilterSection
            label="Fun things to do"
            icon={<Trophy size={14} className="text-gray-400" />}
            items={[
              { id: 'fun-beach', label: 'Beach', count: 169 },
              { id: 'fun-windsurfing', label: 'Windsurfing', count: 115 },
              { id: 'fun-snorkelling', label: 'Snorkelling', count: 125 },
              { id: 'fun-diving', label: 'Diving', count: 128 },
              { id: 'fun-fishing', label: 'Fishing', count: 107 },
            ]}
            selectedIds={selectedIds}
            onToggle={toggleAmenity}
          />

          {/* Landmarks */}
          <FilterSection
            label="Landmarks"
            icon={<MapIcon size={14} className="text-gray-400" />}
            items={[
              { id: 'land-hospital', label: 'Diani Beach Hospital', count: 25 },
              { id: 'land-colobus', label: 'Colobus Conservation', count: 20 },
              { id: 'land-supermarket', label: 'KFI Supermarket', count: 20 },
            ]}
            selectedIds={selectedIds}
            onToggle={toggleAmenity}
          />
        </div>
      </div>
    </div>
  );
}
