'use client';

import { useCVStore } from '@/store/useCVStore';
import dynamic from 'next/dynamic';
import { ZoomIn, ZoomOut, Download, Printer, Loader2, FileText, ChevronDown } from 'lucide-react';
import { useState, useRef } from 'react';
import { printCV } from '@/lib/pdf-export';
import { exportToWord } from '@/lib/word-export';

// Dynamic imports for templates
const ModernSidebar = dynamic(() => import('@/components/templates/ModernSidebar').then(mod => mod.ModernSidebar), { 
  loading: () => <div className="min-h-[297mm] flex items-center justify-center bg-white"><Loader2 className="animate-spin text-slate-300" /></div> 
});
const ProfessionalClean = dynamic(() => import('@/components/templates/ProfessionalClean').then(mod => mod.ProfessionalClean), {
  loading: () => <div className="min-h-[297mm] flex items-center justify-center bg-white"><Loader2 className="animate-spin text-slate-300" /></div>
});
const ExecutiveCorporate = dynamic(() => import('@/components/templates/ExecutiveCorporate').then(mod => mod.ExecutiveCorporate), {
  loading: () => <div className="min-h-[297mm] flex items-center justify-center bg-white"><Loader2 className="animate-spin text-slate-300" /></div>
});
const CreativeGrid = dynamic(() => import('@/components/templates/CreativeGrid').then(mod => mod.CreativeGrid), {
  loading: () => <div className="min-h-[297mm] flex items-center justify-center bg-white"><Loader2 className="animate-spin text-slate-300" /></div>
});
const TechStack = dynamic(() => import('@/components/templates/TechStack').then(mod => mod.TechStack), {
  loading: () => <div className="min-h-[297mm] flex items-center justify-center bg-white"><Loader2 className="animate-spin text-slate-300" /></div>
});
const MinimalistTemplate = dynamic(() => import('@/components/templates/MinimalistTemplate').then(mod => mod.MinimalistTemplate), {
  loading: () => <div className="min-h-[297mm] flex items-center justify-center bg-white"><Loader2 className="animate-spin text-slate-300" /></div>
});
const ATSFriendlyTemplate = dynamic(() => import('@/components/templates/ATSFriendlyTemplate').then(mod => mod.ATSFriendlyTemplate), {
  loading: () => <div className="min-h-[297mm] flex items-center justify-center bg-white"><Loader2 className="animate-spin text-slate-300" /></div>
});

export function CVPreview() {
  const { currentCV } = useCVStore();
  const [zoom, setZoom] = useState(0.8);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  if (!currentCV) return null;

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

  const handleExportPDF = () => {
    if (!currentCV) return;
    
    setShowExportMenu(false);
    
    // Open public CV page with auto-print trigger
    window.open(`/cv/${currentCV.id}?print=true`, '_blank');
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      await exportToWord(currentCV);
    } catch (error) {
      console.error('Export Word failed:', error);
      alert('Erreur lors de l\'export Word. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (!cvRef.current) return;
    printCV(cvRef.current);
  };

  return (
    <div className="h-full flex flex-col bg-slate-200/50">
      {/* Toolbar */}
      <div className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 print:hidden">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint} 
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            title="Imprimer"
          >
             <Printer className="w-4 h-4" />
          </button>
          
          {/* Export Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Export...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Exporter
                  <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
            
            {showExportMenu && !isExporting && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <button 
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4 text-red-500" />
                  <div className="text-left">
                    <div className="font-medium">Télécharger PDF</div>
                    <div className="text-xs text-slate-400">Enregistrer en PDF depuis l&apos;impression</div>
                  </div>
                </button>
                <button 
                  onClick={handleExportWord}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">Télécharger Word</div>
                    <div className="text-xs text-slate-400">Format .docx éditable</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowExportMenu(false)}
        />
      )}

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8 flex justify-center items-start print:p-0 print:overflow-visible">
        <div 
           ref={cvRef}
           className="bg-white shadow-xl origin-top transition-transform duration-200 ease-out print:shadow-none print:m-0 print:scale-100"
           style={{ 
             width: '210mm', 
             minHeight: '297mm',
             transform: `scale(${zoom})`
           }}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
