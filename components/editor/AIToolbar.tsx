import { useState } from 'react';
import { Sparkles, CheckCheck, Languages, RefreshCw, Loader2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface AIToolbarProps {
  text: string;
  onRefine: (newText: string) => void;
  disabled?: boolean;
}

export function AIToolbar({ text, onRefine, disabled }: AIToolbarProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showRewriteMenu, setShowRewriteMenu] = useState(false);

  const handleAction = async (action: string, option?: string) => {
    if (!text || text.length < 10) {
      toast.error('Le texte est trop court pour être analysé.');
      return;
    }

    setIsLoading(action === 'rewrite' ? `rewrite-${option}` : action);
    setShowRewriteMenu(false);

    try {
      const res = await fetch('/api/ai/cover-letter/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, action, option }),
      });

      if (!res.ok) throw new Error('Erreur lors du traitement');
      
      const data = await res.json();
      if (data.result) {
        onRefine(data.result);
        toast.success('Texte amélioré avec succès !');
      }
    } catch (error) {
      toast.error('Une erreur est survenue.');
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2 custom-scrollbar">
      {/* Rewrite Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowRewriteMenu(!showRewriteMenu)}
          disabled={disabled || !!isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {isLoading?.startsWith('rewrite') ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Reformuler
          <ChevronDown className="w-3 h-3" />
        </button>

        <AnimatePresence>
          {showRewriteMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowRewriteMenu(false)} />
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-20 flex flex-col gap-0.5"
              >
                {[
                  { label: 'Professionnel', value: 'Professionnel' },
                  { label: 'Concis', value: 'Concis' },
                  { label: 'Percutant', value: 'Percutant' },
                  { label: 'Enthousiaste', value: 'Enthousiaste' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAction('rewrite', opt.value)}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                     <Sparkles className="w-3 h-3 text-blue-400" />
                     {opt.label}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Correct */}
      <button
        onClick={() => handleAction('correct')}
        disabled={disabled || !!isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {isLoading === 'correct' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
        Corriger
      </button>

      {/* Translate */}
      <button
        onClick={() => handleAction('translate', 'en')}
        disabled={disabled || !!isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {isLoading === 'translate' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
        Traduire (EN)
      </button>
    </div>
  );
}
