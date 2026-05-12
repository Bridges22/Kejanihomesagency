'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { FilterState } from './SearchResultsContent';

interface ActiveFilterPillsProps {
  filters: FilterState;
  removeFilter: (key: keyof FilterState) => void;
  clearAll: () => void;
}

export default function ActiveFilterPills({ filters, removeFilter, clearAll }: ActiveFilterPillsProps) {
  const pills: { label: string; key: keyof FilterState }[] = [];

  if (filters.type !== 'all') {
    pills.push({ label: filters.type === 'rental' ? 'Long-term Rental' : 'Short Stay / Airbnb', key: 'type' });
  }
  if (filters.priceMin > 0 || filters.priceMax < 500000) {
    pills.push({
      label: `KES ${filters.priceMin.toLocaleString()} – ${filters.priceMax.toLocaleString()}`,
      key: 'priceMin',
    });
  }
  if (filters.bedrooms.length > 0) {
    pills.push({
      label: filters.bedrooms.map(b => `${b}BR`).join(', '),
      key: 'bedrooms',
    });
  }
  if (filters.verifiedOnly) {
    pills.push({ label: 'Verified Only', key: 'verifiedOnly' });
  }

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((pill) => (
        <span
          key={`pill-${pill.key}`}
          className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-100 text-sm font-medium px-3 py-1.5 rounded-full"
        >
          {pill.label}
          <button
            onClick={() => removeFilter(pill.key)}
            className="hover:text-teal-900 transition-colors"
            aria-label={`Remove ${pill.label} filter`}
          >
            <X size={13} />
          </button>
        </span>
      ))}
      <button
        onClick={clearAll}
        className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors ml-1"
      >
        Clear all
      </button>
    </div>
  );
}