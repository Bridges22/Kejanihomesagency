'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  Users,
  BarChart3,
  Settings,
  Search,
  PlusCircle,
  Bell,
  HelpCircle,
  Menu,
  ChevronRight,
  Zap,
  TrendingUp,
  UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLogo from '@/components/ui/AppLogo';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/host', icon: LayoutDashboard, section: 'Main', badge: null },
  { label: 'Properties', href: '/host/listings', icon: Home, section: 'Main' },
  { label: 'Leads & Inquiries', href: '/host/leads', icon: Users, section: 'Main' },
  { label: 'Analytics', href: '/host/analytics', icon: BarChart3, section: 'Insights', badge: null },
  { label: 'Settings', href: '/host/settings', icon: Settings, section: 'Account', badge: null },
];

export default function HostDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin' || user.email === 'bridgesmwashighadi2@gmail.com') {
          // Redirect admins away from host dashboard
          window.location.href = '/admin';
          return;
        }
        
        setUser(user);
      } else {
        window.location.href = '/host/login';
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 backdrop-blur-xl relative">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-slate-800/10 [background-size:100px_100px] animate-pulse-slow" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(45,212,191,0.08) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(99,102,241,0.08) 0%, transparent 50%)`
        }} />
      </div>

      {/* Premium Glassmorphism Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 280 : 72 }}
        className="relative flex-shrink-0 backdrop-blur-3xl bg-white/80 border-r border-white/50 shadow-2xl shadow-black/5 flex flex-col transition-all duration-700 ease-out"
      >
        {/* Animated Logo Header */}
        <motion.div
          layout
          className="p-6 border-b border-white/30 flex-shrink-0 relative overflow-hidden"
          style={{ paddingRight: isExpanded ? '1.5rem' : '0' }}
        >
          <motion.div
            layout
            className="flex items-center gap-4 group relative z-10"
            animate={{ opacity: isExpanded ? 1 : 0 }}
          >
            <motion.div
              className="p-3 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl shadow-2xl shadow-teal-500/40 hover:shadow-teal-500/60 transition-all duration-500 hover:scale-105 hover:rotate-3"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <AppLogo size={24} className="text-white drop-shadow-lg" />
            </motion.div>
            <div className="min-w-0">
              <motion.h1
                className="text-xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-teal-700 bg-clip-text text-transparent tracking-tight leading-tight"
                animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -20 }}
                transition={{ duration: 0.3 }}
              >
                Kejani Homes
              </motion.h1>
              <motion.p
                className="text-[11px] font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent uppercase tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: isExpanded ? 1 : 0 }}
                transition={{ delay: 0.1 }}
              >
                Host Portal
              </motion.p>
            </div>
          </motion.div>

          {/* Animated Background Shine */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-emerald-500/10 -skew-x-12 -rotate-1 scale-x-[3]"
            animate={{ x: isExpanded ? ['-100%', '100%'] : '0%' }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Collapse Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl hover:bg-white/100 transition-all duration-300 group"
            whileHover={{ scale: 1.1, rotate: isExpanded ? 180 : 0 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
          </motion.button>
        </motion.div>

        {/* Premium Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-2 custom-scrollbar">
          {['Main', 'Insights', 'Account'].map((section) => (
            <motion.div
              key={section}
              initial={false}
              className="space-y-3"
            >
              <motion.h3
                layout
                className="px-4 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-slate-400 to-slate-500 bg-clip-text text-transparent flex items-center gap-2"
                animate={{ opacity: isExpanded ? 1 : 0 }}
              >
                {section}
                <motion.div
                  className="w-1.5 h-1.5 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full shadow-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.h3>

              <AnimatePresence>
                {NAV_ITEMS.filter(item => item.section === section).map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div key={item.href}>
                      <Link
                        href={item.href}
                        className="group relative flex items-center gap-4 p-4 rounded-3xl backdrop-blur-sm bg-white/60 border border-white/50 hover:border-teal-200/50 transition-all duration-500 overflow-hidden"
                        style={{ paddingLeft: isExpanded ? '1rem' : '1rem' }}
                      >
                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-emerald-500/20 to-teal-600/30 backdrop-blur-sm rounded-3xl shadow-xl shadow-teal-500/20 border border-teal-200/50"
                          />
                        )}

                        {/* Icon Container */}
                        <motion.div
                          className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/50 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-teal-500/20 group-hover:scale-105"
                          style={{ background: isActive ? 'linear-gradient(135deg, rgba(45,212,191,0.2), rgba(16,185,129,0.2))' : 'rgba(255,255,255,0.7)' }}
                        >
                          <item.icon
                            size={20}
                            className={`transition-all duration-500 ${isActive ? 'text-teal-700 drop-shadow-lg' : 'text-slate-500 group-hover:text-teal-600'}`}
                          />
                          {item.badge && (
                            <motion.span
                              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50 animate-pulse"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              {item.badge}
                            </motion.span>
                          )}
                        </motion.div>

                        {/* Label */}
                        <motion.span
                          className="font-bold text-slate-900 tracking-tight relative z-10 flex-1 min-w-0"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.label}
                        </motion.span>

                        {/* Active Chevron */}
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="relative z-10"
                          >
                            <ChevronRight size={16} className="text-teal-500 drop-shadow-lg" />
                          </motion.div>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ))}
        </nav>

        {/* Premium User Profile Footer */}
        <motion.footer
          layout
          className="p-4 border-t border-white/30 bg-gradient-to-t from-white/50 to-transparent backdrop-blur-sm"
        >
          <Link
            href="/host/profile"
            className="group relative flex items-center gap-4 p-4 rounded-3xl backdrop-blur-sm bg-white/70 border border-white/50 hover:border-teal-200/50 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-500 overflow-hidden"
          >
            {/* Profile Avatar */}
            <motion.div
              className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-2xl shadow-black/10 group-hover:shadow-3xl group-hover:shadow-teal-500/30 transition-all duration-500 group-hover:scale-105"
              whileHover={{ rotate: 5 }}
            >
              <div className="w-full h-full bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-black text-lg drop-shadow-lg">
                  {user?.user_metadata?.full_name?.substring(0, 2).toUpperCase() || 'HK'}
                </span>
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>

            {/* Profile Info */}
            <motion.div
              className="flex-1 min-w-0 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
            >
              <p className="font-black text-slate-900 text-base tracking-tight truncate leading-tight">
                {user?.user_metadata?.full_name || 'Host Agent'}
              </p>
              <p className="text-[11px] font-medium text-slate-500 truncate bg-gradient-to-r from-slate-500 to-slate-600 bg-clip-text">
                {user?.email || 'Loading...'}
              </p>
            </motion.div>

            {/* Premium Status Indicator */}
            <motion.div
              className="relative z-10 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-2 h-2 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 tracking-tight uppercase">Active</span>
            </motion.div>
          </Link>
        </motion.footer>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Premium Topbar */}
        <motion.header
          className="backdrop-blur-3xl bg-white/80 border-b border-white/50 shadow-xl shadow-black/5 h-20 flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-40"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
        >
          <div className="flex items-center gap-4 text-sm font-bold text-slate-500/80 backdrop-blur-sm">
            <motion.div
              className="p-2 rounded-2xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-200/50"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-5 h-5 text-teal-600" />
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-widest">Host Portal</span>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent capitalize truncate max-w-[200px]">
                {pathname === '/host' ? 'Dashboard' : pathname.split('/').pop()?.replace(/-/g, ' ')}
              </span>
            </div>
          </div>

          {/* Premium Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert('No new notifications')}
              className="relative group p-3 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/50 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-500"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors duration-300" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200/50 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl hover:shadow-slate-300/50 font-bold text-sm text-slate-700 hover:text-slate-900 transition-all duration-500"
            >
              <HelpCircle className="w-4 h-4" />
              Get Help
            </motion.button>

            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-500/30 cursor-pointer hover:shadow-2xl hover:shadow-slate-500/40 transition-all duration-500"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <UserCircle className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        </motion.header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto p-8 lg:p-12">
            {children}
          </div>
        </main>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.5);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(45,212,191,0.4), rgba(16,185,129,0.4));
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, rgba(45,212,191,0.6), rgba(16,185,129,0.6));
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
}