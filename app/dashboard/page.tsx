'use client';

import { motion } from 'framer-motion';
import { Plus, FileText, Eye, Download, Search, ArrowLeft } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { CVCard } from '@/components/dashboard/CVCard';
import { TemplateSelector } from '@/components/dashboard/TemplateSelector';
import { TemplateId } from '@/types/cv';
import { Pagination } from '@/components/ui/Pagination';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const { createNewCV, cvList, createImportedCV, setAnalysisData, deleteCV } = useCVStore();
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState<'template' | 'name'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [newTitle, setNewTitle] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Calculate Pagination - Adjust for the "New CV" card taking up one slot on page 1
  // Actually "New CV" card is distinct.
  // Logic: 
  // Page 1: "New CV" Card + 7 CVs
  // Page 2+: 8 CVs
  
  // Let's simplify: "New CV" card is always first visual element.
  // Wait, if I have 20 CVs.
  // Page 1: NewCV Card + CV[0..6] (Total 8 items visually)
  // Page 2: CV[7..14] (Total 8 items)
  
  // Simplified implementation from the previous replace call:
  // I rendered "New CV" card only if currentPage === 1.
  // So on Page 1 we have (ItemsPerPage - 1) slots for CVs if we want to keep grid consistent? 
  // Or just 8 CVs + 1 New Card = 9 items? Grid is varying.
  // Let's stick to: Page 1 shows "New CV" + 7 CVs. Page 2 shows 8 CVs.
  
  const itemsOnFirstPage = itemsPerPage - 1;
  const totalCVs = cvList.length;
  
  // Calculation is tricky if page 1 has different capacity.
  // Let's keep it simple: Just paginate the cvList by 8.
  // And render "New CV" card additionally on top of the list on Page 1.
  // So Page 1: New Card + 8 CVs (9 items). Page 2: 8 CVs.
  // This is fine. Grid flow handles it.
  
  const totalPages = Math.ceil(totalCVs / itemsPerPage);
  const paginatedCVs = cvList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);


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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* ... (header) ... */}
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
           title="CV Créés" 
           value={cvList.length.toString()} 
           icon={FileText} 
           color="blue"
           trend="+2 cette semaine"
        />
        <StatCard 
           title="Profils Consultés" 
           value={totalViews.toString()} 
           icon={Eye} 
           color="purple"
           trend="+15%"
        />
        <StatCard 
           title="Téléchargements" 
           value="8" 
           icon={Download} 
           color="green"
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
      <div className="mb-6 flex items-center justify-between">
         <h2 className="text-xl font-bold text-slate-900">Vos CVs récents</h2>
         <button className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
            Voir tout 
            <span className="text-xs">→</span>
         </button>
      </div>

      {/* CV Grid or Empty State */}
      {cvList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Create New Card (Visual) - Only on first page */}
              {currentPage === 1 && (
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
              )}

              {/* Existing CVs */}
              {paginatedCVs.map((cv) => (
                <CVCard 
                  key={cv.id} 
                  cv={cv}
                  onDelete={deleteCV}
                  score={Math.floor(Math.random() * (98 - 70) + 70)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
             <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-blue-600" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Vous n'avez aucun CV</h3>
             <p className="text-slate-500 max-w-md mx-auto mb-8">
               Créez votre premier CV professionnel en quelques minutes grâce à notre assistant IA.
             </p>
             <button
               onClick={handleOpenModal}
               className="inline-flex items-center gap-2 px-8 py-4 bg-[#2463eb] text-white rounded-xl font-bold hover:shadow-xl hover:shadow-blue-600/20 transition-all"
             >
               <Plus className="w-5 h-5" />
               Créer mon premier CV
             </button>
          </div>
        )}



        {/* Modal Creation with Template Selection */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
             >
                {step === 'template' ? (
                  <>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Choisissez un modèle</h2>
                    <p className="text-slate-500 text-sm mb-6">Sélectionnez le style qui correspond le mieux à votre profil.</p>
                    
                    <TemplateSelector 
                       selectedId={selectedTemplate} 
                       onSelect={setSelectedTemplate} 
                    />
                    
                    <div className="flex gap-3 mt-8">
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
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setStep('template')}
                      className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
                    >
                       <ArrowLeft className="w-4 h-4" /> Retour
                    </button>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Nommez votre CV</h2>
                    <input
                       autoFocus
                       type="text"
                       placeholder="Ex: CV Développeur 2024"
                       className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
                       value={newTitle}
                       onChange={(e) => setNewTitle(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleCreateCV()}
                    />
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
