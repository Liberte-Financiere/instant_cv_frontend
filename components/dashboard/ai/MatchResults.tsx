'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw, ArrowRight, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCVStore } from '@/store/useCVStore'; // We need store access for loadCV

// Duplicate interfaces if they are not in a shared type file, or export them from page
// Ideally move these to types/ai.ts
export interface Reformulation {
  section: string;
  index: number;
  field: string;
  original: string;
  suggested: string;
  reason: string;
}

export interface MatchResultData {
  compatibilityScore: number;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  reformulations: Reformulation[];
  highlights: string[];
}

interface MatchResultsProps {
  result: MatchResultData;
  appliedIndexes: Set<number>;
  onApplyReformulation: (reformulation: Reformulation, index: number) => void;
  cvSourceMode: 'select' | 'upload';
  selectedCVId: string;
}

export function MatchResults({
  result,
  appliedIndexes,
  onApplyReformulation,
  cvSourceMode,
  selectedCVId
}: MatchResultsProps) {
  const router = useRouter();
  const { loadCV } = useCVStore();

  const scoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Score Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative w-32 h-32 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="42" fill="none" 
                className={`stroke-current ${scoreColor(result.compatibilityScore)}`}
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={`${(result.compatibilityScore / 100) * 264} 264`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${scoreColor(result.compatibilityScore)}`}>
                {result.compatibilityScore}%
              </span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Score de compatibilité</h2>
            <p className="text-slate-600 leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Compétences matchées ({result.matchedSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matchedSkills.length > 0 ? result.matchedSkills.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-100">
                {skill}
              </span>
            )) : <p className="text-sm text-slate-400">Aucune compétence trouvée</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Compétences manquantes ({result.missingSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missingSkills.length > 0 ? result.missingSkills.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-full border border-red-100">
                {skill}
              </span>
            )) : <p className="text-sm text-slate-400">Aucune compétence manquante !</p>}
          </div>
        </div>
      </div>

      {/* Reformulations */}
      {result.reformulations?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-500" />
            Reformulations suggérées ({result.reformulations.length})
          </h3>
          <div className="space-y-4">
            {result.reformulations.map((ref, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "border rounded-xl p-4 transition-colors",
                  appliedIndexes.has(i) ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200"
                )}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">
                    {ref.section} • {ref.field}
                  </span>
                  {appliedIndexes.has(i) ? (
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Appliqué
                    </span>
                  ) : cvSourceMode === 'select' ? (
                    <button
                      onClick={() => onApplyReformulation(ref, i)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg shrink-0 font-medium flex items-center gap-1 transition-colors"
                    >
                      Appliquer
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
                    <p className="text-xs font-medium text-red-500 mb-1">Actuel</p>
                    <p className="text-sm text-slate-700">{ref.original}</p>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
                    <p className="text-xs font-medium text-emerald-600 mb-1">Suggestion</p>
                    <p className="text-sm text-slate-700">{ref.suggested}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2 italic">{ref.reason}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Highlights */}
      {result.highlights?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Recommandations
          </h3>
          <ul className="space-y-3">
            {result.highlights.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      {cvSourceMode === 'select' && selectedCVId && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Modifier votre CV ?</h3>
            <p className="text-blue-100 text-sm">Ouvrez l&apos;éditeur pour appliquer ces recommandations.</p>
          </div>
          <button
            onClick={() => { loadCV(selectedCVId); router.push(`/editor/${selectedCVId}`); }}
            className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl shadow-lg transition-colors flex items-center gap-2"
          >
            Ouvrir dans l&apos;éditeur
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
