import { motion } from 'framer-motion';
import { X, Check, AlertCircle, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AnalysisResult {
  analysis: {
    score: number;
    review: string;
    strengths: string[];
    improvements: string[];
  };
  cvData: any; // The structured CV data for import
}

interface AnalysisResultModalProps {
  result: AnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}

export function AnalysisResultModal({ result, isOpen, onClose, onImport }: AnalysisResultModalProps) {
  if (!isOpen || !result) return null;

  const { score, review, strengths, improvements } = result.analysis;
  
  // Determine color based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (s >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
               <Sparkles className="w-6 h-6" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-900">Analyse de votre CV</h2>
               <p className="text-sm text-slate-500">Voici ce que l'IA pense de votre profil</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* Score Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className={`relative w-40 h-40 rounded-full border-8 flex items-center justify-center flex-col shadow-inner ${scoreColor.split(' ')[2]} ${scoreColor.split(' ')[1]}`}>
               <span className={`text-5xl font-bold ${scoreColor.split(' ')[0]}`}>{score}</span>
               <span className="text-xs font-medium text-slate-400 uppercase mt-1">sur 100</span>
            </div>
            <div className="flex-1 text-center md:text-left">
               <h3 className="text-lg font-bold text-slate-800 mb-2">Résumé Global</h3>
               <p className="text-slate-600 leading-relaxed text-lg italic">
                 &quot;{review}&quot;
               </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
               <div className="flex items-center gap-2 mb-4 text-green-700 font-bold">
                 <Check className="w-5 h-5" />
                 Points Forts
               </div>
               <ul className="space-y-3">
                 {strengths.map((str, i) => (
                   <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                     {str}
                   </li>
                 ))}
               </ul>
            </div>

            {/* Improvements */}
            <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
               <div className="flex items-center gap-2 mb-4 text-orange-700 font-bold">
                 <TrendingUp className="w-5 h-5" />
                 Pistes d'Amélioration
               </div>
               <ul className="space-y-3">
                 {improvements.map((imp, i) => (
                   <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                     <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                     {imp}
                   </li>
                 ))}
               </ul>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={onClose} className="text-slate-500">
            Ignorer
          </Button>
          <Button onClick={onImport} className="bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-lg shadow-purple-500/20 px-6">
            Importer et Améliorer ce CV
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
