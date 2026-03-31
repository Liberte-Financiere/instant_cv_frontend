'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Clock,
  Award,
  Mic,
  Keyboard,
  Trash2,
  ChevronRight,
  PlayCircle,
} from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { toast } from 'sonner';
import Link from 'next/link';

import { CvSelectionSection } from '@/components/dashboard/ai/CvSelectionSection';

type CVSourceMode = 'select' | 'upload';
type Step = 0 | 1 | 2;

interface HistorySession {
  id: string;
  jobTitle: string;
  status: string;
  totalScore: number | null;
  questionCount: number;
  format: string;
  createdAt: string;
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function InterviewSetupPage() {
  const router = useRouter();
  const { cvList, fetchUserCVs, createImportedCV } = useCVStore();

  const [step, setStep] = useState<Step>(0);
  const [direction, setDirection] = useState(1);

  const [selectedCVId, setSelectedCVId] = useState('');
  const [cvSourceMode, setCvSourceMode] = useState<CVSourceMode>('select');
  const [jobTitle, setJobTitle] = useState('');
  const [jobContext, setJobContext] = useState('');
  const [format, setFormat] = useState<'text' | 'audio'>('text');
  const [isStarting, setIsStarting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserCVs();
    fetch('/api/ai/interview/history')
      .then((r) => (r.ok ? r.json() : []))
      .then(setHistory)
      .catch(() => {});
  }, [fetchUserCVs]);

