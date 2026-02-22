'use client';

import { use, useEffect, useState, useRef, useCallback } from 'react';
import { useCVStore } from '@/store/useCVStore';
import dynamic from 'next/dynamic';
import { Download, Printer, Home } from 'lucide-react';
import Link from 'next/link';

// Dynamic imports for ALL templates
const ModernSidebar = dynamic(() => import('@/components/templates/ModernSidebar').then(m => m.ModernSidebar));
const ProfessionalClean = dynamic(() => import('@/components/templates/ProfessionalClean').then(m => m.ProfessionalClean));
const ExecutiveCorporate = dynamic(() => import('@/components/templates/ExecutiveCorporate').then(m => m.ExecutiveCorporate));
const CreativeGrid = dynamic(() => import('@/components/templates/CreativeGrid').then(m => m.CreativeGrid));
const TechStack = dynamic(() => import('@/components/templates/TechStack').then(m => m.TechStack));
const MinimalistTemplate = dynamic(() => import('@/components/templates/MinimalistTemplate').then(m => m.MinimalistTemplate));
const ATSFriendlyTemplate = dynamic(() => import('@/components/templates/ATSFriendlyTemplate').then(m => m.ATSFriendlyTemplate));
const ATSGlacier = dynamic(() => import('@/components/templates/ATSGlacier').then(m => m.ATSGlacier));
const ATSIron = dynamic(() => import('@/components/templates/ATSIron').then(m => m.ATSIron));
const ElegantPhoto = dynamic(() => import('@/components/templates/ElegantPhoto').then(m => m.ElegantPhoto));
const CorporateBlue = dynamic(() => import('@/components/templates/CorporateBlue').then(m => m.CorporateBlue));
const CleanGrid = dynamic(() => import('@/components/templates/CleanGrid').then(m => m.CleanGrid));
const Swiss = dynamic(() => import('@/components/templates/Swiss').then(m => m.Swiss));
const GradientHeader = dynamic(() => import('@/components/templates/GradientHeader').then(m => m.GradientHeader));
const TimelinePro = dynamic(() => import('@/components/templates/TimelinePro').then(m => m.TimelinePro));
const CompactSingle = dynamic(() => import('@/components/templates/CompactSingle').then(m => m.CompactSingle));
const BoldHeader = dynamic(() => import('@/components/templates/BoldHeader').then(m => m.BoldHeader));
const TwoTone = dynamic(() => import('@/components/templates/TwoTone').then(m => m.TwoTone));
const Infographic = dynamic(() => import('@/components/templates/Infographic').then(m => m.Infographic));
const ClassicSerif = dynamic(() => import('@/components/templates/ClassicSerif').then(m => m.ClassicSerif));
const Nordic = dynamic(() => import('@/components/templates/Nordic').then(m => m.Nordic));
const PastelModern = dynamic(() => import('@/components/templates/PastelModern').then(m => m.PastelModern));
const BlueprintPremium = dynamic(() => import('@/components/templates/BlueprintPremium').then(m => m.BlueprintPremium));

const A4_WIDTH_PX = 794; // 210mm in pixels at 96dpi

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PublicCVPage({ params }: PageProps) {
  const { id } = use(params);
  const { currentCV, fetchCV } = useCVStore();
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Responsive scaling
  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32; // minus padding
      const newScale = Math.min(containerWidth / A4_WIDTH_PX, 1);
      setScale(newScale);
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale, isLoading]);

  // Load CV on mount
  useEffect(() => {
    const loadData = async () => {
      if (!currentCV || currentCV.id !== id) {
        setIsLoading(true);
        await fetchCV(id);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, fetchCV]); // Remove currentCV from deps to avoid loop found CV

  // Handle auto-print
  useEffect(() => {
    if (typeof window !== 'undefined' && currentCV && !isLoading) {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('print') === 'true') {
        setTimeout(() => {
          window.print();
        }, 800);
      }
    }
  }, [currentCV, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentCV) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">CV introuvable</h1>
          <p className="text-slate-600 mb-6">
            Ce CV n&apos;existe pas ou vous n&apos;avez pas les droits pour le voir.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Home className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (currentCV.templateId) {
      case 'modern': return <ModernSidebar cv={currentCV} />;
      case 'professional': return <ProfessionalClean cv={currentCV} />;
      case 'executive': return <ExecutiveCorporate cv={currentCV} />;
      case 'creative': return <CreativeGrid cv={currentCV} />;
      case 'tech': return <TechStack cv={currentCV} />;
      case 'minimalist': return <MinimalistTemplate cv={currentCV} />;
      case 'ats': return <ATSFriendlyTemplate cv={currentCV} />;
      case 'ats-glacier': return <ATSGlacier cv={currentCV} />;
      case 'ats-iron': return <ATSIron cv={currentCV} />;
      case 'elegant-photo': return <ElegantPhoto cv={currentCV} />;
      case 'corporate-blue': return <CorporateBlue cv={currentCV} />;
      case 'clean-grid': return <CleanGrid cv={currentCV} />;
      case 'swiss': return <Swiss cv={currentCV} />;
      case 'gradient': return <GradientHeader cv={currentCV} />;
      case 'timeline': return <TimelinePro cv={currentCV} />;
      case 'compact': return <CompactSingle cv={currentCV} />;
      case 'bold-header': return <BoldHeader cv={currentCV} />;
      case 'two-tone': return <TwoTone cv={currentCV} />;
      case 'infographic': return <Infographic cv={currentCV} />;
      case 'classic-serif': return <ClassicSerif cv={currentCV} />;
      case 'nordic': return <Nordic cv={currentCV} />;
      case 'pastel': return <PastelModern cv={currentCV} />;
      case 'blueprint-premium': return <BlueprintPremium cv={currentCV} />;
      default: return <ModernSidebar cv={currentCV} />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-200">
      {/* Header - Hidden in print */}
      <header className="print:hidden bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="text-xl font-bold text-blue-600 shrink-0">
              JobSira
            </Link>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-sm text-slate-600 truncate hidden sm:inline">
              CV de {currentCV.personalInfo.firstName} {currentCV.personalInfo.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Télécharger PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* CV Content */}
      <main ref={containerRef} className="py-4 sm:py-8 px-4 print:py-0 print:px-0">
        <div 
          className="mx-auto print:max-w-none print:transform-none"
          style={{
            width: `${A4_WIDTH_PX}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            marginBottom: scale < 1 ? `calc((${scale} - 1) * 1123px)` : undefined,
          }}
        >
          <div className="bg-white shadow-2xl print:shadow-none">
            {renderTemplate()}
          </div>
        </div>
      </main>

      {/* Footer - Hidden in print */}
      <footer className="print:hidden py-6 text-center text-sm text-slate-500">
        Créé avec <Link href="/" className="text-blue-600 hover:underline">JobSira</Link>
      </footer>
    </div>
  );
}
