'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Save, Download, Sparkles, Loader2, Wand2,
  MapPin, Phone, Mail, User, Building2, FileText, CheckCircle2,
  ChevronRight, Printer, AlertCircle, FileType
} from 'lucide-react';
import { LetterPreview } from '@/components/cover-letter/LetterPreview';
import Link from 'next/link';
import { useCoverLetterStore } from '@/store/useCoverLetterStore';
import { useCVStore } from '@/store/useCVStore';
import { toast } from 'sonner';

const STEPS = [
  { id: 'info', label: 'Mes Infos', icon: User },
  { id: 'recipient', label: 'Destinataire', icon: Building2 },
  { id: 'content', label: 'Contenu', icon: FileText },
] as const;

export default function CoverLetterEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { currentCL, loadCL, updateContent, saveCurrentCL, currentStep, setCurrentStep } = useCoverLetterStore();
  const { cvList, fetchUserCVs } = useCVStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCVId, setSelectedCVId] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    if (id) {
      loadCL(id);
    }
  }, [id, loadCL]);

  useEffect(() => {
    fetchUserCVs();
  }, [fetchUserCVs]);

  const handleSave = async () => {
    setIsSaving(true);
    await saveCurrentCL();
    setIsSaving(false);
  };

  const handleExportPDF = () => {
    window.open(`/cover-letter/${currentCL?.id}?print=true`, '_blank');
  };

  const handleExportWord = async () => {
    const { exportCoverLetterToWord } = await import('@/lib/cl-word-export');
    if (currentCL) {
      toast.promise(exportCoverLetterToWord(currentCL), {
        loading: 'Génération du fichier Word...',
        success: 'Fichier Word téléchargé !',
        error: 'Erreur lors de l\'export Word'
      });
    }
  };

  const generateFullLetter = async () => {
    if (!selectedCVId || !jobDesc) {
      toast.error('Sélectionnez un CV et une offre d\'emploi.');
      return;
    }

    const cv = cvList.find(c => c.id === selectedCVId);
    if (!cv) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/cover-letter/generate', {
        method: 'POST',
        body: JSON.stringify({ cvData: cv, jobDescription: jobDesc }),
      });

      if (!res.ok) throw new Error('Erreur generation');
      
      const data = await res.json();
      updateContent({
        details: {
          ...currentCL!.content.details,
          subject: data.subject,
          salutation: data.salutation,
          body: data.body,
          closing: data.closing,
        }
      });
      toast.success('Lettre générée avec succès !');
      setCurrentStep('content');
      setShowAIModal(false);
    } catch (error) {
      toast.error('Erreur lors de la génération.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentCL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-slate-100/80 rounded-xl transition-all text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
               <FileText className="w-4 h-4 text-blue-600" />
             </div>
             <div>
                <h1 className="font-bold text-slate-900 text-sm leading-tight">{currentCL.title}</h1>
                <p className="text-[10px] text-slate-400 font-medium">Éditeur de Lettre</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-all hover:shadow-sm"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">Sauvegarder</span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <button 
            onClick={handleExportWord}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-semibold transition-all"
            title="Exporter en Word"
          >
            <FileType className="w-4 h-4" />
            <span className="hidden md:inline">Word</span>
          </button>

          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Editor Column */}
        <div className="w-full lg:w-[42%] xl:w-[38%] flex flex-col bg-white border-r border-slate-200 z-30 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)]">
           {/* Modern Stepper */}
           <div className="px-6 py-6 border-b border-slate-100/80">
              <div className="flex items-center justify-between relative">
                 <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 rounded-full" />
                 {STEPS.map((step, i) => {
                   const Icon = step.icon;
                   const isActive = currentStep === step.id;
                   const isCompleted = STEPS.findIndex(s => s.id === currentStep) > i;
                   
                   return (
                     <button
                       key={step.id}
                       onClick={() => setCurrentStep(step.id as 'info' | 'recipient' | 'content')}
                       className={`flex flex-col items-center gap-2 group outline-none`}
                     >
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300 relative bg-white
                          ${isActive 
                            ? 'border-blue-600 text-blue-600 shadow-md shadow-blue-500/20 scale-110' 
                            : isCompleted
                              ? 'border-green-500 text-green-500'
                              : 'border-slate-200 text-slate-300 group-hover:border-slate-300 group-hover:text-slate-400'
                          }
                        `}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                          {step.label.toUpperCase()}
                        </span>
                     </button>
                   );
                 })}
              </div>
           </div>

           {/* Scrollable Form Area */}
           <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={currentStep}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 }}
                   className="max-w-md mx-auto space-y-8"
                 >
                    {currentStep === 'info' && (
                      <div className="space-y-6">
                         <div className="space-y-1">
                           <h2 className="text-2xl font-bold text-slate-900">À propos de vous</h2>
                           <p className="text-slate-500 text-sm">Vos coordonnées pour l'en-tête de la lettre.</p>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-5">
                            <FloatingInput 
                              label="Prénom"
                              value={currentCL.content.sender.firstName}
                              onChange={(val) => updateContent({ sender: { ...currentCL.content.sender, firstName: val }})}
                            />
                            <FloatingInput 
                              label="Nom"
                              value={currentCL.content.sender.lastName}
                              onChange={(val) => updateContent({ sender: { ...currentCL.content.sender, lastName: val }})}
                            />
                         </div>

                         <FloatingInput 
                           label="Email"
                           type="email"
                           icon={<Mail className="w-4 h-4" />}
                           value={currentCL.content.sender.email}
                           onChange={(val) => updateContent({ sender: { ...currentCL.content.sender, email: val }})}
                         />
                         
                         <FloatingInput 
                           label="Téléphone"
                           type="tel"
                           icon={<Phone className="w-4 h-4" />}
                           value={currentCL.content.sender.phone}
                           onChange={(val) => updateContent({ sender: { ...currentCL.content.sender, phone: val }})}
                         />

                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Adresse</label>
                            <textarea 
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none text-sm min-h-[80px]"
                              value={currentCL.content.sender.address}
                              onChange={(e) => updateContent({ sender: { ...currentCL.content.sender, address: e.target.value }})}
                              placeholder="Votre adresse complète..."
                            />
                         </div>

                         <button 
                          onClick={() => setCurrentStep('recipient')}
                          className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                         >
                           Suivant
                           <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                    )}

                    {currentStep === 'recipient' && (
                      <div className="space-y-6">
                         <div className="space-y-1">
                           <h2 className="text-2xl font-bold text-slate-900">Le Destinataire</h2>
                           <p className="text-slate-500 text-sm">À qui adressez-vous cette lettre ?</p>
                         </div>

                         <FloatingInput 
                            label="Nom de l'entreprise"
                            icon={<Building2 className="w-4 h-4" />}
                            value={currentCL.content.recipient.company}
                            onChange={(val) => updateContent({ recipient: { ...currentCL.content.recipient, company: val }})}
                         />

                         <FloatingInput 
                            label="Nom du contact (Optionnel)"
                            placeholder="ex: M. Jean Dupont"
                            value={currentCL.content.recipient.name}
                            onChange={(val) => updateContent({ recipient: { ...currentCL.content.recipient, name: val }})}
                         />

                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Adresse de l'entreprise</label>
                            <textarea 
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none text-sm min-h-[100px]"
                              value={currentCL.content.recipient.address}
                              onChange={(e) => updateContent({ recipient: { ...currentCL.content.recipient, address: e.target.value }})}
                              placeholder="Adresse..."
                            />
                         </div>

                         <button 
                          onClick={() => setCurrentStep('content')}
                          className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                         >
                           Suivant
                           <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                    )}

                    {currentStep === 'content' && (
                      <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Rédaction</h2>
                            <button 
                              onClick={() => setShowAIModal(true)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-95"
                            >
                               <Sparkles className="w-3.5 h-3.5" />
                               Magic Wand
                            </button>
                         </div>

                         <FloatingInput 
                            label="Objet de la lettre"
                            value={currentCL.content.details.subject}
                            onChange={(val) => updateContent({ details: { ...currentCL.content.details, subject: val }})}
                            className="font-semibold"
                         />

                         <div className="space-y-1.5 flex-1 flex flex-col">
                            <div className="flex justify-between items-center px-1">
                               <label className="text-xs font-bold text-slate-500 uppercase">Corps du texte</label>
                               <span className="text-[10px] text-slate-400">{currentCL.content.details.body.length} caractères</span>
                            </div>
                            <textarea 
                              className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none text-sm leading-7 min-h-[400px] shadow-inner"
                              value={currentCL.content.details.body}
                              onChange={(e) => updateContent({ details: { ...currentCL.content.details, body: e.target.value }})}
                              placeholder="Mesdames, Messieurs..."
                            />
                         </div>
                      </div>
                    )}
                 </motion.div>
              </AnimatePresence>
           </div>
        </div>

        {/* Preview Column */}
        <div className="hidden lg:flex flex-1 bg-slate-100/50 items-start justify-center p-8 xl:p-12 overflow-y-auto custom-scrollbar relative">
           <div className="absolute inset-0 bg-[url('/bg-grid.svg')] opacity-[0.03] pointer-events-none" />
           
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5 }}
             className="relative group"
           >
             {/* A4 Paper Effect */}
             <LetterPreview 
               coverLetter={currentCL} 
               className="w-[210mm] min-h-[297mm] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)]"
             />
           </motion.div>
        </div>
      </main>

      {/* AI Modal */}
      <AnimatePresence>
        {showAIModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
               onClick={() => setShowAIModal(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
            >
              <div className="p-8 border-b border-blue-50/50 flex items-center justify-between bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100">
                      <Wand2 className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-indigo-600" fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xl tracking-tight">Assistant Magic Wand</h3>
                      <p className="text-sm text-slate-500 font-medium">L'IA rédige pour vous en quelques secondes</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setShowAIModal(false)}
                   className="p-2 hover:bg-white/50 rounded-full transition-colors"
                 >
                    <ArrowLeft className="w-6 h-6 text-slate-400 rotate-90" />
                 </button>
              </div>

              <div className="p-8 space-y-6 bg-white">
                 <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">1</span>
                      Sélectionnez un CV source
                    </label>
                    <div className="relative">
                      <select 
                        value={selectedCVId}
                        onChange={(e) => setSelectedCVId(e.target.value)}
                        className="w-full pl-4 pr-10 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
                      >
                        <option value="">-- Choisir un CV --</option>
                        {cvList.map(cv => (
                          <option key={cv.id} value={cv.id}>{cv.title}</option>
                        ))}
                      </select>
                      <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                       <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">2</span>
                       Copiez l'offre d'emploi
                    </label>
                    <textarea 
                      placeholder="Collez ici la description du poste (tâches, pré-requis, à propos de l'entreprise)..."
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[160px] resize-none text-sm bg-slate-50/50 hover:bg-white transition-colors"
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                 </div>

                 <button 
                   onClick={generateFullLetter}
                   disabled={isGenerating || !selectedCVId || !jobDesc}
                   className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group"
                 >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyse en cours...</span>
                      </>
                    ) : (
                      <>
                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl" />
                        <Sparkles className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Générer ma Lettre Maintenant</span>
                      </>
                    )}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-component for Inputs
function FloatingInput({ 
  label, 
  value, 
  onChange, 
  icon, 
  type = "text", 
  placeholder,
  className
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      <input 
        type={type}
        className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-800 placeholder:text-slate-300 ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
