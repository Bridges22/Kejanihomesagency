'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, ChevronDown, Sparkles } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

const POPULAR_CITIES = ['Diani', 'Mombasa', 'Nyali', 'Kombani'];

export default function HeroSection() {
  const router = useRouter();
  const [mode, setMode] = useState<'rental' | 'airbnb' | 'sale'>('rental');
  const [city, setCity] = useState('');
  const [cityFocused, setCityFocused] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Refs to open calendars
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city.toLowerCase());
    params.set('type', mode);
    if (mode === 'airbnb' && checkIn) params.set('checkin', checkIn);
    if (mode === 'airbnb' && checkOut) params.set('checkout', checkOut);
    router.push(`/search-results?${params.toString()}`);
  };

  const filteredCities = POPULAR_CITIES.filter((c) =>
    city === '' || c.toLowerCase().includes(city.toLowerCase())
  );

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="https://images.unsplash.com/photo-1599729120260-b694e0e16207"
          alt="Modern coastal residence"
          fill
          priority
          sizes="100vw"
          className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-900/60 to-teal-900/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Sparkles size={14} className="text-amber-400" />
            Verified listings across the Coast
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
            Find your perfect home — <span className="text-teal-300">verified</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 mb-10 leading-relaxed max-w-2xl mx-auto">
            Browse trusted rentals and short stays. No fake listings, no wasted trips.
          </p>

          {/* Search Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-2 sm:p-3">
            {/* Mode Toggle */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-3 flex-wrap sm:flex-nowrap">
              <button
                onClick={() => setMode('rental')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                  mode === 'rental' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                🏠 Long-term Rental
              </button>
              <button
                onClick={() => setMode('sale')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                  mode === 'sale' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                🏷️ For Sale / Land
              </button>
              <button
                onClick={() => setMode('airbnb')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                  mode === 'airbnb' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500'
                }`}
              >
                🌟 Short Stay
              </button>
            </div>

            {/* Search Fields - Flexbox for 'Perfect Fit' */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch">
              {/* City Input - Stretches to fill */}
              <div className="relative flex-[2] min-w-0">
                <div className="h-full flex items-center gap-2.5 px-4 py-3.5 border border-gray-200 rounded-2xl bg-white hover:border-teal-400 focus-within:border-teal-500 transition-all">
                  <MapPin size={18} className="text-teal-500 shrink-0" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onFocus={() => setCityFocused(true)}
                    onBlur={() => setTimeout(() => setCityFocused(false), 200)}
                    placeholder="City or neighbourhood"
                    className="flex-1 text-sm text-gray-900 bg-transparent focus:outline-none font-medium" />
                  {city && <button onClick={() => setCity('')} className="text-gray-300 hover:text-gray-500 text-xs">✕</button>}
                </div>
                {cityFocused && filteredCities.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden animate-fade-in">
                    {filteredCities.map((c) => (
                      <button
                        key={c}
                        onClick={() => {setCity(c); setCityFocused(false);}}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 text-left"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Selectors (Airbnb Only) - Stretches to fill */}
              {mode === 'airbnb' && (
                <div className="flex-[1.5] grid grid-cols-2 gap-2">
                  <div 
                    onClick={() => checkInRef.current?.showPicker()}
                    className="flex items-center gap-2 px-3 py-3.5 border border-gray-200 rounded-2xl bg-white hover:border-teal-400 transition-all cursor-pointer relative"
                  >
                    <Calendar size={16} className="text-teal-500 shrink-0" />
                    <input ref={checkInRef} type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full" />
                    <span className="text-[11px] font-bold text-gray-600 truncate">{checkIn || 'Check In'}</span>
                  </div>
                  <div 
                    onClick={() => checkOutRef.current?.showPicker()}
                    className="flex items-center gap-2 px-3 py-3.5 border border-gray-200 rounded-2xl bg-white hover:border-teal-400 transition-all cursor-pointer relative"
                  >
                    <Calendar size={16} className="text-teal-500 shrink-0" />
                    <input ref={checkOutRef} type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full" />
                    <span className="text-[11px] font-bold text-gray-600 truncate">{checkOut || 'Check Out'}</span>
                  </div>
                </div>
              )}

              {/* Search Button - Fixed width for perfect fit */}
              <button
                onClick={handleSearch}
                className="flex-none bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-10 rounded-2xl transition-all shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 whitespace-nowrap min-w-[180px]"
              >
                <Search size={18} />
                Search Listings
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-white/50 text-xs">Popular:</span>
            {['2BR Mombasa', 'Land Diani', '1BR Nyali']?.map((chip) => (
              <button key={chip} className="text-xs text-white/70 hover:text-white bg-white/10 px-3 py-1.5 rounded-full transition-all">{chip}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/40">
        <ChevronDown size={24} />
      </div>
    </section>
  );
}