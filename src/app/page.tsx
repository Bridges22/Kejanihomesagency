import React from 'react';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';
import HeroSection from '@/app/homepage/components/HeroSection';
import TrustBar from '@/app/homepage/components/TrustBar';
import FeaturedCities from '@/app/homepage/components/FeaturedCities';
// import WeekendDeals from '@/app/homepage/components/WeekendDeals';
import HowItWorks from '@/app/homepage/components/HowItWorks';
import FeaturedListings from '@/app/homepage/components/FeaturedListings';
import LandlordCTA from '@/app/homepage/components/LandlordCTA';
import Testimonials from '@/app/homepage/components/Testimonials';
import { Toaster } from 'sonner';

import ScrollReveal from '@/components/animations/ScrollReveal';

export default function HomePage() {
  return (
    <>
      <TopNav transparent />
      <main className="overflow-hidden">
        <HeroSection />
        
        <ScrollReveal direction="up" delay={0.1}>
          <TrustBar />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <FeaturedCities />
        </ScrollReveal>

{/* <ScrollReveal direction="left" delay={0.1}>
          <WeekendDeals />
        </ScrollReveal> */}

        <ScrollReveal direction="up" delay={0.1}>
          <HowItWorks />
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.1}>
          <FeaturedListings />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <LandlordCTA />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <Testimonials />
        </ScrollReveal>
      </main>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </>
  );
}
