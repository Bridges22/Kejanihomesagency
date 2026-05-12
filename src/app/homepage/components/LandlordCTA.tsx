import React from 'react';
import Link from 'next/link';
import { CheckCircle2, TrendingUp, Users, Star, Flame } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const stats = [
  { id: 'stat-inquiries', label: 'Avg. monthly inquiries', value: '18—32', icon: Users },
  { id: 'stat-earnings', label: 'Avg. host earnings/mo', value: 'KES 42K', icon: TrendingUp },
  { id: 'stat-rating', label: 'Platform trust rating', value: '4.8 / 5', icon: Star },
];

const benefits = [
  'Free listing creation — no upfront cost',
  'Verified badge increases inquiry rate by 3x',
  'Reach serious, paying tenants only',
  'Instant SMS alert for every new inquiry',
  'Boost with promoted listings for faster results',
];

export default function LandlordCTA() {
  return (
    <section id="list-property" className="py-16 lg:py-24 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Copy */}
            <div className="p-10 lg:p-14">
              <p className="text-teal-200 font-semibold text-sm uppercase tracking-widest mb-4">For Landlords & Hosts</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-5 text-balance">
                List your property. Reach serious tenants.
              </h2>
              <p className="text-teal-100 text-lg leading-relaxed mb-8">
                Kejani Homes Agency ensures that only serious seekers contact you directly — reducing time-wasters and ghost viewings.
              </p>

              <ul className="space-y-3 mb-10">
                {benefits?.map((b) => (
                  <li key={`benefit-${b}`} className="flex items-center gap-3 text-teal-50 text-sm">
                    <CheckCircle2 size={18} className="text-teal-300 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/host/dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-bold px-7 py-3.5 rounded-2xl hover:bg-teal-50 active:scale-[0.98] transition-all duration-150 shadow-lg"
                >
                  Start Listing — Free
                </Link>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="bg-teal-800/50 p-10 lg:p-14 flex flex-col justify-center">
              <div className="space-y-6 mb-10">
                {stats?.map((stat) => {
                  const Icon = stat?.icon;
                  return (
                    <div key={stat?.id} className="flex items-center gap-5 bg-white/10 rounded-2xl p-5">
                      <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon size={22} className="text-teal-200" />
                      </div>
                      <div>
                        <div className="font-display text-2xl font-bold text-white tabular-nums">{stat?.value}</div>
                        <div className="text-teal-200 text-sm">{stat?.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-amber-400/20 border border-amber-400/30 rounded-2xl p-5">
                <p className="text-amber-200 text-sm font-medium leading-relaxed">
                  <span className="font-bold text-amber-300 inline-flex items-center gap-1"><Flame size={16} /> Limited-time offer:</span> Get your first listing promoted free for 7 days when you verify your property within 48 hours of signing up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
