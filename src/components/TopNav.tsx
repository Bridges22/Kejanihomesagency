'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X, ChevronDown, Heart, User, LogIn, Home, Search, BookOpen, PlusCircle, MapPin } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const navLinks = [
  { label: 'Find a Home', href: '/search-results', icon: Search },
  { label: 'Land & Plots', href: '/search-results?type=sale&category=Land', icon: MapPin },
  { label: 'How It Works', href: '/#how-it-works', icon: BookOpen },
];

export default function TopNav({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = transparent && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent' :'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <AppLogo size={36} />
              <div className="flex flex-col leading-none">
                <span
                  className={`font-display text-lg font-black tracking-tighter hidden sm:block transition-colors duration-300 ${
                    isTransparent ? 'text-white' : 'text-gray-900 group-hover:text-teal-600'
                  }`}
                >
                  KEJANI HOMES
                </span>
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase hidden sm:block transition-colors duration-300 ${
                  isTransparent ? 'text-white/60' : 'text-teal-600'
                }`}>
                  Agency
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={`nav-${link.label}`}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isTransparent
                      ? 'text-white/90 hover:text-white hover:bg-white/10' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/#list-property"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isTransparent
                    ? 'text-white/90 hover:text-white hover:bg-white/10' :'text-teal-600 hover:text-teal-700 hover:bg-teal-50'
                }`}
              >
                <PlusCircle size={16} />
                List Your Property
              </Link>

              <button
                className={`p-2 rounded-xl transition-all duration-150 relative ${
                  isTransparent
                    ? 'text-white/80 hover:bg-white/10' :'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="Saved listings"
              >
                <Heart size={20} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl border transition-all duration-150 ${
                    isTransparent
                      ? 'border-white/30 text-white hover:bg-white/10' :'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                    <User size={14} className="text-teal-700" />
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-dropdown animate-fade-in overflow-hidden">
                    <div className="p-1">
                      <Link href="/host" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User size={15} className="text-gray-400" />
                        My Dashboard
                      </Link>
                      <Link href="/dashboard/saved" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Heart size={15} className="text-gray-400" />
                        Saved Listings
                      </Link>
                      <Link href="/dashboard/bookings" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <BookOpen size={15} className="text-gray-400" />
                        My Bookings
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <Link href="/host/login" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-teal-600 font-medium hover:bg-teal-50 transition-colors">
                        <LogIn size={15} />
                        Sign In
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-150 ${
                isTransparent
                  ? 'text-white hover:bg-white/10' :'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AppLogo size={32} />
              <div className="flex flex-col leading-none">
                <span className="font-display text-base font-black tracking-tighter text-gray-900 uppercase">Kejani Homes</span>
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-teal-600">Agency</span>
              </div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={`mobile-nav-${link.label}`}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-all duration-150 font-medium"
                >
                  <Icon size={18} className="text-gray-400" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 space-y-2">
            <Link
              href="/host/login"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full justify-center"
            >
              <LogIn size={16} />
              Sign In
            </Link>
            <Link
              href="/#list-property"
              onClick={() => setMobileOpen(false)}
              className="btn-secondary w-full justify-center"
            >
              <PlusCircle size={16} />
              List Your Property
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer for non-transparent navs */}
      {!transparent && <div className="h-16 lg:h-18" />}
    </>
  );
}
