'use client';

import React from 'react';
import { ShieldCheck, UserCheck, Lock, AlertTriangle, CheckCircle, Info, Heart, Search, Globe, FileText } from 'lucide-react';
import Link from 'next/link';

export default function TrustAndSafetyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-slate-950 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-teal-500 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 shadow-xl shadow-teal-500/20">
            <ShieldCheck size={14} />
            Verified Marketplace
          </div>
          <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tight mb-6">
            Trust & <span className="text-teal-400">Safety</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
            At Kejani Homes, trust is not just a word — it is how we built the platform. We ensure every listing is genuine and every user is protected.
          </p>
        </div>
      </section>

      {/* Pillars of Trust */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          <div className="space-y-8">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-[20px] flex items-center justify-center shadow-lg shadow-teal-500/10">
              <Search size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-4">Every Listing Is Reviewed</h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                Before any listing goes live on Kejani Homes, our admin team checks it. We look at the photos, the description, the pricing, and the contact details. If anything looks wrong or suspicious, the listing is rejected.
              </p>
              <div className="mt-4 p-4 bg-teal-50 border border-teal-100 rounded-2xl">
                <p className="text-xs text-teal-800 font-bold">This means that what you see on our platform has been checked by a real person before you ever see it.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[20px] flex items-center justify-center shadow-lg shadow-blue-500/10">
              <UserCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-4">Verified Badge for Agents</h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                Landlords and agents who complete our identity verification process receive a Verified Badge on their profile. This badge tells property seekers that we have confirmed who this person is.
              </p>
              <p className="text-sm text-slate-400 mt-4 italic font-medium">
                To get verified, agents need to submit a valid national ID or business registration document.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-[20px] flex items-center justify-center shadow-lg shadow-rose-500/10">
              <Heart size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-4">No Fees for Seekers</h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                Kejani Homes will never ask you to pay money to browse listings or view agent contact details. If anyone claims to be from Kejani Homes and asks you for payment before a viewing, please do not pay — and report it to us immediately.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-slate-900/10">
              <Lock size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-4">Data Security</h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                We use enterprise-grade cloud security to store all data on the platform. Every action taken on the platform is permanently logged through our Total Visibility system. Nothing is hidden.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Reporting Banner */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-slate-100 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 uppercase tracking-widest">Our Reporting System</h2>
              <p className="text-slate-500 font-medium">If you see a listing that looks fake or suspicious, you can report it directly. Our admin team will review all reports within 24 hours.</p>
            </div>
            <Link 
              href="/report"
              className="bg-rose-600 hover:bg-rose-700 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-rose-600/20 uppercase tracking-widest text-sm flex items-center gap-3"
            >
              <AlertTriangle size={20} />
              Report a Concern
            </Link>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-10 border-b-4 border-teal-500 inline-block pb-2">Tips for Seekers</h3>
            <div className="space-y-6">
              {[
                'Never pay any deposit BEFORE physically visiting.',
                'Always meet the agent at the property itself.',
                'Be cautious of prices that seem too good to be true.',
                'Ask to see the title deed or tenancy agreement.',
                'Trust your instincts — if it feels wrong, it is.'
              ].map((tip, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle className="text-teal-500 mt-1 flex-shrink-0" size={20} />
                  <p className="text-slate-600 font-bold">{tip}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-10 border-b-4 border-blue-500 inline-block pb-2">Tips for Agents</h3>
            <div className="space-y-6">
              {[
                'Only list properties you have formal authorization for.',
                'Ensure photos and descriptions are 100% accurate.',
                'Get Verified to build trust and increase enquiries.',
                'Respond to enquiries promptly to secure leads.',
                'Report any seeker who behaves suspiciously.'
              ].map((tip, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                  <p className="text-slate-600 font-bold">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Contact */}
      <section className="bg-slate-950 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-white tracking-tight mb-8">Contact Our Safety Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
              <p className="text-teal-400 font-black text-[10px] uppercase tracking-widest mb-2">Email Safety HQ</p>
              <p className="text-white font-bold">support@kejani-homes.co.ke</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
              <p className="text-teal-400 font-black text-[10px] uppercase tracking-widest mb-2">Emergency Phone</p>
              <p className="text-white font-bold">+254 700 123 456</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">We take every safety concern seriously and will respond as quickly as possible.</p>
        </div>
      </section>
    </div>
  );
}
