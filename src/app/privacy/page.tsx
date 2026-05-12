'use client';

import React from 'react';
import { Shield, Eye, Lock, Database, UserCheck, Cookie, Globe, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-teal-50/50 py-20 lg:py-32 border-b border-teal-100 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[40%] h-full bg-teal-100/30 skew-x-12 translate-x-32" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 text-teal-600 font-black uppercase tracking-[0.2em] text-[10px] mb-6">
            <Shield size={16} />
            Data Protection Policy
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Privacy <span className="text-teal-600">Policy</span>
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400">
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-teal-100 shadow-sm">
              <Globe size={14} /> /privacy
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-teal-100 shadow-sm">
              <FileText size={14} /> Last updated: 2026
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12">
            At Kejani Homes, we take your privacy seriously. This page explains what information we collect, why we collect it, and how we use it. <span className="text-slate-900 font-black">We will never sell your personal data to anyone.</span>
          </p>

          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs">01</span>
                What Information We Collect
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <UserCheck size={16} className="text-teal-600" />
                    Directly from you
                  </h3>
                  <ul className="text-sm text-slate-500 space-y-2 font-medium">
                    <li>• Name, email, and phone number upon registration.</li>
                    <li>• Property details, photos, and pricing for listings.</li>
                    <li>• Messages or enquiries sent via the platform.</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Eye size={16} className="text-teal-600" />
                    Automatically
                  </h3>
                  <ul className="text-sm text-slate-500 space-y-2 font-medium">
                    <li>• Browser type and device information.</li>
                    <li>• Page visit history and duration.</li>
                    <li>• General city-level location (via IP).</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs">02</span>
                Why We Collect This Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'Account management',
                  'Displaying listings',
                  'Enquiry alerts',
                  'Platform improvements',
                  'Service updates'
                ].map((reason, i) => (
                  <div key={i} className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 shadow-sm flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    {reason}
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-slate-950 text-white p-8 lg:p-12 rounded-[40px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <h2 className="text-2xl font-black text-teal-400 uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10">
                <span className="w-8 h-8 bg-teal-400 text-slate-950 rounded-lg flex items-center justify-center text-xs font-black">03</span>
                Sharing Your Information
              </h2>
              <p className="text-slate-300 leading-relaxed mb-8 relative z-10">
                We do not sell your personal information. We only share information in the following situations:
              </p>
              <div className="space-y-4 relative z-10">
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">With property seekers</h4>
                  <p className="text-xs text-slate-400 font-medium">Your name, phone number, and WhatsApp contact are shown on your listing so seekers can reach you directly.</p>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">With technology partners</h4>
                  <p className="text-xs text-slate-400 font-medium">Trusted companies that help us store data securely and run the platform. They are not allowed to use your data for any other purpose.</p>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">When required by law</h4>
                  <p className="text-xs text-slate-400 font-medium">If we are legally required to share information with authorities, we will do so.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs">04</span>
                How We Protect Your Data
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                We store all data using enterprise-grade cloud security. Only authorised staff can access personal information.
              </p>
              <div className="p-6 bg-teal-50 border border-teal-100 rounded-3xl flex gap-4 items-center">
                <Lock className="text-teal-600 flex-shrink-0" size={24} />
                <p className="text-sm text-teal-800 font-bold">Every action on the platform is logged through our Total Visibility system, which means there is full accountability for how data is handled.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs">05</span>
                How Long We Keep Your Data
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We keep your account information for as long as your account is active. If you close your account, we will delete your personal data within 30 days, unless we are required by law to keep it longer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs">06</span>
                Your Rights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Access your personal info',
                  'Correct inaccurate data',
                  'Request data deletion',
                  'Opt-out of marketing'
                ].map((right, i) => (
                  <div key={i} className="flex items-center gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-8 h-8 bg-white text-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                      <CheckCircle size={16} />
                    </div>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{right}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400 mt-6 font-medium">To make any of these requests, email us at <span className="text-slate-900 font-bold">support@kejani-homes.co.ke</span>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs">07</span>
                Cookies
              </h2>
              <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                <Cookie size={48} className="text-slate-300" />
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  We use cookies — small files stored on your device — to make the website work properly and to understand how people use it. You can turn cookies off in your browser settings, but some parts of the website may not work as well if you do.
                </p>
              </div>
            </section>

            <section className="pt-12 border-t border-slate-100">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-6">Contact Privacy Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-slate-900">support@kejani-homes.co.ke</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Line</p>
                  <p className="text-sm font-bold text-slate-900">+254 700 123 456</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Office HQ</p>
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

const CheckCircle = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
