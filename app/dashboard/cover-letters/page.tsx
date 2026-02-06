'use client';

import { useEffect, useState } from 'react';
import { FileText, Plus, ArrowRight, Wand2, Search, Edit, Trash2, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { CoverLetter } from '@/types/cover-letter';
import { CoverLetterService } from '@/services/coverLetterService';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCoverLetterStore } from '@/store/useCoverLetterStore';
import { useCVStore } from '@/store/useCVStore';

export default function CoverLettersPage() {
  const [cls, setCls] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { createNewCL, updateContent } = useCoverLetterStore();
  const { cvList, fetchUserCVs } = useCVStore();

  const fetchCLs = async () => {
    setIsLoading(true);
    try {
      const data = await CoverLetterService.getAll();
      setCls(data);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des lettres.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCLs();
    // Also fetch CVs for the AI modal choice
    fetchUserCVs();
  }, [fetchUserCVs]);

  // Modal States
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [newLetterTitle, setNewLetterTitle] = useState('');
  
  // AI Flow States
  const [aiStep, setAiStep] = useState<'details' | 'generating'>('details');
  
  // CV Selection State
  const [cvSourceType, setCvSourceType] = useState<'select' | 'upload'>('select');
  const [selectedCVId, setSelectedCVId] = useState('');
  const [uploadedCvText, setUploadedCvText] = useState('');
  const [isParsingCv, setIsParsingCv] = useState(false);
  const [cvFileName, setCvFileName] = useState('');

  // Job Description State
  const [jobSourceType, setJobSourceType] = useState<'text' | 'upload'>('text');
  const [jobDesc, setJobDesc] = useState('');
  const [isParsingJob, setIsParsingJob] = useState(false);

  // Handlers
  const openManualModal = () => {
    setNewLetterTitle('');
    setIsManualModalOpen(true);
  };

  const openAIModal = () => {
    setNewLetterTitle('');
    setSelectedCVId('');
    setJobDesc('');
    setUploadedCvText('');
    setCvFileName('');
    setCvSourceType('select');
    setJobSourceType('text'); // User asked for ability to paste OR upload. 'text' covers pasting.
    setAiStep('details');
    setIsAIModalOpen(true);
  };

  const handleManualCreate = () => {
    if (!newLetterTitle.trim()) {
      toast.error('Veuillez entrer un titre.');
      return;
    }
    const id = createNewCL(newLetterTitle);
    setIsManualModalOpen(false);
    router.push(`/cover-letter/editor/${id}`);
  };

  const handleFileUpload = async (file: File, type: 'cv' | 'job') => {
    if (file.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptés.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    const setParsing = type === 'cv' ? setIsParsingCv : setIsParsingJob;
    setParsing(true);

    try {
      const res = await fetch('/api/utils/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'Parsing failed');
      }
      
      const data = await res.json();
      
      if (type === 'cv') {
        setUploadedCvText(data.text);
        setCvFileName(file.name);
        toast.success('CV analysé avec succès !');
      } else {
        setJobDesc(data.text); // Auto-fill textarea
        setJobSourceType('text'); // Switch back to text view so user can check/edit
        toast.success('Offre importée avec succès !');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setParsing(false);
    }
  };

  const handleAICreate = async () => {
    const isCvReady = cvSourceType === 'select' ? !!selectedCVId : !!uploadedCvText;
    
    if (!newLetterTitle.trim() || !isCvReady || !jobDesc.trim()) {
      toast.error('Veuillez remplir tous les champs (Titre, CV, Offre).');
      return;
    }

    const cvData = cvSourceType === 'select' ? cvList.find(c => c.id === selectedCVId) : null;
    
    setAiStep('generating');
    
    // 1. Create empty CL locally & on server
    const id = createNewCL(newLetterTitle);

    try {
      // 2. Call AI Generation
      const res = await fetch('/api/ai/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cvData: cvData, 
          cvText: uploadedCvText, 
          jobDescription: jobDesc 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'Erreur generation');
      }

      const data = await res.json();

      // 3. Update Content in Store
      // createNewCL sets 'currentCL' to the new one.
      // updateContent updates 'currentCL'.
      
      updateContent({
        details: {
            subject: data.subject,
            salutation: data.salutation,
            body: data.body,
            closing: data.closing,
            date: new Date().toLocaleDateString('fr-FR'),
            location: 'Ville', // Placeholder or add input for it
        }
      });

      // 4. Force Save
      await useCoverLetterStore.getState().saveCurrentCL();

      toast.success('Lettre générée avec succès !');
      // Redirect to editor
      router.push(`/cover-letter/editor/${id}`);

    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la génération IA.');
      setAiStep('details');
      // Ideally we might delete the CL if it failed, but let's keep it safe.
    }
  };


  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette lettre ?')) return;
    try {
      await CoverLetterService.delete(id);
      setCls(prev => prev.filter(cl => cl.id !== id));
      toast.success('Lettre supprimée.');
    } catch (e) {
      toast.error('Erreur lors de la suppression.');
    }
  };

  const filteredCLs = cls.filter(cl => 
    cl.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto relative min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            Mes Lettres de Motivation
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Gérez et personnalisez vos lettres de motivation pour chaque candidature.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Main New Button */}
          <button 
            onClick={openManualModal}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Lettre
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : filteredCLs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Wand2 className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Aucune lettre créée</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
            Choisissez votre mode de création pour démarrer.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {/* AI Option */}
            <div 
              onClick={openAIModal}
              className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group text-left relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-3">
                  <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">Recommandé</span>
               </div>
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 border border-blue-100">
                 <Wand2 className="w-6 h-6 text-blue-600" />
               </div>
               <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Générer avec l&apos;IA</h4>
               <p className="text-sm text-slate-600 leading-relaxed">
                 L&apos;IA analyse votre CV et l&apos;offre d&apos;emploi pour rédiger une lettre parfaitement ciblée en quelques secondes.
               </p>
            </div>
            
            {/* Manual Option */}
            <div 
              onClick={openManualModal}
              className="p-8 bg-white rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer group text-left"
            >
               <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-sm mb-6 border border-slate-100">
                 <Edit className="w-6 h-6 text-slate-600" />
               </div>
               <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">Rédiger manuellement</h4>
               <p className="text-sm text-slate-600 leading-relaxed">
                 Partez d&apos;une page blanche ou de nos modèles.
               </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card to add new (visible when list is not empty) */}
          <div 
            onClick={openAIModal}
            className="bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center p-6 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer group min-h-[200px]"
          >
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Wand2 className="w-6 h-6 text-blue-600" />
             </div>
             <p className="font-bold text-blue-700">Générer une nouvelle lettre</p>
          </div>

          {filteredCLs.map((cl) => (
            <motion.div
              key={cl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all group relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(cl.id); }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{cl.title}</h3>
              <p className="text-sm text-slate-500 mb-6">
                Modifié le {new Date(cl.updatedAt).toLocaleDateString()}
              </p>
              
              <Link
                href={`/cover-letter/editor/${cl.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-bold rounded-xl transition-all"
              >
                Ouvrir l&apos;éditeur
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Manual Creation Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-slate-500" />
              Rédaction Manuelle
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Titre de la lettre</label>
                <input 
                  type="text" 
                  value={newLetterTitle}
                  onChange={(e) => setNewLetterTitle(e.target.value)}
                  placeholder="Ex: Candidature Google..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleManualCreate()}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleManualCreate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  Créer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Creation Modal */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative" 
          >
             {/* Header */}
             <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                   <Wand2 className="w-5 h-5 text-blue-600" />
                   Générateur IA
                </h2>
                <button onClick={() => !aiStep.includes('generating') && setIsAIModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                   <Plus className="w-6 h-6 rotate-45" />
                </button>
             </div>

             <div className="p-8">
               {aiStep === 'generating' ? (
                 <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
                    <div className="relative">
                       <div className="w-20 h-20 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600" />
                       <Wand2 className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-slate-900 mb-2">L&apos;IA rédige votre lettre...</h3>
                       <p className="text-slate-500 max-w-md">Analyse du CV et de l&apos;offre en cours. Cela prend quelques secondes.</p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">1. Titre de la lettre</label>
                       <input 
                         type="text" 
                         value={newLetterTitle}
                         onChange={(e) => setNewLetterTitle(e.target.value)}
                         placeholder="Ex: Candidature Senior Dev..."
                         className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                       />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Column 1: CV Source */}
                       <div className="space-y-3">
                          <label className="block text-sm font-bold text-slate-700">2. CV Source</label>
                          
                          <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
                             <button 
                               onClick={() => setCvSourceType('select')}
                               className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${cvSourceType === 'select' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                             >
                               Mes CVs
                             </button>
                             <button 
                               onClick={() => setCvSourceType('upload')}
                               className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${cvSourceType === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                             >
                               Importer PDF
                             </button>
                          </div>

                          {cvSourceType === 'select' ? (
                            <select 
                              value={selectedCVId}
                              onChange={(e) => setSelectedCVId(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white cursor-pointer"
                            >
                               <option value="">-- Sélectionner --</option>
                               {cvList.map(cv => (
                                 <option key={cv.id} value={cv.id}>{cv.title}</option>
                               ))}
                            </select>
                          ) : (
                            <div className={`relative w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${uploadedCvText ? 'border-green-300 bg-green-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
                               {isParsingCv ? (
                                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                               ) : uploadedCvText ? (
                                  <div className="text-center p-4">
                                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                       <FileText className="w-4 h-4 text-green-600" />
                                     </div>
                                     <p className="text-xs font-bold text-green-700 truncate max-w-[200px]">{cvFileName}</p>
                                     <button onClick={() => { setUploadedCvText(''); setCvFileName(''); }} className="text-[10px] text-red-500 hover:underline mt-1">Changer</button>
                                  </div>
                               ) : (
                                  <>
                                    <input 
                                      type="file" 
                                      accept="application/pdf"
                                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'cv')}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <FileText className="w-6 h-6 text-slate-400 mb-2" />
                                    <p className="text-xs font-semibold text-slate-600">Glisser ou cliquer pour uploader (PDF)</p>
                                  </>
                               )}
                            </div>
                          )}
                       </div>
                       
                       {/* Column 2: Job Description */}
                       <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="block text-sm font-bold text-slate-700">3. Offre d&apos;emploi</label>
                            {/* Small Toggle for Job */}
                             <div className="flex bg-slate-100 p-0.5 rounded-md">
                               <button 
                                 onClick={() => setJobSourceType('text')}
                                 className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${jobSourceType === 'text' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                               >
                                 Texte
                               </button>
                               <button 
                                 onClick={() => setJobSourceType('upload')}
                                 className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${jobSourceType === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                               >
                                 PDF
                               </button>
                            </div>
                          </div>

                          {jobSourceType === 'text' ? (
                            <textarea 
                               value={jobDesc}
                               onChange={(e) => setJobDesc(e.target.value)}
                               placeholder="Collez la description ici..."
                               className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none min-h-[128px] resize-none text-sm"
                            />
                          ) : (
                            <div className="relative w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all">
                               {isParsingJob ? (
                                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                               ) : (
                                  <>
                                    <input 
                                      type="file" 
                                      accept="application/pdf"
                                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'job')}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <FileText className="w-6 h-6 text-slate-400 mb-2" />
                                    <p className="text-xs font-semibold text-slate-600">Uploader l'offre (PDF)</p>
                                  </>
                               )}
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="flex justify-end pt-4">
                       <button 
                         onClick={handleAICreate}
                         className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 w-full md:w-auto justify-center"
                       >
                         <Sparkles className="w-5 h-5" />
                         Générer la lettre
                       </button>
                    </div>
                 </div>
               )}
             </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
