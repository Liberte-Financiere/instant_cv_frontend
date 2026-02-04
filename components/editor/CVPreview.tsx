'use client';

import { useCVStore } from '@/store/useCVStore';
import dynamic from 'next/dynamic';
import { ZoomIn, ZoomOut, Download, Printer, Loader2, FileText, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { printCV } from '@/lib/pdf-export';
import { exportToWord } from '@/lib/word-export';
import { CV } from '@/types/cv';

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

interface CVPreviewProps {
  data?: CV; // Optional prop for read-only mode (e.g., share page)
}

export function CVPreview({ data }: CVPreviewProps) {
  const { currentCV } = useCVStore();
  const [zoom, setZoom] = useState(0.8);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Use passed data OR store data
  const cvToRender = data || currentCV;

  // Debounce logic for performance
  // We keep a local version of CV that only updates after delay
  const [debouncedCV, setDebouncedCV] = useState(cvToRender);
  
  useEffect(() => {
    // If data is passed directly (read-only), no need to debounce store changes
    if (data) {
      setDebouncedCV(data);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedCV(currentCV);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [currentCV, data]);

  const cvRef = useRef<HTMLDivElement>(null);

  if (!debouncedCV) return null;

  const renderTemplate = () => {
    switch (debouncedCV.templateId) {
      case 'modern':
        return <ModernSidebar cv={debouncedCV} />;
      case 'professional':
        return <ProfessionalClean cv={debouncedCV} />;
      case 'executive':
        return <ExecutiveCorporate cv={debouncedCV} />;
      case 'creative':
        return <CreativeGrid cv={debouncedCV} />;
      case 'tech':
        return <TechStack cv={debouncedCV} />;
      case 'minimalist':
        return <MinimalistTemplate cv={debouncedCV} />;
      case 'ats':
        return <ATSFriendlyTemplate cv={debouncedCV} />;
      default:
        return <ModernSidebar cv={debouncedCV} />;
    }
  };

  const handleExportPDF = () => {
    if (!currentCV) return;
    
    setShowExportMenu(false);
    
    // Open public CV page with auto-print trigger
    if (debouncedCV?.id) {
       window.open(`/cv/${debouncedCV.id}?print=true`, '_blank');
    }
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      if (debouncedCV) {
        await exportToWord(debouncedCV);
      }
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
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
            className="text-slate-500 rounded-lg hover:bg-slate-100"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="text-slate-500 rounded-lg hover:bg-slate-100"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handlePrint} 
            className="text-slate-600 rounded-lg hover:bg-slate-100"
            title="Imprimer"
          >
             <Printer className="w-4 h-4" />
          </Button>
          
          {/* Export Dropdown */}
          <div className="relative">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="bg-slate-900 hover:bg-slate-800 shadow-none text-xs gap-2"
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
            </Button>
            
            {showExportMenu && !isExporting && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <Button 
                  variant="ghost"
                  onClick={handleExportPDF}
                  className="w-full justify-start gap-3 px-4 py-3 h-auto text-sm text-slate-700 hover:bg-slate-50 rounded-none bg-transparent"
                >
                  <Download className="w-4 h-4 text-red-500" />
                  <div className="text-left">
                    <div className="font-medium">Télécharger PDF</div>
                    <div className="text-xs text-slate-400">Enregistrer en PDF depuis l&apos;impression</div>
                  </div>
                </Button>
                <Button 
                  variant="ghost"
                  onClick={handleExportWord}
                  className="w-full justify-start gap-3 px-4 py-3 h-auto text-sm text-slate-700 hover:bg-slate-50 border-t border-slate-100 rounded-none bg-transparent"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">Télécharger Word</div>
                    <div className="text-xs text-slate-400">Format .docx éditable</div>
                  </div>
                </Button>
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
