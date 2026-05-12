'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

// Dynamically import the map components with SSR disabled
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// We need to import Leaflet dynamically too, or access it only inside useEffect/client-side
interface MapSectionProps {
  listing: {
    area: string;
    city: string;
    type: 'rental' | 'airbnb' | 'sale';
    latitude: number;
    longitude: number;
  };
}

export default function MapSection({ listing }: MapSectionProps) {
  const [icon, setIcon] = React.useState<any>(null);

  React.useEffect(() => {
    // Only import and initialize Leaflet on the client
    import('leaflet').then((L) => {
      const leafletIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setIcon(leafletIcon);
    });
  }, []);

  const position: [number, number] = [
    Number(listing.latitude) || -4.0435, 
    Number(listing.longitude) || 39.6682
  ];

  return (
    <div className="h-full min-h-[300px]">
      <div className="relative h-full rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-teal-900/5" style={{ zIndex: 0 }}>
        {typeof window !== 'undefined' && (
          <MapContainer 
            center={position} 
            zoom={14} 
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {icon && (
              <Marker position={position} icon={icon}>
                <Popup>
                  <div className="p-1">
                    <p className="font-bold text-teal-800">{listing.area}</p>
                    <p className="text-xs text-gray-500">{listing.city}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}

        {/* Pin Label Overlay */}
        <div className="absolute top-4 left-4 z-[1000]">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 border border-gray-100 shadow-lg">
            <MapPin size={14} className="text-teal-600" />
            <span className="text-xs font-bold text-gray-700">
              {listing.area}, {listing.city}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}