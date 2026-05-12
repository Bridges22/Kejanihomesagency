'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, Building2, Users, Settings, LogOut, TrendingUp } from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/host', icon: LayoutDashboard },
  { name: 'Pipeline & Leads', href: '/host/leads', icon: Users },
  { name: 'Listings', href: '/host/listings', icon: Building2 },
  { name: 'Analytics', href: '/host/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/host/settings', icon: Settings },
];

export default function HostSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white sm:flex">
      <div className="flex h-16 items-center border-b border-gray-200 px-6 gap-2.5">
        <AppLogo size={32} />
        <div className="flex flex-col leading-none">
          <span className="font-display text-base font-black tracking-tighter text-gray-900 uppercase">Kejani Homes</span>
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-teal-600">Agency</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <button
            onClick={() => signOut({ callbackUrl: '/host/login' })}
            className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOut
              className="mr-3 h-5 w-5 flex-shrink-0 text-red-400 group-hover:text-red-500"
              aria-hidden="true"
            />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
