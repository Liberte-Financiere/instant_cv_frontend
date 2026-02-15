'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCVStore } from '@/store/useCVStore';
import { MatchResults, Reformulation } from '@/components/dashboard/ai/MatchResults';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MatchResultPage() {
  const router = useRouter();
  const { lastMatch, currentCV, loadCV, updateExperience, updatePersonalInfo, saveCurrentCV, cvList } = useCVStore();
  const [appliedIndexes, setAppliedIndexes] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!lastMatch) {
      console.warn('[MatchPage] No match data found, redirecting...');
      router.push('/dashboard/ai/match');
    }
  }, [lastMatch, router]);

  if (!lastMatch) return null;

  const { result, cvSourceMode, selectedCVId } = lastMatch;

  const handleApplyReformulation = async (reformulation: Reformulation, index: number) => {
    if (!currentCV || currentCV.id !== selectedCVId) {
      loadCV(selectedCVId);
    }

    const cv = cvList.find(c => c.id === selectedCVId);
    if (!cv) {
      toast.error('Impossible de modifier un CV importé par PDF. Appliquez manuellement.');
      return;
    }

    try {
      if (reformulation.section === 'experiences' && cv.experiences[reformulation.index]) {
        const exp = cv.experiences[reformulation.index];
        updateExperience(exp.id, { [reformulation.field]: reformulation.suggested });
      } else if (reformulation.section === 'personalInfo') {
        updatePersonalInfo({ [reformulation.field]: reformulation.suggested });
      }

      setAppliedIndexes(prev => new Set([...prev, index]));
      toast.success('Modification appliquée !');
      setTimeout(() => saveCurrentCV(), 500);
    } catch {
      toast.error('Erreur lors de l\'application');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-slate-500 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </Link>

        {/* Header removed as MatchResults might have its own or page title */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Résultats du Matching</h1>
            <p className="text-slate-500">Voici l'analyse de compatibilité entre votre CV et l'offre.</p>
        </div>

        <MatchResults
          result={result}
          appliedIndexes={appliedIndexes}
          onApplyReformulation={handleApplyReformulation}
          cvSourceMode={cvSourceMode}
          selectedCVId={selectedCVId}
        />
      </div>
    </div>
  );
}
