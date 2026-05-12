'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, X } from 'lucide-react';
import { listingsService } from '@/services/listings';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

// City Center Coordinates
const CITY_CENTERS: Record<string, [number, number]> = {
  mombasa: [-4.0435, 39.6682],
  diani: [-4.2797, 39.5947],
  nyali: [-4.0435, 39.7111],
  nairobi: [-1.2921, 36.8219],
  'taita-taveta': [-3.4000, 38.4000],
  busia: [0.4608, 34.1115],
  malindi: [-3.2235, 40.1169],
  kisumu: [-0.0917, 34.7680],
  kilifi: [-3.6307, 39.8499],
  watamu: [-3.3500, 40.0167],
  all: [-4.0435, 39.6682] // Default to Mombasa
};

const customIcon = (price: string, type: string, isActive: boolean) => {
  const colors: Record<string, { bg: string, border: string }> = {
    rental: { bg: '#0d9488', border: '#99f6e4' }, // Teal/Green
    airbnb: { bg: '#e11d48', border: '#fda4af' }, // Rose/Red
    sale: { bg: '#2563eb', border: '#93c5fd' }    // Blue
  };

  const typeColor = colors[type as keyof typeof colors] || colors.rental;
  const bgColor = isActive ? typeColor.bg : '#fff';
  const textColor = isActive ? '#fff' : typeColor.bg;
  const borderColor = typeColor.border;

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${bgColor};
        color: ${textColor};
        padding: 6px 10px;
        border-radius: 12px;
        font-weight: 800;
        font-size: 11px;
        border: 2px solid ${borderColor};
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transform: translate(-50%, -100%);
        white-space: nowrap;
        transition: all 0.2s;
      ">
        ${price}
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

function MapEvents({ onMoveEnd }: { onMoveEnd: (bounds: any) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onMoveEnd({
        ne: { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
        sw: { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng }
      });
    },
  });
  return null;
}

// Internal component to handle map centering
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapPanelContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city')?.toLowerCase() || 'all';
  
  const [listings, setListings] = useState<any[]>([]);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchListingsInView = useCallback(async (bounds: any) => {
    setLoading(true);
    try {
      const data = await listingsService.getListingsInBounds(bounds);
      setListings(data || []);
    } catch (err) {
      console.error('Map sync error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch for the default view
  useEffect(() => {
    const center = CITY_CENTERS[city] || CITY_CENTERS.all;
    fetchListingsInView({
      ne: { lat: center[0] + 0.1, lng: center[1] + 0.1 },
      sw: { lat: center[0] - 0.1, lng: center[1] - 0.1 }
    });
  }, [city, fetchListingsInView]);

  const activePinData = listings.find(p => p.id === activePin);
  const currentCenter = CITY_CENTERS[city] || CITY_CENTERS.all;

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-900/5 overflow-hidden" style={{ height: '600px' }}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
            <MapPin size={18} />
          </div>
          <div>
            <span className="text-sm font-black text-slate-900 block tracking-tight">
              {city === 'all' ? 'Coastal' : city.charAt(0).toUpperCase() + city.slice(1)} Map
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {listings.length} properties
            </span>
          </div>
        </div>
        {loading && <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />}
      </div>

      <div className="relative w-full h-[calc(100%-65px)] z-0">
        <MapContainer 
          center={currentCenter} 
          zoom={12} 
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <ChangeView center={currentCenter} />
          <MapEvents onMoveEnd={fetchListingsInView} />

          {listings.map((listing) => {
            let priceText = '';
            if (listing.type === 'sale') {
              priceText = `${listing.currency} ${(listing.total_price || 0).toLocaleString()}`;
            } else if (listing.type === 'rental') {
              priceText = `${listing.currency} ${(listing.price_per_month || 0).toLocaleString()}/mo`;
            } else {
              priceText = `${listing.currency} ${(listing.price_per_night || 0).toLocaleString()}/night`;
            }

            return (
              <Marker 
                key={listing.id}
                position={[Number(listing.latitude), Number(listing.longitude)]}
                icon={customIcon(priceText, listing.type, activePin === listing.id)}
                eventHandlers={{
                  click: () => setActivePin(listing.id === activePin ? null : listing.id),
                }}
              />
            );
          })}
        </MapContainer>

        {/* Legend & Detail Popup */}
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#0d9488] shadow-sm" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Long-term</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-600 shadow-sm" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest text-[9px]">Short Stay</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest text-[9px]">For Sale</span>
          </div>
        </div>

        <AnimatePresence>
          {activePinData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-6 right-6 lg:left-8 lg:right-auto lg:w-80 z-[1000] bg-white rounded-[32px] shadow-2xl border border-slate-100 p-4"
            >
              <button 
                onClick={() => setActivePin(null)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
              >
                <X size={14} />
              </button>

              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-50">
                <img 
                  src={activePinData.photos?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"} 
                  alt={activePinData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black text-slate-900 shadow-sm">
                  {activePinData.type === 'sale' ? 'FOR SALE' : activePinData.type === 'airbnb' ? 'SHORT STAY' : 'RENTAL'}
                </div>
              </div>

              <div className="flex justify-between items-start mb-1">
                <h3 className="font-black text-slate-900 leading-tight line-clamp-1 flex-1">{activePinData.title}</h3>
                <span className="text-sm font-black text-teal-600 ml-2 whitespace-nowrap">
                  {activePinData.currency} {
                    (activePinData.type === 'sale' ? activePinData.total_price : 
                     activePinData.type === 'airbnb' ? activePinData.price_per_night : 
                     activePinData.price_per_month || 0).toLocaleString()
                  }
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{activePinData.area}</p>
              
              <Link
                href={`/listing-detail/${activePinData.slug}`}
                className="flex items-center justify-center w-full bg-slate-900 hover:bg-teal-600 text-white text-xs font-black py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                View Full Details
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
