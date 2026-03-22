'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCVStore } from '@/store/useCVStore';
import { Languages, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TRANSLATION_OPTIONS = [
  { value: 'en', label: 'Anglais (EN)' },
  { value: 'fr', label: 'Français (FR)' },
  { value: 'zh', label: 'Chinois (ZH)' },
] as const;

export function TranslateCVButton() {
  const router = useRouter();
  const { currentCV, translateCV } = useCVStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTranslate = async (targetLanguage: 'en' | 'fr' | 'zh') => {
    if (!currentCV) return;
    
    setIsOpen(false);
    setIsTranslating(true);
    
    // Suggest the user what is happening
    const toastId = toast.loading('Traduction complète en cours... Cela peut prendre 5 à 10 secondes.', {
      duration: 15000,
    });

    try {
      const newCvId = await translateCV(currentCV.id, targetLanguage);
      
      if (newCvId) {
        toast.dismiss(toastId);
        // Redirection vers le nouveau CV traduit
        router.push(`/editor/${newCvId}`);
      } else {
        toast.dismiss(toastId);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Une erreur est survenue lors de la traduction.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating || !currentCV}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors border ${
          isTranslating 
            ? 'bg-amber-50 text-amber-600 border-amber-200 cursor-wait' 
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
        }`}
        title="Traduire le CV (15 crédits)"
      >
        {isTranslating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Languages className="w-4 h-4 text-amber-500" />
        )}
        <span className="hidden sm:inline">
          {isTranslating ? 'Traduction...' : 'Traduire'}
        </span>
        {!isTranslating && <ChevronDown className="w-3 h-3 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cible de traduction</p>
             <p className="text-[10px] text-slate-400 mt-0.5">Note: Crée une copie (15 crédits)</p>
          </div>
          {TRANSLATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleTranslate(opt.value)}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors flex items-center gap-2"
            >
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
