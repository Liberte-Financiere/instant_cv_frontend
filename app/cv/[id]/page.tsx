'use client';

import { use, useEffect, useState } from 'react';
import { useCVStore } from '@/store/useCVStore';
import { ModernSidebar } from '@/components/templates/ModernSidebar';
import { ProfessionalClean } from '@/components/templates/ProfessionalClean';
import { ExecutiveCorporate } from '@/components/templates/ExecutiveCorporate';
import { CreativeGrid } from '@/components/templates/CreativeGrid';
import { TechStack } from '@/components/templates/TechStack';
import { MinimalistTemplate } from '@/components/templates/MinimalistTemplate';
import { ATSFriendlyTemplate } from '@/components/templates/ATSFriendlyTemplate';
import { Download, Printer, Home } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PublicCVPage({ params }: PageProps) {
  const { id } = use(params);
  const { currentCV, fetchCV } = useCVStore();
  const [isLoading, setIsLoading] = useState(true);

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
            Ce CV n'existe pas ou vous n'avez pas les droits pour le voir.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (currentCV.templateId) {
      case 'modern':
        return <ModernSidebar cv={currentCV} />;
      case 'professional':
        return <ProfessionalClean cv={currentCV} />;
      case 'executive':
        return <ExecutiveCorporate cv={currentCV} />;
      case 'creative':
        return <CreativeGrid cv={currentCV} />;
      case 'tech':
        return <TechStack cv={currentCV} />;
      case 'minimalist':
        return <MinimalistTemplate cv={currentCV} />;
      case 'ats':
        return <ATSFriendlyTemplate cv={currentCV} />;
      default:
        return <ModernSidebar cv={currentCV} />;
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
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold text-blue-600">
              InstantCV
            </Link>
            <span className="text-slate-400">|</span>
            <span className="text-sm text-slate-600">
              CV de {currentCV.personalInfo.firstName} {currentCV.personalInfo.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Télécharger PDF
            </button>
          </div>
        </div>
      </header>

      {/* CV Content */}
      <main className="py-8 print:py-0">
        <div className="max-w-[210mm] mx-auto print:max-w-none">
          <div className="bg-white shadow-2xl print:shadow-none">
            {renderTemplate()}
          </div>
        </div>
      </main>

      {/* Footer - Hidden in print */}
      <footer className="print:hidden py-6 text-center text-sm text-slate-500">
        Créé avec <Link href="/" className="text-blue-600 hover:underline">InstantCV</Link>
      </footer>
    </div>
  );
}
