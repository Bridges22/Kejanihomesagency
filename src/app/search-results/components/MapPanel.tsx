'use client';

import React from 'react';
import dynamic from 'next/dynamic';

/**
 * Leaflet does not support Server-Side Rendering (SSR) because it requires 'window'.
 * We use next/dynamic to load the MapPanel only on the client-side.
 */
const MapPanelContent = dynamic(
  () => import('./MapPanelContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-center" style={{ height: '600px' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Interactive Map...</p>
        </div>
      </div>
    )
  }
);

export default function MapPanel() {
  return <MapPanelContent />;
}
