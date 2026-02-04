"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCVStore } from "@/store/useCVStore";
import { ScoreGauge } from "@/components/analysis/ScoreGauge";
import { SectionAuditCard } from "@/components/analysis/SectionAuditCard";
import { RecommendedJobs } from "@/components/analysis/RecommendedJobs";
import { ArrowLeft, Sparkles, Download, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AnalysisResultPage() {
  const router = useRouter();
  const { lastAnalysis, createImportedCV } = useCVStore();

  useEffect(() => {
    console.log('[AnalysisPage] lastAnalysis state:', lastAnalysis);
    if (!lastAnalysis) {
      console.warn('[AnalysisPage] No analysis found, redirecting...');
      router.push("/dashboard");
    }
  }, [lastAnalysis, router]);

  if (!lastAnalysis) return null;

  const { analysis, cvData } = lastAnalysis;

  const handleImport = () => {
    try {
      const cvId = createImportedCV(cvData);
      toast.success("CV créé avec succès !");
      router.push(`/editor/${cvId}`);
    } catch (e) {
      toast.error("Erreur lors de la création du CV");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Navigation */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-slate-500 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Main Score Card - Spans 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
             <ScoreGauge score={analysis.globalScore} />
             
             <div className="flex-1">
               <h1 className="text-2xl font-bold text-slate-800 mb-2">
                 Analyse Globale
               </h1>
               <p className="text-slate-600 mb-4 leading-relaxed">
                 {analysis.globalReview}
               </p>
               
               {/* Keywords */}
               <div className="flex flex-wrap gap-2 mt-4">
                 {analysis.detectedKeywords.map((kw, i) => (
                   <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100">
                     {kw}
                   </span>
                 ))}
               </div>
             </div>
          </div>

          {/* Right Column - Job Recommendations */}
          <div className="lg:col-span-1">
            <RecommendedJobs jobs={analysis.recommendedPositions} />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 bg-indigo-600 rounded-xl p-6 shadow-lg text-white">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Prêt à transformer ce profil ?
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              Importez ces données directement dans notre éditeur de CV.
            </p>
          </div>
          <button
            onClick={handleImport}
            className="mt-4 sm:mt-0 bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-bold shadow-md transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Créer mon CV maintenant
          </button>
        </div>

        {/* Detailed Sections Audit */}
        <h2 className="text-xl font-bold text-slate-800 mb-6">Détail par Section</h2>
        
        <SectionAuditCard title="Structure & Lisibilité" audit={analysis.sections.structure} />
        <SectionAuditCard title="Expérience Professionnelle" audit={analysis.sections.experience} />
        <SectionAuditCard title="Formation" audit={analysis.sections.education} />
        <SectionAuditCard title="Compétences" audit={analysis.sections.skills} />

      </div>
    </div>
  );
}
