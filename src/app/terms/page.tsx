'use client';

import React from 'react';
import { ScrollText, ShieldCheck, Scale, Globe, Info } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-slate-50 py-20 lg:py-32 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[30%] h-full bg-slate-100 -skew-x-12 translate-x-20" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] mb-6">
            <Scale size={16} />
            Legal Documentation
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Terms of <span className="text-teal-600">Service</span>
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400">
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
              <Globe size={14} /> /terms
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
              <ScrollText size={14} /> Last updated: 2026
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 border-l-4 border-teal-500 pl-8 bg-slate-50 py-8 rounded-r-3xl">
            Welcome to Kejani Homes. By using our website, you agree to follow these terms. Please read them carefully. If you do not agree, please do not use the platform.
          </p>

          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs">01</span>
                Who We Are
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Kejani Homes Agency Technologies Ltd is a Kenyan real estate technology company incorporated in 2026. We operate a web-based platform that allows property owners to list their properties and property seekers to find them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs">02</span>
                Who Can Use This Platform
              </h2>
              <p className="text-slate-600 leading-relaxed">
                You can use Kejani Homes if you are 18 years of age or older. By using this platform, you confirm that the information you provide is honest and accurate.
              </p>
            </section>

            <section className="bg-slate-50 p-8 lg:p-12 rounded-[40px] border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center text-xs">03</span>
                Listing Properties
              </h2>
              <ul className="space-y-4 text-slate-600 list-none p-0">
                <li className="flex gap-4">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                  Listing a property on Kejani Homes is completely free. We do not charge any upfront or monthly fees.
                </li>
                <li className="flex gap-4">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                  You must own the property you are listing, or have the legal authority to list it on behalf of the owner.
                </li>
                <li className="flex gap-4">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                  All information in your listing — including the photos, price, and description — must be accurate and truthful.
                </li>
                <li className="flex gap-4">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                  Our team will review every listing before it goes live. We reserve the right to reject or remove any listing that is fake, misleading, or does not meet our standards.
                </li>
                <li className="flex gap-4">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                  You can edit or delete your listing at any time from your Host Dashboard.
                </li>
              </ul>
            </section>

            <section className="bg-slate-900 text-white p-8 lg:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Scale size={120} />
              </div>
              <h2 className="text-2xl font-black text-teal-400 uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10">
                <span className="w-8 h-8 bg-teal-400 text-slate-900 rounded-lg flex items-center justify-center text-xs font-black">04</span>
                Our Commission on Sales
              </h2>
              <p className="text-slate-300 leading-relaxed relative z-10 mb-8">
                Kejani Homes earns a 12% commission on the total price of any property that is sold through our platform. This commission is only charged when a sale is successfully completed. There is no commission on rentals or short stays.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative z-10">
                <p className="text-teal-400 font-black text-sm uppercase tracking-widest mb-2">Example Calculation</p>
                <p className="text-slate-100 font-medium">If a property sells for KES 5,000,000, Kejani Homes earns <span className="text-white font-black">KES 600,000</span> as commission.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs">05</span>
                What Property Seekers Should Know
              </h2>
              <ul className="space-y-4 text-slate-600 list-none p-0">
                <li className="flex gap-4">
                  <div className="w-2 h-2 bg-slate-300 rounded-full mt-2 flex-shrink-0" />
                  Browsing listings on Kejani Homes is free. You do not need to register or pay to see agent contact details.
                </li>
                <li className="flex gap-4">
                  <div className="w-2 h-2 bg-slate-300 rounded-full mt-2 flex-shrink-0" />
                  Any deposit or payment you make goes directly to the landlord or agent — not to Kejani Homes.
                </li>
                <li className="flex gap-4">
                  <div className="w-2 h-2 bg-slate-300 rounded-full mt-2 flex-shrink-0" />
                  If an agent requests a viewing fee, that is a separate arrangement between you and the agent. Kejani Homes is not responsible for it.
                </li>
                <li className="flex gap-4">
                  <div className="w-2 h-2 bg-slate-300 rounded-full mt-2 flex-shrink-0" />
                  We encourage you to verify any property before paying any money.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3 text-rose-600">
                <span className="w-8 h-8 bg-rose-600 text-white rounded-lg flex items-center justify-center text-xs">06</span>
                Things You Must Not Do
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Post fake, copied, or misleading listings.',
                  'Use the platform to scam or deceive others.',
                  'Spam other users with non-property enquiries.',
                  'Damage, hack, or interfere with the platform.',
                  'Impersonate another person or organisation.'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-rose-50 rounded-2xl text-rose-700 text-sm font-bold border border-rose-100">
                    <ShieldCheck size={16} />
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs">07</span>
                Accounts and Passwords
              </h2>
              <p className="text-slate-600 leading-relaxed">
                You are responsible for keeping your account login details safe. If you think someone else has accessed your account, contact us immediately at <span className="font-bold text-slate-900">support@kejani-homes.co.ke</span>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs">08</span>
                Our Responsibility
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Kejani Homes is a marketplace — we connect seekers with landlords and agents. We do not own any of the listed properties and we are not a party to any rental or sale agreement between users.
              </p>
              <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-start">
                <Info size={20} className="text-slate-400 mt-1" />
                <p className="text-sm text-slate-500 font-medium italic">We do our best to ensure listings are genuine, but we cannot guarantee every piece of information provided by third parties. Always do your own checks before entering into any property agreement.</p>
              </div>
            </section>

            <section className="pt-12 border-t border-slate-100">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-4">Contact Legal Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm font-bold text-slate-900">support@kejani-homes.co.ke</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-sm font-bold text-slate-900">+254 700 123 456</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</p>
                  <p className="text-sm font-bold text-slate-900">Westlands Business Park, Nairobi</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
