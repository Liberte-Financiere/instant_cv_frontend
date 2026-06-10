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
    // 1. Ensure CV is loaded and await it
    if (!currentCV || currentCV.id !== selectedCVId) {
      await loadCV(selectedCVId);
    }

    // 2. Fetch the fresh currentCV from the store state (since the local const might be stale)
    const activeCV = useCVStore.getState().currentCV;
    
    if (!activeCV || activeCV.id !== selectedCVId) {
      toast.error('Impossible de modifier un CV importé par PDF. Appliquez manuellement.');
      return;
    }

    try {
      // 3. Handle all possible sections
      const { section, field, suggested, index: itemIndex } = reformulation;

      if (section === 'experiences' && activeCV.experiences?.[itemIndex]) {
        const exp = activeCV.experiences[itemIndex];
        updateExperience(exp.id, { [field]: suggested });
      } 
      else if (section === 'education' && activeCV.education?.[itemIndex]) {
        const edu = activeCV.education[itemIndex];
        // We use getState to call updateEducation since it might not be in the destructured hook
        useCVStore.getState().updateEducation(edu.id, { [field]: suggested });
      }
      else if (section === 'skills' && activeCV.skills?.[itemIndex]) {
        const skill = activeCV.skills[itemIndex];
        useCVStore.getState().updateSkill(skill.id, { [field]: suggested });
      }
      else if (section === 'projects' && activeCV.projects?.[itemIndex]) {
        const project = activeCV.projects[itemIndex];
        useCVStore.getState().updateProject(project.id, { [field]: suggested });
      }
      else if (section === 'certifications' && activeCV.certifications?.[itemIndex]) {
        const cert = activeCV.certifications[itemIndex];
        useCVStore.getState().updateCertification(cert.id, { [field]: suggested });
      }
      else if (section === 'personalInfo') {
        updatePersonalInfo({ [field]: suggested });
      } 
      else {
        toast.error(`Section "${section}" non supportée ou élément introuvable.`);
        return;
      }

      setAppliedIndexes(prev => new Set([...prev, index]));
      toast.success('Modification appliquée !');
      
      // Save changes to DB
      setTimeout(() => useCVStore.getState().saveCurrentCV(), 500);
    } catch (e) {
      console.error(e);
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
