import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { MapPin, Mail, Phone, ArrowRight } from 'lucide-react';



const SocialFacebook = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const SocialTwitter = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const SocialInstagram = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const SocialYoutube = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const footerCities = [
  { label: 'Diani', href: '/search-results?city=diani' },
  { label: 'Mombasa', href: '/search-results?city=mombasa' },
  { label: 'Nyali', href: '/search-results?city=nyali' },
];

const platformLinks = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Search Rentals', href: '/search-results?type=rental' },
  { label: 'Airbnb Stays', href: '/search-results?type=airbnb' },
  { label: 'List Your Property', href: '/host/dashboard' },
  { label: 'Host Earnings', href: '/host/earnings' },
];

const supportLinks = [
  { label: 'Help Centre', href: '/help' },
  { label: 'Contact Support', href: '/contact' },
  { label: 'Report a Listing', href: '/report' },
  { label: 'Refund Policy', href: '/refunds' },
  { label: 'Trust & Safety', href: '/trust' },
  { label: 'Blog & Guides', href: '/blog' },
];

const legalLinks = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Admin Portal', href: '/admin/login' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Newsletter Banner */}
      <div className="border-b border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-bold text-white mb-1">
                Get new listings in your inbox
              </h3>
              <p className="text-gray-400 text-sm">
                Be first to know when a verified listing matches your search — before it&apos;s gone.
              </p>
            </div>
            <div className="flex gap-2 w-full lg:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 lg:w-72 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
              <button className="flex items-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all duration-150 text-sm whitespace-nowrap">
                Subscribe
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Footer Grid */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="xl:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <AppLogo size={36} />
            <span className="font-display text-xl font-bold text-white">Kejani Homes Agency</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
            Africa&apos;s most trusted property marketplace. Find verified rentals and short stays across 45+ cities — or list your property to reach serious, paying tenants.
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm text-gray-400">
              <MapPin size={15} className="text-teal-500 flex-shrink-0" />
              Westlands Business Park, Nairobi, Kenya
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-400">
              <Mail size={15} className="text-teal-500 flex-shrink-0" />
              bridges.cybersec@gmail.com
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-400">
              <Phone size={15} className="text-teal-500 flex-shrink-0" />
              +254 104 613770
            </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[SocialFacebook, SocialTwitter, SocialInstagram, SocialYoutube]?.map((SocialIcon, i) => (
                <button
                  key={`social-${i}`}
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-teal-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-150"
                  aria-label={`Social link ${i}`}
                >
                  <SocialIcon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              {platformLinks?.map((link) => (
                <li key={`footer-platform-${link?.label}`}>
                  <Link
                    href={link?.href}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-150"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks?.map((link) => (
                <li key={`footer-support-${link?.label}`}>
                  <Link
                    href={link?.href}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-150"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Top Cities
            </h4>
            <ul className="space-y-3">
              {footerCities?.map((city) => (
                <li key={`footer-city-${city?.label}`}>
                  <Link
                    href={city?.href}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-150"
                  >
                    {city?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © 2026 Kejani Homes Agency Agency Technologies Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {legalLinks?.map((link) => (
              <Link
                key={`footer-legal-${link?.label}`}
                href={link?.href}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {link?.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