  const goTo = (next: Step) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
       toast.error('Seuls les fichiers PDF sont acceptés.');
       return;
    }
    setIsUploading(true);
    setUploadedFile(file);
    try {
       const formData = new FormData();
       formData.append('file', file);
       const res = await fetch('/api/utils/parse-pdf', {
          method: 'POST',
          body: formData
       });
       if (!res.ok) throw new Error("Erreur de lecture du PDF");
       const { text } = await res.json();
       
       // Create a temporary local CV for the interview
       const newCvId = createImportedCV({
          title: `CV Importé - ${file.name}`,
          personalInfo: { summary: text, firstName: '', lastName: '', email: '', phone: '', address: '', title: '' }
       });
       
       setSelectedCVId(newCvId);
       setCvSourceMode('select');
       toast.success("PDF importé avec succès pour l'entretien !");
    } catch (error) {
       toast.error("Impossible de lire le contenu du PDF.");
       setUploadedFile(null);
    } finally {
       setIsUploading(false);
    }
  };

  const handleStart = async () => {
    if (!selectedCVId || !jobTitle.trim()) return;
    setIsStarting(true);

    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvId: selectedCVId, jobTitle, jobContext, format }),
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

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Supprimer cet entretien ? Cette action est irréversible.')) return;
    setIsDeletingId(sessionId);
    try {
      const res = await fetch(`/api/ai/interview/${sessionId}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory((prev) => prev.filter((s) => s.id !== sessionId));
      } else {
        toast.error('Impossible de supprimer cet entretien.');
      }
    } catch {
      toast.error('Erreur réseau.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const isStep1Ready = !!selectedCVId && !!jobTitle.trim();

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">

      {/* Step indicator (only shown during wizard steps) */}
      {step > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= s ? 'w-8 bg-indigo-600' : 'w-4 bg-slate-200'
              }`}
            />
          ))}
        </motion.div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {/* ─── STEP 0: Hub ─── */}
        {step === 0 && (
          <motion.div
            key="step-0"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            {/* Hero */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Simulateur d&apos;entretien</h1>
              <p className="text-slate-500 max-w-md mx-auto text-sm mb-8 leading-relaxed">
                Entrainez-vous avec un recruteur IA qui pose des questions adaptées à votre profil et au poste visé. Recevez un feedback détaillé après chaque réponse.
              </p>

              <button
                onClick={() => goTo(1)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98]"
              >
                <PlayCircle className="w-5 h-5" />
                Démarrer un entretien
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Quick stats */}
              {history.length > 0 && (
                <p className="mt-5 text-xs text-slate-400">
                  {history.length} entretien{history.length > 1 ? 's' : ''} dans votre historique
                </p>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Entretiens précédents</h2>
                  {history.length > 3 && (
                    <Link
                      href="/dashboard/ai/interview/history"
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Voir tout l'historique →
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.slice(0, 3).map((s) => (
                    <div key={s.id} className="relative group/card">
                      <Link
                        href={`/interview/${s.id}`}
                        className="block bg-white rounded-xl p-4 pr-12 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
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
                            {new Date(s.createdAt).toLocaleString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {s.totalScore !== null && (
                            <span className="flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {s.totalScore}/100
                            </span>
                          )}
                          {s.format !== 'audio' && <span>{s.questionCount} questions</span>}
                        </div>
                      </Link>
                      <button
                        onClick={(e) => handleDelete(e, s.id)}
                        disabled={isDeletingId === s.id}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all disabled:opacity-50"
                        title="Supprimer"
                      >
                        {isDeletingId === s.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── STEP 1: Context ─── */}
        {step === 1 && (
          <motion.div
            key="step-1"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Contexte de l&apos;entretien</h2>
              <p className="text-sm text-slate-500">Renseignez votre profil et le poste visé pour des questions personnalisées.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CvSelectionSection
                cvSourceMode={cvSourceMode}
                setCvSourceMode={setCvSourceMode}
                selectedCVId={selectedCVId}
                setSelectedCVId={setSelectedCVId}
                cvList={cvList}
                cvFile={uploadedFile}
                onFileSelected={handleFileUpload}
                label="Votre CV"
                stepNumber={1}
              />

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
                      Description de l&apos;offre <span className="text-slate-400 font-normal">(optionnel)</span>
                    </label>
                    <textarea
                      value={jobContext}
                      onChange={(e) => setJobContext(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Collez la description de l'offre pour des questions plus ciblées..."
                    />
                    {!jobContext.trim() && (
                      <p className="mt-1.5 text-xs text-indigo-500 leading-relaxed">
                        💡 Coller la fiche de poste améliore significativement la qualité et la précision des questions.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={() => goTo(0)}
                className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>

              <div className="relative group/btn">
                <button
                  onClick={() => isStep1Ready && goTo(2)}
                  disabled={!isStep1Ready}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all active:scale-[0.98]"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </button>
                {!isStep1Ready && (
                  <div className="absolute -top-10 right-0 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all whitespace-nowrap shadow-lg z-20">
                    {!selectedCVId ? 'Sélectionnez un CV' : 'Indiquez le poste visé'}
                    <div className="absolute top-full right-4 border-4 border-transparent border-t-slate-800" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 2: Mode Selection ─── */}
        {step === 2 && (
          <motion.div
            key="step-2"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
          >
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Choisissez votre format</h2>
              <p className="text-sm text-slate-500">
                Comment souhaitez-vous interagir avec le recruteur IA ?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {/* Text Mode */}
              <button
                onClick={() => setFormat('text')}
                className={`relative flex flex-col items-start gap-4 p-6 rounded-2xl border-2 text-left transition-all ${
                  format === 'text'
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-100'
                    : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  format === 'text' ? 'bg-indigo-600' : 'bg-slate-100'
                }`}>
                  <Keyboard className={`w-7 h-7 ${format === 'text' ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5 text-base">Mode Écrit</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    L&apos;IA pose les questions par écrit. Prenez votre temps pour rédiger vos réponses et recevez un feedback structuré après chaque interaction.
                  </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700">
                    5 crédits (forfait)
                  </span>
                </div>
                {format === 'text' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </button>

              {/* Audio Mode */}
              <button
                onClick={() => setFormat('audio')}
                className={`relative flex flex-col items-start gap-4 p-6 rounded-2xl border-2 text-left transition-all ${
                  format === 'audio'
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-100'
                    : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  format === 'audio' ? 'bg-indigo-600' : 'bg-slate-100'
                }`}>
                  <Mic className={`w-7 h-7 ${format === 'audio' ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5 text-base">Mode Audio Live</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    Appel vocal en conditions réelles. L&apos;IA réagit à votre voix instantanément — idéal pour s&apos;entraîner à l&apos;oral en visio ou téléphone.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-700">
                      1 crédit / minute
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">BETA</span>
                  </div>
                </div>
                {format === 'audio' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100 max-w-2xl mx-auto">
              <button
                onClick={() => goTo(1)}
                className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>

              <button
                onClick={handleStart}
                disabled={isStarting}
                className="flex items-center gap-3 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Préparation...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    Commencer l&apos;entretien
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
