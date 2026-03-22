'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { CvSelectionSection } from '@/components/dashboard/ai/CvSelectionSection';
import { JobOfferSection } from '@/components/dashboard/ai/JobOfferSection';
import { HistoryList } from '@/components/dashboard/ai/HistoryList';
import { MatchResults, MatchResultData, Reformulation } from '@/components/dashboard/ai/MatchResults';

type CVSourceMode = 'select' | 'upload';
type JobSourceMode = 'text' | 'pdf';

export default function AIMatchPage() {
  const router = useRouter();
  const { cvList, fetchUserCVs, loadCV, currentCV, updateExperience, updatePersonalInfo, saveCurrentCV } = useCVStore();
  
  // CV Source
  const [cvSourceMode, setCvSourceMode] = useState<CVSourceMode>('select');
  const [selectedCVId, setSelectedCVId] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Job Source
  const [jobSourceMode, setJobSourceMode] = useState<JobSourceMode>('text');
  const [jobDescription, setJobDescription] = useState('');
  const [jobFile, setJobFile] = useState<File | null>(null);

  // State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { setMatchData, addToHistory } = useCVStore(); // Get action from store

  useEffect(() => { fetchUserCVs(); }, [fetchUserCVs]);

  const selectedCV = cvList.find(c => c.id === selectedCVId);

  const isCVReady = cvSourceMode === 'select' ? !!selectedCVId : !!cvFile;
  const isJobReady = jobSourceMode === 'text' ? !!jobDescription.trim() : !!jobFile;

  const handleCvFileSelected = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptés.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 5 Mo)');
      return;
    }
    setCvFile(file);
    toast.success(`CV importé : ${file.name}`);
  };

  const handleJobFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptés.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 5 Mo)');
      e.target.value = '';
      return;
    }
    setJobFile(file);
    toast.success(`Offre importée : ${file.name}`);
  };

  const handleAnalyze = async () => {
    if (!isCVReady || !isJobReady) {
      toast.error('Remplissez tous les champs');
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();

      // CV Source
      if (cvSourceMode === 'select') {
        // Fetch full CV data (cvList only contains summaries without experiences, skills, etc.)
        const { CVService } = await import('@/services/cvService');
        const fullCV = await CVService.getById(selectedCVId);
        if (!fullCV) throw new Error('CV non trouvé');
        formData.append('cvData', JSON.stringify(fullCV));
      } else if (cvFile) {
        formData.append('cvFile', cvFile);
      }

      // Job Source
      if (jobSourceMode === 'text') {
        formData.append('jobDescription', jobDescription);
      } else if (jobFile) {
        formData.append('jobFile', jobFile);
      }

      const res = await fetch('/api/ai/match', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 403) {
          const { useCreditStore } = await import('@/store/useCreditStore');
          useCreditStore.getState().setOutOfCreditsModalOpen(true);
          return;
        }
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erreur lors de l\'analyse');
      }

      const data: MatchResultData = await res.json();
      
      // Save to store
      setMatchData({
        result: data,
        cvSourceMode,
        selectedCVId
      });

      // Save to history
      addToHistory({
        id: crypto.randomUUID(),
        type: 'match',
        date: new Date().toISOString(),
        score: data.compatibilityScore,
        title: `Match vs Offre - ${new Date().toLocaleDateString()}`,
        data: { result: data, cvSourceMode, selectedCVId }
      });
      
      toast.success('Analyse terminée !');
      router.push('/match');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    
     <div className="p-4 lg:p-8 max-w-7xl mx-auto">
     {/* <Link 
        href="/dashboard"
        className="inline-flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour au tableau de bord
      </Link> */}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Matcher une offre</h1>
            <p className="text-slate-500 text-sm">Analysez la compatibilité de votre CV avec une offre d&apos;emploi</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CvSelectionSection
            cvSourceMode={cvSourceMode}
            setCvSourceMode={setCvSourceMode}
            selectedCVId={selectedCVId}
            setSelectedCVId={setSelectedCVId}
            cvList={cvList}
            cvFile={cvFile}
            onFileSelected={handleCvFileSelected}
          />

          <JobOfferSection
            jobSourceMode={jobSourceMode}
            setJobSourceMode={setJobSourceMode}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            jobFile={jobFile}
            onJobFileChange={handleJobFileChange}
          />
        </div>

        {/* Analyze Button */}
        <div className="mt-8 flex justify-center">
            <div className="relative group/btn inline-block">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !isCVReady || !isJobReady}
                className="relative flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all active:scale-[0.98] overflow-hidden"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyse en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Analyser la compatibilité</span>
                  </>
                )}
              </button>

              {/* Tooltip explaining why it's disabled */}
              {(!isCVReady || !isJobReady) && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all whitespace-nowrap shadow-lg z-20">
                  {!isCVReady && !isJobReady 
                    ? "Veuillez sélectionner un CV et une offre"
                    : !isCVReady 
                      ? "Veuillez sélectionner ou importer un CV"
                      : "Veuillez ajouter la description de l'offre"
                  }
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </div>
              )}
            </div>
        </div>
      </motion.div>

      <div className="mt-12">
        <HistoryList type="match" /> 
      </div>
    </div>
    
  );
}
