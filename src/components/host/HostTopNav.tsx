'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Menu, X, LayoutDashboard, Building2, Users, Settings, LogOut, Bell, TrendingUp } from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/host', icon: LayoutDashboard },
  { name: 'Pipeline & Leads', href: '/host/leads', icon: Users },
  { name: 'Listings', href: '/host/listings', icon: Building2 },
  { name: 'Analytics', href: '/host/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/host/settings', icon: Settings },
];

export default function HostTopNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-between sm:justify-end">
          {/* Mobile menu button */}
          <button
            type="button"
            className="sm:hidden -ml-2 rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="sm:hidden font-bold tracking-tight text-gray-900">
            Kejani Homes Agency Agency
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown stub */}
            <div className="relative ml-2">
              <div className="flex items-center space-x-3 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                <span className="hidden sm:inline-block">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="relative z-50 sm:hidden">
          <div className="fixed inset-0 bg-gray-900/80 transition-opacity" onClick={() => setMobileMenuOpen(false)} />
          
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1 flex-col bg-white pb-4 pt-5">
              <div className="absolute right-0 top-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-shrink-0 items-center px-4">
                <span className="text-xl font-bold tracking-tight text-gray-900">Kejani Homes Agency Agency</span>
              </div>
              
              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="space-y-1 px-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group flex items-center rounded-md px-2 py-2 text-base font-medium ${
                          isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon
                          className={`mr-4 h-6 w-6 flex-shrink-0 ${
                            isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    )
                  })}
                  
                  <button
                    onClick={() => signOut({ callbackUrl: '/host/login' })}
                    className="mt-6 group flex w-full items-center rounded-md px-2 py-2 text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut
                      className="mr-4 h-6 w-6 flex-shrink-0 text-red-500 group-hover:text-red-600"
                      aria-hidden="true"
                    />
                    Sign out
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
