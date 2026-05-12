'use client';

import React from 'react';
import {
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  Eye,
  Wallet,
  MessageSquare,
  RefreshCw,
  MoreVertical,
  Users,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { hostService } from '@/services/hostService';

export default function HostDashboardPage() {
  const [user, setUser] = React.useState<any>(null);
  const [metrics, setMetrics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();

        if (data.user) {
          setUser(data.user);
          const hostMetrics = await hostService.getHostMetrics(data.user.id);
          setMetrics(hostMetrics);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dynamicKPIs = [
    {
      label: 'Active Listings',
      value: metrics?.activeListings?.toString() || '0',
      change: '+12% from last month',
      color: 'from-teal-500 to-emerald-500',
      icon: PlusCircle,
      trend: 'up',
      gradient: 'bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-teal-600/20'
    },
    {
      label: 'Total Leads',
      value: metrics?.totalLeads?.toString() || '0',
      change: '+28% MoM',
      color: 'from-amber-500 to-orange-500',
      icon: MessageSquare,
      trend: 'up',
      gradient: 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-600/20'
    },
    {
      label: 'Listing Views',
      value: metrics?.totalViews?.toString() || '0',
      change: '+15% WoW',
      color: 'from-blue-500 to-indigo-500',
      icon: Eye,
      trend: 'up',
      gradient: 'bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-blue-600/20'
    },
    {
      label: 'Engagement Rate',
      value: metrics?.totalViews ? `${((metrics.totalLeads / metrics.totalViews) * 100).toFixed(1)}%` : '0%',
      change: '+5% WoW',
      color: 'from-purple-500 to-pink-500',
      icon: Activity,
      trend: 'up',
      gradient: 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-600/20'
    },
  ];

  const activityFeed = metrics?.recentLeads?.length > 0
    ? metrics.recentLeads.map((u: any, i: number) => ({
      id: u.id,
      user: u.seeker?.full_name || 'Anonymous',
      action: 'viewed details of',
      target: u.listing?.title || 'a property',
      time: new Date(u.created_at).toLocaleDateString(),
      avatar: u.seeker?.avatar_url,
      color: 'from-teal-500 to-emerald-500'
    }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 backdrop-blur-xl">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(45,212,191,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(99,102,241,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 25% 75%, rgba(251,191,36,0.1) 0%, transparent 50%)`
        }} />
        <div className="absolute inset-0 bg-grid-slate-800/5 [background-size:100px_100px] animate-pulse" />
      </div>

      <div className="relative z-10 space-y-8 p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Premium Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-xl bg-white/80 border border-white/50 rounded-3xl p-8 shadow-2xl shadow-black/5"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight mb-2">
                Host Dashboard
              </h1>
              <p className="text-lg font-medium text-slate-600/80 backdrop-blur-sm">
                {new Date().toLocaleDateString('en-KE', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-teal-500/25 animate-pulse">
              <Zap className="w-12 h-12 text-white/90" />
            </div>
          </div>
          <p className="text-xl font-light text-slate-500/90 max-w-2xl leading-relaxed">
            Real-time insights into your coastal property performance. Your listings are generating{' '}
            <span className="font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              {metrics?.activeListings || 0} active leads
            </span>{' '}
            today.
          </p>
        </motion.header>

        {/* Premium KPI Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {dynamicKPIs.map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              className={`group relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl bg-white/70 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 ${kpi.gradient} hover:${kpi.color}/20`}
            >
              {/* Animated Background Shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -rotate-2 scale-x-200 group-hover:animate-shimmer duration-1000" />

              <div className="relative z-10 flex justify-between items-start mb-6">
                <span className="text-xs font-black uppercase tracking-widest bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent">
                  {kpi.label}
                </span>
                <kpi.icon
                  size={24}
                  className={`text-slate-400/70 group-hover:text-${kpi.color.split('-')[0]}-400 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}
                />
              </div>

              <div className="space-y-2">
                <motion.div
                  className="text-4xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {kpi.value}
                </motion.div>
                <div className={`text-xs font-black uppercase tracking-widest ${kpi.trend === 'up' ? `bg-gradient-to-r from-${kpi.color.split('-')[0]}-500 to-emerald-500 bg-clip-text text-transparent` : 'text-rose-500'}`}>
                  {kpi.change}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent uppercase tracking-widest flex items-center gap-3">
                Live Activity Stream
                <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full shadow-lg shadow-teal-500/50 animate-ping" />
              </h3>
              <Link
                href="/activity"
                className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
              >
                View Analytics
                <ArrowUpRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="backdrop-blur-xl bg-white/70 border border-white/50 rounded-4xl shadow-2xl shadow-black/10 overflow-hidden">
              <AnimatePresence>
                {activityFeed.length > 0 ? (
                  activityFeed.map((item: any, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="p-6 hover:bg-gradient-to-r hover:from-teal-50/50 to-emerald-50/50 transition-all duration-500 border-b border-white/50 last:border-b-0 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-3 h-3 mt-2 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full shadow-lg shadow-teal-500/50 group-hover:scale-125 transition-all duration-300 animate-pulse" />
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-bold text-slate-900 leading-tight group-hover:text-teal-900 transition-colors">
                            <span className="font-black">{item.user}</span> {item.action}
                            <span className="text-teal-600 font-black"> "{item.target}"</span>
                          </p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {item.time} • 2 min ago
                          </p>
                        </div>
                        <button className="p-2 rounded-2xl bg-slate-100/50 hover:bg-slate-200 group-hover:bg-teal-100 transition-all duration-300">
                          <MoreVertical size={18} className="text-slate-500" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-16 text-center space-y-6 backdrop-blur-sm"
                  >
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-xl">
                      <RefreshCw className="w-12 h-12 text-slate-400 animate-spin-slow" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900 mb-2">No activity yet</p>
                      <p className="text-lg font-medium text-slate-500 max-w-md mx-auto">
                        Your first lead will appear here in real-time. Listings are live and ready.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Premium Quick Actions & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Quick Actions */}
            <div className="backdrop-blur-xl bg-white/70 border border-white/50 rounded-4xl p-8 shadow-2xl shadow-black/10">
              <h4 className="text-lg font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent uppercase tracking-widest mb-6">
                Quick Actions
              </h4>
              <div className="space-y-3">
                <Link
                  href="/host/listings/new"
                  className="group relative overflow-hidden w-full p-6 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-teal-600/20 border border-teal-200/50 rounded-3xl hover:from-teal-500/20 hover:shadow-2xl hover:shadow-teal-500/25 transition-all duration-500 hover:-translate-y-1 font-bold text-slate-900 hover:text-teal-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-500/30 group-hover:scale-110 transition-all duration-300">
                      <PlusCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-black text-lg tracking-tight">Create Listing</span>
                  </div>
                </Link>

                <button className="group relative overflow-hidden w-full p-6 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-600/20 border border-amber-200/50 rounded-3xl hover:from-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-500 hover:-translate-y-1 font-bold text-slate-900 hover:text-amber-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30 group-hover:scale-110 transition-all duration-300">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-black text-lg tracking-tight">View Analytics</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Ultra Premium Stats Card */}
            <div className="relative overflow-hidden rounded-4xl shadow-2xl shadow-black/20 group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-emerald-900 to-teal-800 opacity-95" />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-teal-600/20 backdrop-blur-xl" />
              <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-32 translate-y-32 group-hover:animate-spin-slow" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl translate-x-24 -translate-y-24" />

              <div className="relative z-10 p-8 text-white">
                <h4 className="text-sm font-black uppercase tracking-widest text-teal-200 mb-8 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Portfolio Overview
                </h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full shadow-xl shadow-teal-500/50" />
                      <span className="text-sm font-bold">Active Listings</span>
                    </div>
                    <span className="text-sm font-black">{metrics?.activeListings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-xl shadow-amber-500/50" />
                      <span className="text-sm font-bold">Total Leads</span>
                    </div>
                    <span className="text-sm font-black">{metrics?.totalLeads || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}