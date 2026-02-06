'use client';

import { use, useEffect, useState } from 'react';
import { useCoverLetterStore } from '@/store/useCoverLetterStore';
import { LetterPreview } from '@/components/cover-letter/LetterPreview';
import { Printer, Download, Home, FileText } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PublicCoverLetterPage({ params }: PageProps) {
  const { id } = use(params);
  const { currentCL, loadCL } = useCoverLetterStore();
  const [isLoading, setIsLoading] = useState(true);

  // Load CL on mount
  useEffect(() => {
    const loadData = async () => {
      // Always fetch to ensure fresh data
      setIsLoading(true);
      await loadCL(id);
      setIsLoading(false);
    };
    loadData();
  }, [id, loadCL]);

  // Handle auto-print
  useEffect(() => {
    if (typeof window !== 'undefined' && currentCL && !isLoading) {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('print') === 'true') {
        setTimeout(() => {
          window.print();
        }, 800);
      }
    }
  }, [currentCL, isLoading]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentCL) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Lettre introuvable</h1>
          <p className="text-slate-600 mb-6">
            Cette lettre n&apos;existe pas ou vous n&apos;avez pas les droits pour la voir.
          </p>
          <Link 
            href="/dashboard/cover-letters"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Home className="w-4 h-4" />
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 print:bg-white">
      {/* Header - Hidden in print */}
      <header className="print:hidden bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              InstantCV
            </Link>
            <span className="text-slate-400">|</span>
            <span className="text-sm text-slate-600 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {currentCL.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20"
            >
              <Printer className="w-4 h-4" />
              Imprimer / PDF
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-8 print:py-0">
        <div className="max-w-[210mm] mx-auto print:max-w-none">
            {/* A4 Paper */}
            <LetterPreview 
              coverLetter={currentCL} 
              className="w-full min-h-[297mm] shadow-2xl print:shadow-none"
            />
        </div>
      </main>
    </div>
  );
}
