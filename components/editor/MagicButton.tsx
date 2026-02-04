'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Wand2, Loader2, Check, ArrowRight, Languages, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MagicButtonProps {
  section: string; // Context (ex: "Experience", "Summary")
  currentText: string;
  onApply: (newText: string) => void;
  className?: string;
  compact?: boolean;
}

type AIOption = 'fix' | 'improve' | 'expand' | 'translate';

export function MagicButton({ section, currentText, onApply, className = '', compact = false }: MagicButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      
      // Basic positioning: Below the button, aligned to the right (or left if space is tight)
      // Check if near right edge
      const isNearRightEdge = rect.right > window.innerWidth - 340; // 340px width approx
      
      setMenuPosition({
        top: rect.bottom + 8, // 8px gap
        left: isNearRightEdge ? rect.right - 320 : rect.left, // Align right if near edge, else left
      });
    }
  }, [isOpen]);

  // Handle scroll/resize to close menu (simpler than re-positioning dynamically)
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen]);

  // Close when clicking outside (Modified for Portal)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Logic: if click is NOT on button AND NOT inside the portal menu (we need a ref for the menu? actually fixed div catches it?)
      // Since portal is elsewhere, basic click outside button usually works if we stop propagation on menu click?
      // Or we check if target is inside the menu element.
      // Easiest is to attach a click listener to text generation OR a backdrop.
      // But standard "click outside" needs a Ref on the portal content.
      
      // For simplicity in this interaction: rely on a transparent backdrop or specific check.
      // Let's use a dataset attribute or ID to identify the menu.
      const target = event.target as HTMLElement;
      if (isOpen && !buttonRef.current?.contains(target as Node) && !target.closest('.magic-menu-portal')) {
        setIsOpen(false);
        setGeneratedText(null);
        setError(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleAIAction = async (type: AIOption) => {
    if (!currentText?.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setGeneratedText(null);

    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: currentText, 
          type,
          context: section 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate');
      }

      const data = await response.json();
      setGeneratedText(data.text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyChange = () => {
    if (generatedText) {
      onApply(generatedText);
      setIsOpen(false);
      setGeneratedText(null);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all
          ${isOpen 
            ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200' 
            : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm'
          }
        `}
        title="Assistant IA"
      >
        <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-100" />
        {!compact && <span className="text-xs font-bold font-sans">IA Magique</span>}
      </button>

      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{ 
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 9999
            }}
            className="magic-menu-portal w-80 bg-white rounded-xl shadow-2xl border border-indigo-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b border-indigo-100 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                Assistant Intelligent
              </span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-indigo-400 border border-indigo-100">
                Bêta
              </span>
            </div>

            <div className="p-2 max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="py-8 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 animate-pulse">L'IA réfléchit...</p>
                </div>
              ) : generatedText ? (
                // Preview State
                <div className="space-y-3 p-1">
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100/50">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {generatedText}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGeneratedText(null)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={applyChange}
                      className="flex-1 px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Appliquer
                    </button>
                  </div>
                </div>
              ) : (
                // Menu Options
                <div className="space-y-1">
                  <OptionButton 
                    icon={<Check className="w-4 h-4 text-green-500" />}
                    label="Corriger les fautes"
                    desc="Orthographe & Grammaire"
                    onClick={() => handleAIAction('fix')}
                    disabled={!currentText}
                  />
                  <OptionButton 
                    icon={<Sparkles className="w-4 h-4 text-amber-500" />}
                    label="Rendre plus pro"
                    desc="Ton formel & impactant"
                    onClick={() => handleAIAction('improve')}
                    disabled={!currentText}
                  />
                  <OptionButton 
                    icon={<AlignLeft className="w-4 h-4 text-blue-500" />}
                    label="Développer"
                    desc="Générer des bullet points"
                    onClick={() => handleAIAction('expand')}
                    disabled={!currentText}
                  />
                  <OptionButton 
                    icon={<Languages className="w-4 h-4 text-purple-500" />}
                    label="Traduire en Anglais"
                    desc="Traduction professionnelle"
                    onClick={() => handleAIAction('translate')}
                    disabled={!currentText}
                  />
                  
                  {error && (
                     <div className="mt-2 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100 text-center">
                        {error}
                     </div>
                  )}

                  {!currentText && (
                    <div className="px-2 py-1.5 text-center">
                       <p className="text-[10px] text-amber-600 font-medium">⚠️ Écrivez un peu de texte pour commencer.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

function OptionButton({ icon, label, desc, onClick, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left p-2.5 rounded-lg flex items-start gap-3 transition-colors
        ${disabled 
          ? 'opacity-50 cursor-not-allowed grayscale' 
          : 'hover:bg-slate-50 active:bg-slate-100'
        }
      `}
    >
      <div className={`mt-0.5 p-1.5 rounded-md bg-white border border-slate-100 shadow-sm ${disabled ? '' : 'group-hover:border-indigo-200'}`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-700">{label}</div>
        <div className="text-[10px] text-slate-400 font-medium">{desc}</div>
      </div>
      {!disabled && <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto mt-2" />}
    </button>
  );
}
