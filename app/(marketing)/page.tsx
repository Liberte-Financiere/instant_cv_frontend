import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Features } from '@/components/landing/Features';
import { AIToolbox } from '@/components/landing/AIToolbox';
import { CoverLetterSection } from '@/components/landing/CoverLetterSection';
import { StatsCounter } from '@/components/landing/StatsCounter';
import { TargetAudience } from '@/components/landing/TargetAudience';
import { Testimonials } from '@/components/landing/Testimonials';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { CallToAction } from '@/components/landing/CallToAction';
import { Footer } from '@/components/landing/Footer';
import { MarketingLinks } from '@/components/landing/MarketingLinks';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-light">
      <Hero />
      <HowItWorks />
      <Features />
      <AIToolbox />
      <CoverLetterSection />
      <StatsCounter />
      <TargetAudience />
      <Testimonials />
      <Pricing />
      <FAQ />
      <MarketingLinks />
      <CallToAction />
      <Footer />
    </div>
  );
}