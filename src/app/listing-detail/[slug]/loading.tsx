import React from 'react';
import ListingSkeleton from '../components/ListingSkeleton';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <>
      <TopNav />
      <main className="min-h-screen bg-gray-50">
        <ListingSkeleton />
      </main>
      <Footer />
    </>
  );
}
