import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import { AuthProvider } from '@/contexts/AuthContext';
import PageTransition from '@/components/animations/PageTransition';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Kejani Homes Agency | Find Verified Rentals & Short Stays',
  description: 'Browse verified rental and Airbnb listings across Diani, Mombasa, and Nyali. Get direct access to landlords for free and find your perfect home.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://images.unsplash.com' crossOrigin='anonymous' />
        <link rel='preconnect' href='https://img.rocket.new' crossOrigin='anonymous' />
        <link rel='dns-prefetch' href='https://static.rocket.new' />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body>
        <AuthProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </AuthProvider>

        <script type='module' async src='https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2FKejani%20Homes%20Agency3611back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.18' />
        <script type='module' async src='https://static.rocket.new/rocket-shot.js?v=0.0.2' />
      </body>
    </html>
  );
}
