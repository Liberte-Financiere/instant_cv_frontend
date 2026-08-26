'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Bot, X, UploadCloud, Loader2, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AIMatchWidgetProps {
  jobId: string;
}

export function AIMatchWidget({ jobId }: AIMatchWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'upload' | 'loading' | 'result'>('upload');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingText, setLoadingText] = useState('Lecture des compétences du CV...');
  
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setError('Veuillez uploader un fichier PDF valide.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Le fichier est trop volumineux (5MB max).');
        return;
      }
      setError('');
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        setError('Veuillez uploader un fichier PDF valide.');
        return;
      }
      setError('');
      setSelectedFile(file);
    }
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;
    
    setStep('loading');
    setLoadingText('Lecture des compétences du CV...');
    
    // Simuler des étapes de texte pour faire patienter
    const timeouts = [
      setTimeout(() => setLoadingText('Comparaison avec les prérequis de l\'offre...'), 2000),
      setTimeout(() => setLoadingText('Calcul du score de compatibilité...'), 4500)
    ];

    try {
      const formData = new FormData();
      formData.append('cvFile', selectedFile);

      const res = await fetch(`/api/jobs/${jobId}/ai-match`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Une erreur est survenue.');
      }

      const matchData = await res.json();
      setResult(matchData);
      setStep('result');
      
    } catch (err: any) {
      setError(err.message || 'Impossible de terminer l\'analyse.');
      setStep('upload');
    } finally {
      timeouts.forEach(clearTimeout);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setResult(null);
    setError('');
    setStep('upload');
    setIsOpen(false);
  };

  return (
    <>
      {/* Bouton d'appel à l'action */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-5 px-6 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.25)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-3 overflow-hidden group relative border border-blue-500/50"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
        <Bot className="w-7 h-7 relative z-10" />
        <span className="relative z-10 text-lg">Évaluer mes chances avec Jobsira (Gratuit)</span>
      </button>

      {/* Modale Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            <button 
              onClick={reset}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="overflow-y-auto p-8 custom-scrollbar">
              
              {/* ÉTAPE 1 : Upload */}
              {step === 'upload' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-blue-100">
                    <Bot className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">IA de Matching Jobsira</h2>
                  <p className="text-slate-500 text-center mb-8">Découvrez en quelques secondes si votre profil correspond aux attentes de ce poste.</p>
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
                      selectedFile ? 'border-emerald-400 bg-emerald-50' : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf"
                      onChange={handleFileSelect}
                    />
                    
                    {selectedFile ? (
                      <div className="space-y-2">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                        <p className="font-bold text-slate-900">{selectedFile.name}</p>
                        <p className="text-sm text-slate-500">Prêt pour l'analyse</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <UploadCloud className="w-12 h-12 text-blue-400 mx-auto" />
                        <div>
                          <p className="font-bold text-slate-900">Cliquez ou glissez votre CV ici</p>
                          <p className="text-sm text-slate-500 mt-1">Format PDF uniquement (Max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <Button 
                    disabled={!selectedFile}
                    onClick={startAnalysis}
                    className="w-full mt-6"
                    size="lg"
                  >
                    Lancer l'analyse IA
                  </Button>
                </div>
              )}

              {/* ÉTAPE 2 : Loading */}
              {step === 'loading' && (
                <div className="py-12 text-center animate-in fade-in zoom-in duration-300">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <Bot className="w-10 h-10 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">L'IA réfléchit...</h3>
                  <p className="text-slate-500 font-medium text-lg min-h-[28px] transition-all">{loadingText}</p>
                </div>
              )}

              {/* ÉTAPE 3 : Résultat */}
              {step === 'result' && result && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
                  {/* Header Result */}
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                    <div className="relative shrink-0">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                        <circle 
                          cx="64" 
                          cy="64" 
                          r="56" 
                          fill="transparent" 
                          stroke={result.compatibilityScore >= 75 ? "#10b981" : result.compatibilityScore >= 50 ? "#f59e0b" : "#f43f5e"} 
                          strokeWidth="12" 
                          strokeDasharray="351.86"
                          strokeDashoffset={351.86 - (351.86 * result.compatibilityScore) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-black text-slate-900">{result.compatibilityScore}%</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-2xl font-black text-slate-900 mb-2">
                        {result.compatibilityScore >= 75 ? "Excellent profil ! 🎯" : result.compatibilityScore >= 50 ? "Profil intéressant 👍" : "Profil éloigné 🤔"}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">{result.summary}</p>
                    </div>
                  </div>

                  {/* Compétences */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Forces */}
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5">
                      <h4 className="flex items-center gap-2 text-emerald-700 font-bold mb-4 uppercase tracking-wide text-sm">
                        <CheckCircle2 className="w-5 h-5" /> Vos Atouts
                      </h4>
                      {result.matchedSkills && result.matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.matchedSkills.map((skill: string, i: number) => (
                            <span key={i} className="bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">{skill}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-emerald-600/70">Aucune compétence clé détectée.</p>
                      )}
                    </div>

                    {/* Faiblesses */}
                    <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5">
                      <h4 className="flex items-center gap-2 text-rose-700 font-bold mb-4 uppercase tracking-wide text-sm">
                        <AlertTriangle className="w-5 h-5" /> À améliorer
                      </h4>
                      {result.missingSkills && result.missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.missingSkills.map((skill: string, i: number) => (
                            <span key={i} className="bg-white border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">{skill}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-rose-600/70">Toutes les compétences semblent couvertes.</p>
                      )}
                    </div>
                  </div>

                  {/* Highlights / Conseils */}
                  {result.highlights && result.highlights.length > 0 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Conseil de l'IA</h4>
                        <p className="text-sm text-slate-700 leading-relaxed">{result.highlights[0]}</p>
                      </div>
                    </div>
                  )}

                  {/* MARKETING CTA - UPSELL */}
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 text-center relative overflow-hidden group">
                      {/* Décors visuels */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                      
                      <h4 className="text-xl font-black text-slate-900 mb-2 mt-2">Passez à la vitesse supérieure !</h4>
                      <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                        Créez un compte gratuitement pour <strong className="text-primary">améliorer directement votre CV</strong> avec l'IA et profiter de <strong className="text-amber-500">15 crédits offerts</strong> pour tester l'ensemble des fonctionnalités phares de Jobsira.
                      </p>
                      <Link href="/register" className="inline-flex w-full">
                        <Button className="w-full" size="lg">
                          Créer mon CV parfait <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                      <button onClick={reset} className="w-full mt-4 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
                        Fermer et retourner à l'offre
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
