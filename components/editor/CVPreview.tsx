'use client';

import { useCVStore } from '@/store/useCVStore';
import { ModernSidebar } from '@/components/templates/ModernSidebar';
import { ProfessionalClean } from '@/components/templates/ProfessionalClean';
import { ExecutiveCorporate } from '@/components/templates/ExecutiveCorporate';
import { CreativeGrid } from '@/components/templates/CreativeGrid';
import { TechStack } from '@/components/templates/TechStack';
import { MinimalistTemplate } from '@/components/templates/MinimalistTemplate';
import { ATSFriendlyTemplate } from '@/components/templates/ATSFriendlyTemplate';
import { ZoomIn, ZoomOut, Download, Printer, Loader2, FileText, ChevronDown } from 'lucide-react';
import { useState, useRef } from 'react';
import { printCV } from '@/lib/pdf-export';
import { exportToWord } from '@/lib/word-export';

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
    if (!cvRef.current) return;
    
    setShowExportMenu(false);
    
    // Use browser print dialog - user can save as PDF
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert('Veuillez autoriser les popups pour exporter en PDF.');
      return;
    }

    // Clone styles
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch {
          return '';
        }
      })
      .join('\n');

    const filename = `${currentCV.personalInfo.firstName}_${currentCV.personalInfo.lastName}_CV`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            ${styles}
            
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
            
            @page {
              size: A4;
              margin: 0;
            }
            
            @media print {
              body { margin: 0; padding: 0; }
              .cv-template { width: 210mm !important; min-height: 297mm !important; }
            }
            
            /* Hide print toolbar hint after 5s */
            .print-hint {
              position: fixed;
              top: 10px;
              left: 50%;
              transform: translateX(-50%);
              background: #1e293b;
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              font-family: system-ui, sans-serif;
              font-size: 14px;
              z-index: 9999;
              animation: fadeOut 5s forwards;
            }
            @keyframes fadeOut {
              0%, 80% { opacity: 1; }
              100% { opacity: 0; pointer-events: none; }
            }
            @media print { .print-hint { display: none; } }
          </style>
        </head>
        <body>
          <div class="print-hint">
            💡 Choisissez "Enregistrer au format PDF" dans la destination
          </div>
          ${cvRef.current.outerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for styles to load then trigger print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 800);
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
