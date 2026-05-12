import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  listing: {
    city: string;
    area: string;
    title: string;
    type: 'rental' | 'airbnb';
  };
}

export default function ListingBreadcrumb({ listing }: BreadcrumbProps) {
  const items = [
    { label: 'Home', href: '/', icon: true },
    { label: listing.city, href: `/search-results?city=${listing.city.toLowerCase()}` },
    { label: listing.area, href: `/search-results?city=${listing.city.toLowerCase()}&area=${listing.area.toLowerCase()}` },
    { label: listing.title, href: '#', current: true },
  ];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, i) => (
          <li key={`breadcrumb-${i}`} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={13} className="text-gray-300" />}
            {item.current ? (
              <span className="text-sm text-gray-500 truncate max-w-[200px]" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 transition-colors"
              >
                {item.icon && <Home size={13} />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}