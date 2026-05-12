import React from 'react';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';
import SearchResultsContent from '@/app/search-results/components/SearchResultsContent';
import { Toaster } from 'sonner';

export default function SearchResultsPage() {
  return (
    <>
      <TopNav />
      <main className="min-h-screen bg-gray-50">
        <React.Suspense fallback={<div className="p-10 text-center">Loading search results...</div>}>
          <SearchResultsContent />
        </React.Suspense>
      </main>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </>
  );
}