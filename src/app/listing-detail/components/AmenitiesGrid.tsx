'use client';

import React, { useState } from 'react';
import { 
  Wifi, Waves, Dumbbell, Car, ShieldCheck, Zap, Droplets, Cctv, 
  ArrowUpToLine, Layout, Wind, Dog, Armchair, Utensils, WashingMachine, 
  PhoneCall, ChevronDown, ChevronUp, Package, Fan, Shirt, Trash2, 
  Fence, Users, Sun
} from 'lucide-react';

const amenityDefinitions: Record<string, { label: string, icon: React.ReactNode }> = {
  ac: { label: 'Air Conditioning', icon: <Wind size={18} className="text-sky-500" /> },
  ceiling_fan: { label: 'Ceiling Fan', icon: <Fan size={18} className="text-slate-400" /> },
  wardrobes: { label: 'Built-in Wardrobes', icon: <Layout size={18} className="text-teal-600" /> },
  walk_in_closet: { label: 'Walk-in Closet', icon: <ArrowUpToLine size={18} className="text-teal-600" /> },
  modern_kitchen: { label: 'Modern Kitchen', icon: <Utensils size={18} className="text-orange-500" /> },
  pantry: { label: 'Pantry', icon: <Package size={18} className="text-amber-600" /> },
  laundry: { label: 'Laundry Area', icon: <WashingMachine size={18} className="text-blue-500" /> },
  pool: { label: 'Swimming Pool', icon: <Waves size={18} className="text-blue-500" /> },
  garden: { label: 'Garden', icon: <Layout size={18} className="text-teal-600" /> },
  cctv: { label: 'CCTV', icon: <Cctv size={18} className="text-gray-600" /> },
  electric_fence: { label: 'Electric Fence', icon: <Zap size={18} className="text-amber-500" /> },
  perimeter_wall: { label: 'Perimeter Wall', icon: <Fence size={18} className="text-slate-500" /> },
  gated_community: { label: 'Gated Community', icon: <Users size={18} className="text-indigo-500" /> },
  borehole: { label: 'Borehole', icon: <Droplets size={18} className="text-blue-400" /> },
  generator: { label: 'Backup Generator', icon: <Zap size={18} className="text-amber-500" /> },
  lift: { label: 'Lift / Elevator', icon: <ArrowUpToLine size={18} className="text-gray-500" /> },
  security_24h: { label: '24/7 Security', icon: <ShieldCheck size={18} className="text-indigo-500" /> },
  water_included: { label: 'Water Included', icon: <Droplets size={18} className="text-blue-400" /> },
  electricity_included: { label: 'Electricity Included', icon: <Zap size={18} className="text-amber-500" /> },
  internet_ready: { label: 'Internet Ready', icon: <Wifi size={18} className="text-teal-600" /> },
  solar: { label: 'Solar System', icon: <Sun size={18} className="text-amber-500" /> }
};

const INITIAL_SHOW = 8;

export default function AmenitiesGrid({ amenities }: { amenities: any }) {
  const [showAll, setShowAll] = useState(false);

  if (!amenities) return null;

  // Handle both old array format and new object format
  let list: any[] = [];
  
  if (Array.isArray(amenities)) {
    list = amenities.map(a => ({
      label: a.amenity?.label,
      icon: a.amenity?.icon ? amenityDefinitions[a.amenity.icon.toLowerCase()]?.icon : <Package size={18} className="text-gray-400" />
    }));
  } else {
    // New object format (amenities_config)
    list = Object.entries(amenities)
      .filter(([_, value]) => value === true)
      .map(([key]) => ({
        label: amenityDefinitions[key]?.label || key,
        icon: amenityDefinitions[key]?.icon || <Package size={18} className="text-gray-400" />
      }));
  }

  if (list.length === 0) return null;

  const displayed = showAll ? list : list.slice(0, INITIAL_SHOW);

  return (
    <div className="border-t border-gray-100 pt-8">
      <h2 className="font-display text-xl font-bold text-gray-900 mb-5">
        What this place offers
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayed.map((item, i) => (
          <div
            key={`amenity-${i}`}
            className="flex items-center gap-2.5 px-3.5 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50/50 transition-all duration-150"
          >
            <span className="flex items-center justify-center w-6 h-6">
              {item.icon}
            </span>
            <span className="text-sm text-gray-700 font-medium leading-tight">{item.label}</span>
          </div>
        ))}
      </div>
      {list.length > INITIAL_SHOW && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
        >
          {showAll ? (
            <>Show fewer amenities <ChevronUp size={16} /></>
          ) : (
            <>Show all {list.length} amenities <ChevronDown size={16} /></>
          )}
        </button>
      )}
    </div>
  );
}