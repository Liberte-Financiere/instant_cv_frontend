'use client';

import { motion } from 'framer-motion';
import {Plus, FileText, Download, Search, ArrowLeft, ArrowRight, Edit, Building2, Wand2} from 'lucide-react';
import Link from 'next/link';
import { useCVStore } from '@/store/useCVStore';
import { useState, useEffect } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { CVCard } from '@/components/dashboard/CVCard';
import { TemplateSelector } from '@/components/dashboard/TemplateSelector';
import { TemplateId } from '@/types/cv';
import { Pagination } from '@/components/ui/Pagination';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useCoverLetterStore } from '@/store/useCoverLetterStore';
import { CoverLetterService } from '@/services/coverLetterService';
import { ReferralCodeCard } from '@/components/dashboard/ReferralCodeCard';
import { ReferralProcessor } from '@/components/dashboard/ReferralProcessor';
import { useCreditStore } from '@/store/useCreditStore';


export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { createNewCV, cvList, setAnalysisData, deleteCV, addToHistory } = useCVStore();
  const { clList, createNewCL, deleteCL } = useCoverLetterStore();
  const creditsLoading = useCreditStore((state) => state.isLoading);
  const creditsCount = useCreditStore((state) => state.credits);
  const fetchCredits = useCreditStore((state) => state.fetchCredits);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  
  const recentCVs = cvList.slice(0, 3);
  const recentCLs = clList.slice(0, 3);
  
  // No local pagination, just "recent" slice


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Veuillez uploader un fichier PDF.');
      return;
    }

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 403) {
            const { useCreditStore } = await import('@/store/useCreditStore');
            useCreditStore.getState().setOutOfCreditsModalOpen(true);
            return;
        }
        let errorMessage = 'Erreur lors de l\'analyse';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
          console.error('API Error Details:', errorData);
        } catch (e) {
          const text = await response.text();
          console.error('API Error Text:', text);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // Store complete analysis data in global store
      setAnalysisData(data);

      // Persist to history so it shows up in dashboard/ai/analyze history list
      addToHistory({
        id: crypto.randomUUID(),
        type: 'analysis',
        date: new Date().toISOString(),
        score: data.analysis?.globalScore || 0,
        title: data.cvData?.personalInfo?.title 
          ? `Analyse - ${data.cvData.personalInfo.title}`
          : `Analyse CV - ${new Date().toLocaleDateString()}`,
        data: data
      });
      
      toast.success("Analyse terminée !");
      router.push('/analysis');
      
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsAnalyzing(false);
      // Reset input
      event.target.value = '';
    }
  };





  const handleToggleVisibility = async (id: string, currentIsPublic: boolean) => {
    try {
      const response = await fetch(`/api/cv/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !currentIsPublic }),
      });

      if (!response.ok) throw new Error('Erreur réseau');
      
      // Update local state via store toggle method
      useCVStore.getState().togglePublic(id);
      
      if (!currentIsPublic) {
        toast.success("Le CV est maintenant public et partageable !");
      } else {
        toast.success("Le CV est redevenu privé.");
      }
    } catch (error) {
       console.error("Erreur toggle visibility:", error);
       toast.error("Impossible de modifier la visibilité");
    }
  };

  // Fetch credits on mount
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Fetch CLs on dashboard mount
  useEffect(() => {
    CoverLetterService.getAll().then(data => useCoverLetterStore.setState({ clList: data }));
  }, []);

  // Process referral code via Suspense component
  // useProcessReferral removed here

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <ReferralProcessor />
      
      {/* Dashboard Header CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord</h1>
          <p className="text-slate-500 mt-2">Bienvenue. Voici un aperçu de vos activités.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {session?.user?.role === 'RECRUITER' && (
            <Link 
              href="/recruiter/unlocks"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              <Building2 className="w-5 h-5" />
              Espace Recruteur
            </Link>
          )}
          {session?.user?.role === 'SCHOOL_ADMIN' && (
            <Link 
              href="/dashboard/school-admin"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-xl shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              <Building2 className="w-5 h-5" />
              Espace École
            </Link>
          )}
          <Link 
            href="/dashboard/templates"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Nouveau CV
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
        <StatCard 
           title="Crédits IA" 
           value={creditsLoading ? '...' : creditsCount.toString()} 
           icon={Wand2} 
           color="amber"
           trend=""
           href="/dashboard/pricing"
        />
        <StatCard 
           title="CV Créés" 
           value={cvList.length.toString()} 
           icon={FileText} 
           color="blue"
           trend=""
           href="/dashboard/list"
        />
        <ReferralCodeCard />
      </div>

      {/* Magic Analyzer Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-12 rounded-2xl md:rounded-3xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-4 md:p-8 text-center hover:bg-purple-50 transition-colors cursor-pointer group relative overflow-hidden"
        onClick={() => document.getElementById('cv-upload')?.click()}
      >
         <input 
           type="file" 
           id="cv-upload"
           accept=".pdf"
           className="hidden" 
           onChange={handleFileUpload}
         />

         <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform">
            <span className="text-xl md:text-2xl">✨</span>
         </div>
         <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-1 md:mb-2">Magic Analyzer</h2>
         <p className="text-slate-500 max-w-lg mx-auto text-xs md:text-sm">
           Glissez votre ancien CV (PDF) ici pour une analyse instantanée par l&apos;IA.
         </p>
      </motion.div>


      {/* Main Content */}
      <div className="space-y-12">
        {/* CV Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Vos CVs récents</h2>
            {recentCVs.length > 0 && (
              <Link 
                href="/dashboard/list" 
                className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                  Voir tout 
                  <span className="text-xs">→</span>
              </Link>
            )}
          </div>

          {recentCVs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
               {/* New CV Card - Always first */}
               <Link 
                  href="/dashboard/templates"
                  className="group cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-4 md:p-6 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-300 transition-colors min-h-[200px] md:h-[320px] relative overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                    <Plus className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="font-bold text-slate-600 group-hover:text-blue-600 transition-colors relative z-10">Nouveau CV</p>
                  <p className="text-xs text-slate-400 mt-1 relative z-10">Choisir un modèle</p>
                </Link>

                {recentCVs.map((cv, index) => (
                  <div key={cv.id} className={index === 0 ? '' : 'hidden md:block'}>
                    <CVCard 
                      cv={cv}
                      onDelete={deleteCV}
                      onToggleVisibility={handleToggleVisibility}
                      score={Math.floor(Math.random() * (98 - 70) + 70)}
                    />
                  </div>
                ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4 text-center bg-white rounded-3xl border border-slate-100 shadow-sm mx-auto">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Aucun CV pour le moment</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm md:text-base">
                    Vos CVs apparaîtront ici. Créez votre premier CV professionnel pour débloquer de nouvelles opportunités.
                </p>
                <Link 
                   href="/dashboard/templates"
                   className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                >
                   <Plus className="w-6 h-6" />
                   Créer mon premier CV
                </Link>
             </div>
          )}
        </section>

        {/* Cover Letters Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Vos Lettres récentes</h2>
            {recentCLs.length > 0 && (
              <Link 
                href="/dashboard/cover-letters" 
                className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                  Voir tout 
                  <span className="text-xs">→</span>
              </Link>
            )}
          </div>

          {recentCLs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
               {recentCLs.map((cl, index) => (
                <motion.div
                  key={cl.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white p-4 md:p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all group relative flex flex-col justify-between min-h-[160px] md:h-[200px] ${index === 0 ? '' : 'hidden md:flex'}`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm">
                        <Link 
                           href={`/cover-letter/editor/${cl.id}`}
                           className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                           <Edit className="w-4 h-4" />
                        </Link>
                         <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            const btn = e.currentTarget;
                            btn.disabled = true;
                            const tid = toast.loading('Génération du PDF...');
                            try {
                              const res = await fetch('/api/pdf/generate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: cl.id, type: 'cover-letter' }),
                              });
                              if (!res.ok) throw new Error('Erreur PDF');
                              const blob = await res.blob();
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `Lettre_${cl.title || 'motivation'}.pdf`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                              toast.success('PDF téléchargé !', { id: tid });
                            } catch {
                              toast.error('Erreur lors du téléchargement.', { id: tid });
                            } finally {
                              btn.disabled = false;
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Télécharger PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{cl.title}</h3>
                    <p className="text-sm text-slate-500">
                      Modifié le {new Date(cl.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Link 
                    href={`/cover-letter/editor/${cl.id}`}
                    className="mt-4 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group/link"
                  >
                    Ouvrir l&apos;éditeur
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
               ))}
               
               {/* Add New CL Card (Mini) */}
               <Link 
                  href="/dashboard/cover-letters"
                  className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 md:p-6 hover:bg-slate-100 transition-all group min-h-[160px] md:h-[200px]"
               >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-slate-400" />
                  </div>
                  <span className="font-bold text-slate-600">Nouvelle Lettre</span>
               </Link>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4 text-center bg-white rounded-3xl border border-slate-100 shadow-sm mx-auto">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Aucune lettre pour le moment</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm md:text-base">
                    Démarquez-vous avec une lettre de motivation percutante. Notre IA peut l&apos;adapter à l&apos;offre pour vous en 30 secondes.
                </p>
                <Link 
                   href="/dashboard/cover-letters"
                   className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
                >
                   <Plus className="w-6 h-6" />
                   Rédiger une lettre
                </Link>
             </div>
          )}
        </section>
      </div>



        {/* Modal Creation removed per user request - Redirection directly to /dashboard/templates */}

        {/* Full Screen Analysis Loader */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex flex-col items-center justify-center cursor-wait p-4">
             <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300 max-w-[280px] md:max-w-none">
                <div className="w-14 h-14 md:w-20 md:h-20 border-4 md:border-[6px] border-purple-100 border-t-purple-600 rounded-full animate-spin mb-4 md:mb-6" />
                <h3 className="text-base md:text-xl font-bold text-slate-900 mb-1 md:mb-2">Analyse en cours...</h3>
                <p className="text-slate-500 text-center text-xs md:text-base max-w-xs">
                  Notre IA étudie votre CV pour détecter vos points forts.
                </p>
             </div>
          </div>
        )}


    </div>
  );
}
