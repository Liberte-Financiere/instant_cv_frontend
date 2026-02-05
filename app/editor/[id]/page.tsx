'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Save, Eye, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { useCVStore } from '@/store/useCVStore';
import { Stepper } from '@/components/editor/Stepper';
import { FormSection } from '@/components/editor/FormSection';
import { CVPreview } from '@/components/editor/CVPreview';
import { ColorPicker } from '@/components/editor/ColorPicker';
import { ShareButton } from '@/components/editor/ShareButton';
import { SectionOrderEditor } from '@/components/editor/SectionOrderEditor';
import { EDITOR_STEPS } from '@/types/cv';

export default function EditorPage() {
  const params = useParams();
  const { currentCV, currentStep, loadCV, setCurrentStep } = useCVStore();
  const [zoom, setZoom] = useState(1);

  const id = params.id as string;

  useEffect(() => {
    if (id && id !== 'new') {
      loadCV(id);
    }
  }, [id, loadCV]);

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

  if (!currentCV) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2463eb] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Chargement de votre espace de travail...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Editor Header */}
      <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-50 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Retour au Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />
          <div>
            <h1 className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-[200px] sm:max-w-xs">
              {currentCV.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
               <span className="w-2 h-2 rounded-full bg-green-500" />
               <span>Sauvegardé</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <ColorPicker />
           <SectionOrderEditor />
           <ShareButton />           
           <button 
             className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
             title="Changer de modèle"
           >
             <LayoutTemplate className="w-4 h-4" />
             <span>Modèle</span>
           </button>
           
           <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

           <button 
             onClick={() => {
                if (currentCV?.id) {
                  window.open(`/cv/${currentCV.id}?print=true`, '_blank');
                }
             }}
             className="flex items-center gap-2 px-4 py-2 bg-[#2463eb] hover:bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
           >
             <Download className="w-4 h-4" />
             <span className="hidden sm:inline">Exporter PDF</span>
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
           <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
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
                    <CVPreview />
                 </div>
              </motion.div>
           </div>
        </div>
      </div>
    </div>
  );
}
