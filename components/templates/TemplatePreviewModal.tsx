'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CVThumbnail } from '@/components/dashboard/CVThumbnail';
import { TemplateOption } from '@/lib/templates';
import { MOCK_PREVIEW_CV } from '@/lib/mock-cv';
import { useCVStore } from '@/store/useCVStore';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

interface TemplatePreviewModalProps {
  template: TemplateOption | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePreviewModal({ template, isOpen, onClose }: TemplatePreviewModalProps) {
  const router = useRouter();
  const { createNewCV } = useCVStore();
  const [isLoading, setIsLoading] = useState(false);
  const [cvTitle, setCvTitle] = useState('');

  // Reset title when template changes
  useEffect(() => {
    if (template && !cvTitle) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCvTitle(`Mon CV ${template.name}`);
    }
  }, [template, cvTitle]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleUseTemplate = () => {
    if (!template) return;
    if (!cvTitle.trim()) {
        // Optionnel: Ajouter une validation visuelle ou un toast
        return;
    }
    
    setIsLoading(true);
    
    try {
      // Create new CV with selected template
      const cvId = createNewCV(cvTitle, template.id);
      
      // Redirect to editor
      router.push(`/editor/${cvId}`);
    } catch (error) {
      console.error('Failed to create CV:', error);
      setIsLoading(false);
    }
  };

  if (!isOpen || !template) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>

          {/* Left Side: Large Preview */}
          <div className="flex-1 bg-slate-100 p-8 flex items-center justify-center overflow-auto min-h-[400px] md:min-h-full relative">
             <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]"></div>
             <div className="relative shadow-2xl rounded transition-transform">
               <CVThumbnail
                 cv={{ ...MOCK_PREVIEW_CV, templateId: template.id }}
                 scale={0.55}
               />
             </div>
          </div>

          {/* Right Side: Details & Actions */}
          <div className="w-full md:w-[400px] p-8 flex flex-col bg-white overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide">
                    Gratuit
                 </span>
                 <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide flex items-center gap-1">
                    <Check className="w-3 h-3" /> ATS Friendly
                 </span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
                {template.name}
              </h2>
              <p className="text-slate-500">
                {template.description}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8 flex-1">
               <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b pb-2">Pourquoi ce modèle ?</h3>
               <ul className="space-y-3">
                 <li className="flex items-start gap-3 text-sm text-slate-600">
                   <div className="mt-0.5 p-1 bg-blue-100 text-blue-600 rounded-full">
                     <Check className="w-3 h-3" />
                   </div>
                   <span>Design optimisé pour la lecture rapide.</span>
                 </li>
                 <li className="flex items-start gap-3 text-sm text-slate-600">
                   <div className="mt-0.5 p-1 bg-blue-100 text-blue-600 rounded-full">
                     <Check className="w-3 h-3" />
                   </div>
                   <span>Structure claire et professionnelle.</span>
                 </li>
                 <li className="flex items-start gap-3 text-sm text-slate-600">
                   <div className="mt-0.5 p-1 bg-blue-100 text-blue-600 rounded-full">
                     <Check className="w-3 h-3" />
                   </div>
                   <span>Sections modifiables à volonté.</span>
                 </li>
               </ul>
            </div>

            {/* CTA & Input */}
            <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
              <div>
                <Label htmlFor="cv-title" className="text-slate-700 mb-1.5 block">Nom de votre CV</Label>
                <Input 
                   id="cv-title"
                   value={cvTitle}
                   onChange={(e) => setCvTitle(e.target.value)}
                   placeholder="Ex: CV Développeur 2024"
                   className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                   autoFocus
                />
              </div>

              <Button 
                size="lg" 
                onClick={handleUseTemplate}
                disabled={isLoading || !cvTitle.trim()}
                className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-lg shadow-indigo-200 gap-2 h-14 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5 fill-current" />
                    Créer mon CV
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-slate-400">
                100% Gratuit • Pas de carte requise
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
