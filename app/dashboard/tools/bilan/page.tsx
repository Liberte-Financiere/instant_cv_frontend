'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  ArrowLeft, 
  Loader2, 
  Target, 
  Briefcase, 
  GraduationCap, 
  AlertCircle, 
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Compass,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCreditStore } from '@/store/useCreditStore';
import { Button } from '@/components/ui/Button';
import { CREDIT_COSTS } from '@/lib/credit-costs';
import { useCVStore } from '@/store/useCVStore';
import { CvSelectionSection } from '@/components/dashboard/ai/CvSelectionSection';
import { HistoryList } from '@/components/dashboard/ai/HistoryList';
import { toast } from 'sonner';

export default function BilanDeCompetencesPage() {
  const { cvList, fetchUserCVs, lastBilan, setBilanData } = useCVStore();
  
  const [cvSourceMode, setCvSourceMode] = useState<'select' | 'upload'>('select');
  const [selectedCVId, setSelectedCVId] = useState<string>('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { credits, fetchCredits } = useCreditStore();
  const cost = CREDIT_COSTS.AI_BILAN;

  // Set default selected CV when list loads
  useEffect(() => {
    if (cvList.length > 0 && !selectedCVId) {
      setSelectedCVId(cvList[0].id);
    }
  }, [cvList, selectedCVId]);

  useEffect(() => {
    fetchCredits();
    fetchUserCVs();
  }, [fetchCredits, fetchUserCVs]);

  const handleFileSelected = (file: File) => {
    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      toast.error('Formats acceptés : PDF ou TXT');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 5 Mo)');
      return;
    }
    setCvFile(file);
    toast.success(`Fichier importé : ${file.name}`);
  };

  const isReady = cvSourceMode === 'select' ? !!selectedCVId : !!cvFile;

  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Lecture et extraction des données du CV...",
    "Analyse approfondie de votre parcours...",
    "Identification de vos forces et axes d'amélioration...",
    "Recherche des carrières les plus compatibles...",
    "Sélection des meilleures formations...",
    "Finalisation de votre bilan personnalisé..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 2500); // Change message every 2.5s
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!isReady) return;

    if (credits < cost) {
      setError(`Crédits insuffisants. Il vous faut ${cost} crédits pour utiliser cet outil.`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setBilanData(null);

    try {
      const formData = new FormData();
      formData.append('cvSourceMode', cvSourceMode);

      if (cvSourceMode === 'select') {
        formData.append('cvId', selectedCVId);
      } else if (cvSourceMode === 'upload' && cvFile) {
        formData.append('file', cvFile);
      }

      const res = await fetch('/api/ai/bilan', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 403) {
          setError('Crédits insuffisants pour cette action.');
          toast.error('Crédits insuffisants');
          return;
        }
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Erreur lors de la génération du Bilan.');
      }

      const data = await res.json();
      setBilanData(data);
      fetchCredits();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'analyse.');
      toast.error(err.message || 'Une erreur est survenue.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            href="/dashboard/tools" 
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la Boîte à Outils
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bilan de Compétences</h1>
              <p className="text-slate-500 mt-1 max-w-xl">Analysez votre parcours pour identifier vos forces, découvrir les métiers adaptés et obtenir des recommandations de formations.</p>
            </div>
          </div>
        </div>
        
        {lastBilan && !isGenerating && (
          <Button 
            onClick={() => setBilanData(null)} 
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            Nouveau Bilan
          </Button>
        )}
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </motion.div>
      )}

      {/* Step 1: Selection Form */}
      {!lastBilan && !isGenerating && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Source de l'analyse</h2>
            
            <CvSelectionSection
              cvSourceMode={cvSourceMode}
              setCvSourceMode={setCvSourceMode}
              selectedCVId={selectedCVId}
              setSelectedCVId={setSelectedCVId}
              cvList={cvList}
              cvFile={cvFile}
              onFileSelected={handleFileSelected}
              acceptedFileTypes=".pdf,.txt"
              label=""
              stepNumber={1}
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-sm font-medium text-slate-700 block mb-1">Coût de l'analyse</span>
                <span className="text-sm font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {cost} crédits
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-sm text-slate-500 block mb-1">Votre solde</span>
                <span className={`text-sm font-semibold ${credits >= cost ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {credits} crédits
                </span>
              </div>
            </div>
            
            <Button 
              onClick={handleGenerate}
              disabled={!isReady || credits < cost}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-sm disabled:opacity-50 disabled:shadow-none transition-colors"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Lancer mon Bilan de Compétences
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Loading State with Loggers */}
      {isGenerating && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Création de votre Bilan...</h3>
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-slate-500 font-medium"
              >
                {loadingMessages[loadingStep]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Step 3: Results Grid */}
      {lastBilan && !isGenerating && (
        <AnimatePresence mode="wait">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* 1. Forces & Axes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Forces */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Forces Clés</h3>
                </div>
                <ul className="space-y-3.5">
                  {lastBilan.strengths?.map((strength: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Axes d'amélioration */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Axes de Développement</h3>
                </div>
                <ul className="space-y-3.5">
                  {lastBilan.areasForImprovement?.map((area: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 2. Compatible Careers */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-cyan-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Carrières Compatibles</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lastBilan.compatibleCareers?.map((career: any, i: number) => (
                  <div key={i} className="p-5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-200 transition-all duration-200">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{career.title}</h4>
                      <span className="shrink-0 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-100 shadow-sm">
                        {career.matchPercentage}% match
                      </span>
                    </div>
                    
                    {/* Progress bar matching */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${career.matchPercentage}%` }}
                      />
                    </div>
                    
                    <p className="text-xs text-slate-500 leading-relaxed">{career.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Formations Recommandées */}
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Formations & Certifications Recommandées</h3>
              </div>

              <div className="space-y-4">
                {lastBilan.recommendedTrainings?.map((training: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                      <GraduationCap className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-0.5">
                      <h4 className="font-bold text-slate-900 text-[15px]">{training.title}</h4>
                      <div>
                        <span className="inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                          {training.type}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-500 leading-relaxed mt-2">{training.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-[11px] text-slate-400 mt-6 pt-5 border-t border-slate-100">
                Ces suggestions de formations sont indicatives. Nous vous recommandons de vérifier leur disponibilité et leur contenu directement sur les plateformes mentionnées.
              </p>
            </div>

            {/* Global disclaimer */}
            <p className="text-xs text-slate-400 text-center pt-2">
              Ce bilan est généré par intelligence artificielle à titre indicatif. Les scores de compatibilité et recommandations ne constituent pas un avis professionnel certifié.
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {!lastBilan && !isGenerating && (
        <div className="mt-12">
          <HistoryList type="bilan" />
        </div>
      )}
    </div>
  );
}
