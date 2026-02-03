'use client';

import { useRef } from 'react';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { TargetAudience } from '@/components/landing/TargetAudience';
import { Pricing } from '@/components/landing/Pricing'; // Import Pricing
import { CallToAction } from '@/components/landing/CallToAction';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  const containerRef = useRef(null);

  return (
    <div className="min-h-screen bg-[#FAFAFA]" ref={containerRef}>
      <Hero />
      <Features />
      <TargetAudience />
      <Pricing /> {/* Add Pricing */}
      <CallToAction />
      <Footer />
    </div>
  );
}