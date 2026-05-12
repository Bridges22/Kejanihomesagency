import React from 'react';
import { ShieldCheck, CreditCard, Zap, HeadphonesIcon } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const trustStats = [
  {
    id: 'trust-verified',
    icon: ShieldCheck,
    value: '12,400+',
    label: 'Verified Listings',
    description: 'Every listing manually reviewed',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    id: 'trust-payments',
    icon: CreditCard,
    value: '100%',
    label: 'Secure Payments',
    description: 'Stripe & M-Pesa protected',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    id: 'trust-access',
    icon: Zap,
    value: '<2 min',
    label: 'Instant Access',
    description: 'Contact details unlocked immediately',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    id: 'trust-support',
    icon: HeadphonesIcon,
    value: '24/7',
    label: 'Live Support',
    description: 'WhatsApp & email help always on',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-y border-gray-100 py-10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustStats?.map((stat) => {
            const Icon = stat?.icon;
            return (
              <div key={stat?.id} className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat?.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={22} className={stat?.color} />
                </div>
                <div>
                  <div className={`font-display text-xl font-bold tabular-nums ${stat?.color}`}>
                    {stat?.value}
                  </div>
                  <div className="font-semibold text-sm text-gray-800">{stat?.label}</div>
                  <div className="text-xs text-gray-400 leading-tight">{stat?.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}