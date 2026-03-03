'use client';

import { use, useEffect, useState, useRef, useCallback } from 'react';
import { useCVStore } from '@/store/useCVStore';
import dynamic from 'next/dynamic';
import { Download, Printer, Home } from 'lucide-react';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';

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
  const [serverCV, setServerCV] = useState<any>(null);
  const [loadError, setLoadError] = useState(false);
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
      setIsLoading(true);
      setLoadError(false);
      try {
        const searchParams = new URLSearchParams(window.location.search);
        // If headless, we bypass the local Zustand cache to ensure we get the latest DB version
        // and we avoid potential CSR network routing issues for the headless browser
        const forceFetch = searchParams.get('headless') === 'true';

        if (forceFetch || !currentCV || currentCV.id !== id) {
          const token = searchParams.get('token') || undefined;
          const fetchedCV = await fetchCV(id, token);
          if (fetchedCV) {
            setServerCV(fetchedCV);
          } else {
            setLoadError(true);
          }
        } else {
          setServerCV(currentCV);
        }
      } catch (e) {
        console.error("Error loading CV:", e);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, fetchCV, currentCV?.id]);

  const activeCV = serverCV || currentCV;

  // Handle auto-print
  useEffect(() => {
    if (typeof window !== 'undefined' && activeCV && !isLoading && !loadError) {
      const searchParams = new URLSearchParams(window.location.search);
      const isPrint = searchParams.get('print') === 'true';
      const isHeadless = searchParams.get('headless') === 'true';

      if (isPrint && !isHeadless) {
        setTimeout(() => {
          window.print();
        }, 1500);
      }
    }
  }, [activeCV, isLoading, loadError]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError || (!activeCV && !isLoading)) {
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

  // Double check
  if (!activeCV) return null;

  const renderTemplate = () => {
    switch (activeCV.templateId) {
      case 'modern': return <ModernSidebar cv={activeCV} />;
      case 'professional': return <ProfessionalClean cv={activeCV} />;
      case 'executive': return <ExecutiveCorporate cv={activeCV} />;
      case 'creative': return <CreativeGrid cv={activeCV} />;
      case 'tech': return <TechStack cv={activeCV} />;
      case 'minimalist': return <MinimalistTemplate cv={activeCV} />;
      case 'ats': return <ATSFriendlyTemplate cv={activeCV} />;
      case 'ats-glacier': return <ATSGlacier cv={activeCV} />;
      case 'ats-iron': return <ATSIron cv={activeCV} />;
      case 'elegant-photo': return <ElegantPhoto cv={activeCV} />;
      case 'corporate-blue': return <CorporateBlue cv={activeCV} />;
      case 'clean-grid': return <CleanGrid cv={activeCV} />;
      case 'swiss': return <Swiss cv={activeCV} />;
      case 'gradient': return <GradientHeader cv={activeCV} />;
      case 'timeline': return <TimelinePro cv={activeCV} />;
      case 'compact': return <CompactSingle cv={activeCV} />;
      case 'bold-header': return <BoldHeader cv={activeCV} />;
      case 'two-tone': return <TwoTone cv={activeCV} />;
      case 'infographic': return <Infographic cv={activeCV} />;
      case 'classic-serif': return <ClassicSerif cv={activeCV} />;
      case 'nordic': return <Nordic cv={activeCV} />;
      case 'pastel': return <PastelModern cv={activeCV} />;
      case 'blueprint-premium': return <BlueprintPremium cv={activeCV} />;
      default: return <ModernSidebar cv={activeCV} />;
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
              {APP_CONFIG.name}
            </Link>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-sm text-slate-600 truncate hidden sm:inline">
              CV de {activeCV.personalInfo.firstName} {activeCV.personalInfo.lastName}
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
        Créé avec <Link href="/" className="text-blue-600 hover:underline">{APP_CONFIG.name}</Link>
      </footer>
    </div>
  );
}
