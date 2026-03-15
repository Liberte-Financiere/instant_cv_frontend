'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, ArrowLeft, Upload, FileText } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { toast } from 'sonner';
import Link from 'next/link';

import { CvSelectionSection } from '@/components/dashboard/ai/CvSelectionSection';
import { HistoryList } from '@/components/dashboard/ai/HistoryList';

type CVSourceMode = 'select' | 'upload';

export default function AIAnalyzePage() {
  const router = useRouter();
  const { cvList, fetchUserCVs, setAnalysisData, addToHistory } = useCVStore();
  
  const [cvSourceMode, setCvSourceMode] = useState<CVSourceMode>('select');
  const [selectedCVId, setSelectedCVId] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => { fetchUserCVs(); }, [fetchUserCVs]);

  const isReady = cvSourceMode === 'select' ? !!selectedCVId : !!cvFile;

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

  const handleAnalyze = async () => {
    if (!isReady) return;

    setIsAnalyzing(true);

    try {
      let response: Response;

      if (cvSourceMode === 'select') {
        // Send CV data as JSON
        const cv = cvList.find(c => c.id === selectedCVId);
        if (!cv) throw new Error('CV non trouvé');

        response = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cvData: cv }),
        });
      } else {
        // Send file as FormData
        const formData = new FormData();
        formData.append('file', cvFile!);

        response = await fetch('/api/ai/analyze', {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        if (response.status === 403) {
          const { useCreditStore } = await import('@/store/useCreditStore');
          useCreditStore.getState().setOutOfCreditsModalOpen(true);
          return;
        }
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Erreur lors de l\'analyse');
      }

      const data = await response.json();
      setAnalysisData(data);
      
      // Save to history
      addToHistory({
        id: crypto.randomUUID(),
        type: 'analysis',
        date: new Date().toISOString(),
        score: data.analysis.globalScore,
        title: `Analyse CV - ${new Date().toLocaleDateString()}`,
        data: data
      });

      toast.success('Analyse terminée !');
      router.push('/analysis');
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Analyser mon CV</h1>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              Notre IA vous donnera un score détaillé, des forces, des faiblesses et des recommandations personnalisées.
            </p>
          </div>

          <CvSelectionSection
            cvSourceMode={cvSourceMode}
            setCvSourceMode={setCvSourceMode}
            selectedCVId={selectedCVId}
            setSelectedCVId={setSelectedCVId}
            cvList={cvList}
            cvFile={cvFile}
            onFileSelected={handleFileSelected}
            acceptedFileTypes=".pdf,.txt"
            label="Source du CV"
            stepNumber={0} // No step number needed here
          />

          {/* Analyze Button */}
          <div className="mt-8 flex justify-center">
            <div className="relative group/btn inline-block">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !isReady}
                className="flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyse en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Analyser mon CV</span>
                  </>
                )}
              </button>

              {/* Tooltip explaining why it's disabled */}
              {!isReady && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all whitespace-nowrap shadow-lg z-20">
                  Veuillez sélectionner ou importer un CV
                  {/* Petit triangle (flèche) vers le bas */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

      <div className="mt-12">
        <HistoryList type="analysis" />
      </div>
    </div>
  );
}

