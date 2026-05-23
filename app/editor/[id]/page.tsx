'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Save, Eye, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { useCVStore } from '@/store/useCVStore';
import { Stepper } from '@/components/editor/Stepper';
import { FormSection } from '@/components/editor/FormSection';
import { CVPreview } from '@/components/editor/CVPreview';
import { ColorPicker } from '@/components/editor/ColorPicker';
import { SectionOrderEditor } from '@/components/editor/SectionOrderEditor';
import { TemplateSelector } from '@/components/editor/TemplateSelector';
import { TranslateCVButton } from '@/components/editor/TranslateCVButton';
import { LanguageSelector } from '@/components/editor/LanguageSelector';
import { MobilePreviewModal } from '@/components/editor/MobilePreviewModal';
import { EDITOR_STEPS } from '@/types/cv';

export default function EditorPage() {
  const params = useParams();
  const { currentCV, currentStep, loadCV, setCurrentStep, saveCurrentCV } = useCVStore();
  const [zoom, setZoom] = useState(1);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  const id = params.id as string;

  useEffect(() => {
    if (id && id !== 'new') {
      loadCV(id);
    }
  }, [id, loadCV]);

  // ─── AUTO-SAVE with debounce ───
  const doSave = useCallback(async () => {
    const cv = useCVStore.getState().currentCV;
    if (!cv) return;
    
    const snapshot = JSON.stringify(cv);
    if (snapshot === lastSavedRef.current) return; // No changes
    
    setSaveStatus('saving');
    try {
      await saveCurrentCV();
      lastSavedRef.current = snapshot;
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }, [saveCurrentCV]);

  useEffect(() => {
    if (!currentCV) return;
    
    // Debounce: save 3s after last change
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      // Check again inside timeout to avoid queueing unnecessary saves if user clicked very fast
      const latestSnapshot = JSON.stringify(useCVStore.getState().currentCV);
      if (latestSnapshot !== lastSavedRef.current) {
        doSave();
      }
    }, 3000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [currentCV, doSave]);

  // Save on page leave
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Flush any pending debounced save
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      const cv = useCVStore.getState().currentCV;
      if (cv) {
        const payload = JSON.stringify(cv);
        if (payload !== lastSavedRef.current) {
          // Use fetch with keepalive for reliable save on close
          fetch(`/api/cv/${cv.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {/* best effort */});
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleNext = () => {
    const currentIndex = EDITOR_STEPS.findIndex((s) => s.key === currentStep);
    if (currentIndex < EDITOR_STEPS.length - 1) {
      setCurrentStep(EDITOR_STEPS[currentIndex + 1].key);
    }
  };

  const handlePrev = () => {
    const currentIndex = EDITOR_STEPS.findIndex((s) => s.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(EDITOR_STEPS[currentIndex - 1].key);
    }
  };

  const handleDownloadPDF = async () => {
    if (!currentCV?.id) return;
    
    setIsDownloadingPDF(true);
    try {
       const res = await fetch('/api/pdf/generate', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ id: currentCV.id }),
       });

       if (!res.ok) {
          throw new Error('Erreur de génération');
       }

       const blob = await res.blob();
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `CV_${currentCV.personalInfo.firstName || 'Instant'}_${currentCV.personalInfo.lastName || 'CV'}.pdf`;
       document.body.appendChild(a);
       a.click();
       window.URL.revokeObjectURL(url);
       document.body.removeChild(a);
    } catch (error) {
       console.error(error);
       alert('Échec du téléchargement du PDF. Veuillez réessayer.');
    } finally {
       setIsDownloadingPDF(false);
    }
  };

  if (!currentCV || currentCV.id !== id || !currentCV.experiences) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Chargement de votre espace de travail...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Editor Header */}
      <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-50 px-2 sm:px-4 flex items-center justify-between shadow-sm gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-4 min-w-0">
          <Link
            href="/dashboard"
            className="p-1 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Retour au Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
          <div className="min-w-0 flex flex-col justify-center">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={() => {
                  if (tempTitle.trim() && tempTitle.trim() !== currentCV.title) {
                    useCVStore.getState().updateCVTitle(tempTitle.trim());
                  }
                  setIsEditingTitle(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (tempTitle.trim() && tempTitle.trim() !== currentCV.title) {
                      useCVStore.getState().updateCVTitle(tempTitle.trim());
                    }
                    setIsEditingTitle(false);
                  } else if (e.key === 'Escape') {
                    setIsEditingTitle(false);
                  }
                }}
                className="font-bold text-slate-900 text-sm sm:text-base bg-white border border-indigo-400 rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-indigo-500/50 w-full max-w-[200px]"
              />
            ) : (
              <h1 
                onClick={() => {
                  setTempTitle(currentCV.title);
                  setIsEditingTitle(true);
                  setTimeout(() => titleInputRef.current?.focus(), 0);
                }}
                className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-[80px] xs:max-w-[120px] sm:max-w-xs cursor-pointer hover:bg-slate-100 px-2 py-0.5 rounded -ml-2 transition-colors inline-flex items-center gap-2 group"
                title="Renommer le CV"
              >
                <span>{currentCV.title}</span>
                <span className="opacity-0 group-hover:opacity-100 text-slate-400 text-xs transition-opacity">✏️</span>
              </h1>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
               {saveStatus === 'saving' ? (
                 <>
                   <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse flex-shrink-0" />
                   <span className="hidden sm:inline">Sauvegarde...</span>
                 </>
               ) : saveStatus === 'error' ? (
                 <>
                   <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                   <span className="hidden sm:inline text-red-500">Erreur de sauvegarde</span>
                 </>
               ) : (
                 <>
                   <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                   <span className="hidden sm:inline">Sauvegardé</span>
                 </>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
           {/* Mobile Preview Button */}
           <button
             onClick={() => setShowMobilePreview(true)}
             className="flex lg:hidden items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
             title="Aperçu"
           >
             <Eye className="w-4 h-4" />
             <span className="hidden sm:inline ml-2 text-sm font-medium">Aperçu</span>
           </button>

           <div className="h-6 w-px bg-slate-200 mx-1 lg:hidden" />

           <TranslateCVButton />
           <LanguageSelector />
           <TemplateSelector />
           <ColorPicker />
           <SectionOrderEditor />
           
           <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

           <button 
             onClick={handleDownloadPDF}
             disabled={isDownloadingPDF}
             className={`flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto gap-2 sm:px-4 sm:py-2 rounded-lg font-bold shadow-lg transition-all active:scale-95 ${
               isDownloadingPDF 
                 ? 'bg-slate-400 cursor-not-allowed text-white' 
                 : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
             }`}
             title="Exporter PDF Premium"
           >
             {isDownloadingPDF ? (
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
               <Download className="w-4 h-4" />
             )}
             <span className="hidden sm:inline">
               {isDownloadingPDF ? 'Création...' : 'Télécharger PDF'}
             </span>
           </button>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Form & Stepper */}
        <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col border-r border-slate-200 bg-white">
           {/* Stepper Header */}
           <div className="p-4 border-b border-slate-100">
              <Stepper currentStep={currentStep} onStepChange={setCurrentStep} />
           </div>
           
           {/* Scrollable Form Area */}
           <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-10 custom-scrollbar">
              <div className="max-w-2xl mx-auto">
                 <FormSection 
                   currentStep={currentStep} 
                   onNext={handleNext} 
                   onPrev={handlePrev} 
                 />
              </div>
           </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="hidden lg:flex flex-1 bg-slate-100 flex-col relative overflow-hidden">
           {/* Functional Header for Preview (Zoom, View Mode) */}
           <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-slate-200 rounded-full px-4 py-2 flex items-center gap-4 shadow-sm z-10 text-sm font-medium text-slate-600">
              <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="hover:text-blue-600 p-1">-</button>
              <span>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="hover:text-blue-600 p-1">+</button>
           </div>

           {/* Preview Container */}
           <div className="flex-1 overflow-auto flex items-start justify-center p-8 custom-scrollbar">
              <motion.div 
                layout
                style={{ 
                  scale: zoom,
                  transformOrigin: 'top center' 
                }}
                className="bg-white shadow-2xl shadow-slate-300/50"
              >
                 {/* A4 Wrapper managed by CVPreview or here */}
                 <div className="w-[210mm] min-h-[297mm] origin-top bg-white">
                    <CVPreview hideToolbar />
                 </div>
              </motion.div>
           </div>
        </div>
      </div>
      <MobilePreviewModal 
        isOpen={showMobilePreview} 
        onClose={() => setShowMobilePreview(false)} 
      />
    </div>
  );
}
