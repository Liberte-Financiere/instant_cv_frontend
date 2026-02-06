'use client';

import { motion } from 'framer-motion';
import { Plus, FileText, Eye, Download, Search, ArrowLeft, ArrowRight, Edit } from 'lucide-react';
import Link from 'next/link';
import { useCVStore } from '@/store/useCVStore';
import { useState, useEffect } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { CVCard } from '@/components/dashboard/CVCard';
import { TemplateSelector } from '@/components/dashboard/TemplateSelector';
import { TemplateId } from '@/types/cv';
import { Pagination } from '@/components/ui/Pagination';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCoverLetterStore } from '@/store/useCoverLetterStore';
import { CoverLetterService } from '@/services/coverLetterService';

export default function DashboardPage() {
  const router = useRouter();
  const { createNewCV, cvList, setAnalysisData, deleteCV } = useCVStore();
  const { clList, createNewCL, deleteCL } = useCoverLetterStore();
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState<'template' | 'name'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [newTitle, setNewTitle] = useState('');
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



  const handleCreateCV = () => {
    if (newTitle.trim()) {
      const id = createNewCV(newTitle.trim(), selectedTemplate);
      setNewTitle('');
      setIsCreating(false);
      setStep('template');
      setSelectedTemplate('modern');
      window.location.href = `/editor/${id}`;
    }
  };

  const handleOpenModal = () => {
    setIsCreating(true);
    setStep('template');
    setSelectedTemplate('modern');
    setNewTitle('');
  };

  const totalViews = cvList.reduce((acc, cv) => acc + (cv.views || 0), 0);

  // Fetch CLs on dashboard mount
  useEffect(() => {
    CoverLetterService.getAll().then(data => useCoverLetterStore.setState({ clList: data }));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* ... (header) ... */}
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <StatCard 
           title="CV Créés" 
           value={cvList.length.toString()} 
           icon={FileText} 
           color="blue"
           trend=""
        />
        <StatCard 
           title="Profils Consultés" 
           value={totalViews.toString()} 
           icon={Eye} 
           color="purple"
           trend=""
        />

      </div>

      {/* Magic Analyzer Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 rounded-3xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-8 text-center hover:bg-purple-50 transition-colors cursor-pointer group relative overflow-hidden"
        onClick={() => document.getElementById('cv-upload')?.click()}
      >
         <input 
           type="file" 
           id="cv-upload"
           accept=".pdf" // Add .txt later if needed
           className="hidden" 
           onChange={handleFileUpload}
         />

         <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">✨</span>
         </div>
         <h2 className="text-xl font-bold text-slate-900 mb-2">Magic Analyzer</h2>
         <p className="text-slate-500 max-w-lg mx-auto text-sm">
           Glissez votre ancien CV (PDF) ici pour une analyse instantanée par l&apos;IA et découvrez comment l&apos;améliorer.
         </p>
      </motion.div>


      {/* Main Content */}
      <div className="space-y-12">
        {/* CV Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Vos CVs récents</h2>
            <Link 
              href="/dashboard/list" 
              className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
                Voir tout 
                <span className="text-xs">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {/* New CV Card - Always first */}
             <motion.div 
                whileHover={{ scale: 1.02 }}
                onClick={handleOpenModal}
                className="group cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-6 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-300 transition-colors h-[320px]"
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
                </div>
                <p className="font-bold text-slate-600 group-hover:text-blue-600">Nouveau CV</p>
                <p className="text-xs text-slate-400 mt-1">Choisir un modèle</p>
              </motion.div>

              {recentCVs.map((cv) => (
                <CVCard 
                  key={cv.id} 
                  cv={cv}
                  onDelete={deleteCV}
                  score={Math.floor(Math.random() * (98 - 70) + 70)}
                />
              ))}
          </div>
        </section>

        {/* Cover Letters Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Vos Lettres récentes</h2>
            <Link 
              href="/dashboard/cover-letters" 
              className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
                Voir tout 
                <span className="text-xs">→</span>
            </Link>
          </div>

          {recentCLs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {recentCLs.map((cl) => (
                <motion.div
                  key={cl.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all group relative flex flex-col justify-between h-[200px]"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm">
                        <Link 
                           href={`/cover-letter/editor/${cl.id}`}
                           className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                           <Edit className="w-4 h-4" />
                        </Link>
                         <a 
                          href={`/cover-letter/${cl.id}?print=true`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Télécharger / Imprimer"
                        >
                          <Download className="w-4 h-4" />
                        </a>
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
                  className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 hover:bg-slate-100 transition-all group h-[200px]"
               >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-slate-400" />
                  </div>
                  <span className="font-bold text-slate-600">Nouvelle Lettre</span>
               </Link>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 mb-4">Vous n&apos;avez pas encore de lettre de motivation.</p>
                <Link href="/dashboard/cover-letters" className="text-blue-600 font-bold hover:underline">
                  Commencer à rédiger
                </Link>
            </div>
          )}
        </section>
      </div>



        {/* Modal Creation with Template Selection */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl h-[85vh] flex flex-col overflow-hidden"
             >
                {step === 'template' ? (
                  <>
                    <div className="p-8 pb-4 shrink-0">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Choisissez un modèle</h2>
                        <p className="text-slate-500 text-sm">Sélectionnez le style qui correspond le mieux à votre profil.</p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-8 py-4 min-h-0">
                        <TemplateSelector 
                           selectedId={selectedTemplate} 
                           onSelect={setSelectedTemplate} 
                        />
                    </div>
                    
                    <div className="p-6 border-t border-slate-100 bg-white shrink-0">
                        <div className="flex gap-3">
                           <button 
                             onClick={() => setIsCreating(false)}
                             className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                           >
                             Annuler
                           </button>
                           <button 
                             onClick={() => setStep('name')}
                             className="flex-1 py-3 font-bold text-white bg-[#2463eb] rounded-xl hover:bg-blue-700 transition-colors"
                           >
                             Continuer
                           </button>
                        </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-8 pb-4 shrink-0">
                        <button 
                          onClick={() => setStep('template')}
                          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
                        >
                           <ArrowLeft className="w-4 h-4" /> Retour
                        </button>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Nommez votre CV</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 min-h-0">
                        <input
                           autoFocus
                           type="text"
                           placeholder="Ex: CV Développeur 2024"
                           className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
                           value={newTitle}
                           onChange={(e) => setNewTitle(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleCreateCV()}
                        />
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-white shrink-0">
                        <div className="flex gap-3">
                           <button 
                             onClick={() => setIsCreating(false)}
                             className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                           >
                             Annuler
                           </button>
                           <button 
                             onClick={handleCreateCV}
                             disabled={!newTitle.trim()}
                             className="flex-1 py-3 font-bold text-white bg-[#2463eb] rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             Créer
                           </button>
                        </div>
                    </div>
                  </>
                )}
             </motion.div>
          </div>
        )}

        {/* Full Screen Analysis Loader */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex flex-col items-center justify-center cursor-wait">
             <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 border-[6px] border-purple-100 border-t-purple-600 rounded-full animate-spin mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Analyse en cours...</h3>
                <p className="text-slate-500 text-center max-w-xs">
                  Notre IA étudie votre CV pour détecter vos points forts et axes d'amélioration.
                </p>
             </div>
          </div>
        )}
    </div>
  );
}
