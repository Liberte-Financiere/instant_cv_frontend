'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, Loader2, ArrowLeft, Briefcase, Clock, Award } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { toast } from 'sonner';
import Link from 'next/link';

import { CvSelectionSection } from '@/components/dashboard/ai/CvSelectionSection';

type CVSourceMode = 'select' | 'upload';

interface HistorySession {
  id: string;
  jobTitle: string;
  status: string;
  totalScore: number | null;
  questionCount: number;
  createdAt: string;
}

export default function InterviewSetupPage() {
  const router = useRouter();
  const { cvList, fetchUserCVs } = useCVStore();

  const [selectedCVId, setSelectedCVId] = useState('');
  const [cvSourceMode, setCvSourceMode] = useState<CVSourceMode>('select');
  const [jobTitle, setJobTitle] = useState('');
  const [jobContext, setJobContext] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [history, setHistory] = useState<HistorySession[]>([]);

  useEffect(() => {
    fetchUserCVs();
    fetch('/api/ai/interview/history')
      .then((r) => (r.ok ? r.json() : []))
      .then(setHistory)
      .catch(() => {});
  }, [fetchUserCVs]);

  const handleStart = async () => {
    if (!selectedCVId || !jobTitle.trim()) return;
    setIsStarting(true);

    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvId: selectedCVId, jobTitle, jobContext }),
      });

      if (!res.ok) {
        if (res.status === 403) {
          const { useCreditStore } = await import('@/store/useCreditStore');
          useCreditStore.getState().setOutOfCreditsModalOpen(true);
          return;
        }
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erreur');
      }

      const data = await res.json();
      router.push(`/interview/${data.sessionId}`);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du démarrage');
    } finally {
      setIsStarting(false);
    }
  };

  const isReady = !!selectedCVId && !!jobTitle.trim();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Simulateur d&apos;entretien</h1>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            Entrainez-vous avec un recruteur IA qui pose des questions adaptées à votre profil et au poste visé.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CV Selection */}
          <CvSelectionSection
            cvSourceMode={cvSourceMode}
            setCvSourceMode={setCvSourceMode}
            selectedCVId={selectedCVId}
            setSelectedCVId={setSelectedCVId}
            cvList={cvList}
            cvFile={null}
            onFileSelected={() => {}}
            label="Votre CV"
            stepNumber={1}
          />

          {/* Job Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Poste visé
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Titre du poste
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ex: Développeur Full Stack, Chef de projet..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Contexte de l&apos;offre <span className="text-slate-400 font-normal">(optionnel)</span>
                </label>
                <textarea
                  value={jobContext}
                  onChange={(e) => setJobContext(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Collez la description de l'offre pour des questions plus ciblées..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-8 flex justify-center">
          <div className="relative group/btn inline-block">
            <button
              onClick={handleStart}
              disabled={isStarting || !isReady}
              className="flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all active:scale-[0.98]"
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Préparation...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  <span>Commencer l&apos;entretien</span>
                </>
              )}
            </button>

            {!isReady && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all whitespace-nowrap shadow-lg z-20">
                {!selectedCVId ? 'Sélectionnez un CV' : 'Indiquez le poste visé'}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8"
        >
          <h2 className="text-lg font-bold text-slate-800 mb-4">Entretiens précédents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((s) => (
              <Link
                key={s.id}
                href={`/interview/${s.id}`}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {s.jobTitle}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    s.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {s.status === 'completed' ? 'Terminé' : 'En cours'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                  {s.totalScore !== null && (
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {s.totalScore}/100
                    </span>
                  )}
                  <span>{s.questionCount} questions</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
