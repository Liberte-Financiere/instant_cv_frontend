import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { TargetAudience } from '@/components/landing/TargetAudience';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { CallToAction } from '@/components/landing/CallToAction';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Hero />
      <Features />
      <TargetAudience />
      <Pricing />
      <FAQ />
      <CallToAction />
      <Footer />
    </div>
  );
}