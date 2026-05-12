import React from 'react';
import { Search, Unlock, Phone } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const steps = [
  {
    id: 'step-browse',
    number: '01',
    icon: Search,
    title: 'Browse Verified Listings',
    description: 'Search thousands of verified rentals and short stays by city, price, and bedroom count. Every listing is reviewed before going live, no fake properties.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
  },
  {
    id: 'step-view',
    number: '02',
    icon: Unlock,
    title: 'View Contact Details',
    description: 'Get immediate access to the landlord\'s phone number, exact address, and viewing instructions, all for free. No registration or payment required to browse.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    id: 'step-contact',
    number: '03',
    icon: Phone,
    title: 'Contact & Move In',
    description: 'Call or message the landlord directly to arrange a viewing. Agree on terms, pay your deposit, and move into your new home on your own terms.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">How Kejani Homes Agency Works</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            From search to move-in in 3 steps
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            No middlemen. No wasted viewings. Direct access to verified landlords and hosts — on your terms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-14 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-teal-200 via-amber-200 to-blue-200" />

          {steps?.map((step) => {
            const Icon = step?.icon;
            return (
              <div key={step?.id} className="relative flex flex-col items-center text-center group">
                {/* Step number */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 ${step?.bg} ${step?.border} border-2 rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                    <Icon size={30} className={step?.color} />
                  </div>
                  <span className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 ${step?.border} flex items-center justify-center text-xs font-bold ${step?.color}`}>
                    {step?.number}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-3">{step?.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step?.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
