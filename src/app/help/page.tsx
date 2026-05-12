'use client';

import React from 'react';
import { Search, HelpCircle, User, Home, Shield, Phone, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    category: 'For Guests',
    icon: User,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    questions: [
      { q: 'How do I book a stay?', a: 'Browse our listings, select your dates, and click the "Contact Host" or "Book Now" button. Follow the prompts to complete your reservation.' },
      { q: 'Are the listings verified?', a: 'Yes, our team manually verifies property details and host credentials to ensure a safe experience.' },
      { q: 'What is the refund policy?', a: 'Refund policies vary by host. Please check the specific listing details before booking.' }
    ]
  },
  {
    category: 'For Hosts & Agents',
    icon: Home,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    questions: [
      { q: 'How do I list my property?', a: 'Create an account, go to your Host Dashboard, and click "Add Listing". Fill in the details, upload photos, and submit for approval.' },
      { q: 'When will my listing go live?', a: 'All new listings are reviewed by our Super Admin. This typically takes 12-24 hours.' },
      { q: 'Are there any listing fees?', a: 'Basic listing is free. We may offer premium placement options in the future.' }
    ]
  },
  {
    category: 'Trust & Safety',
    icon: Shield,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    questions: [
      { q: 'How do I report a suspicious listing?', a: 'Use the "Report a Listing" link at the bottom of any property page or visit our dedicated report page.' },
      { q: 'Is my data secure?', a: 'We use industry-standard encryption to protect your personal and payment information.' }
    ]
  }
];

export default function HelpCentrePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-950 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-6">
            How can we <span className="text-teal-400">help you</span> today?
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, or troubleshooting..."
              className="w-full bg-white/10 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all text-lg font-medium backdrop-blur-md"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {FAQS.map((section) => (
            <div key={section.category} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className={`${section.bg} ${section.color} p-4 rounded-2xl`}>
                  <section.icon size={28} />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">{section.category}</h2>
              </div>
              <div className="space-y-6">
                {section.questions.map((faq, i) => (
                  <div key={i} className="group">
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors flex items-center gap-2">
                      <HelpCircle size={16} className="text-slate-300" />
                      {faq.q}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed pl-6 border-l-2 border-slate-100 group-hover:border-teal-200 transition-colors">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-24 bg-slate-50 rounded-[40px] p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Still need assistance?</h2>
            <p className="text-slate-500 text-lg font-medium">Our support team is available 24/7 to help you with any questions about bookings, listings, or safety.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link 
              href="/contact"
              className="flex items-center justify-center gap-3 bg-slate-900 text-white font-black px-8 py-5 rounded-2xl hover:bg-teal-600 transition-all shadow-xl shadow-slate-900/10"
            >
              Contact Support
              <ArrowRight size={20} />
            </Link>
            <a 
              href="tel:+254104613770"
              className="flex items-center justify-center gap-3 bg-white text-slate-900 border border-slate-200 font-black px-8 py-5 rounded-2xl hover:bg-slate-50 transition-all"
            >
              <Phone size={20} className="text-teal-600" />
              Call Official Support
            </a>
          </div>
        </div>
      </section>

      {/* Quick Links Footer */}
      <section className="bg-slate-50 py-12 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
          <Link href="/report" className="hover:text-slate-900 transition-colors">Report a Listing</Link>
          <Link href="/trust" className="hover:text-slate-900 transition-colors">Trust & Safety</Link>
        </div>
      </section>
    </div>
  );
}
