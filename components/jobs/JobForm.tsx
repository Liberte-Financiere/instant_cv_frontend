'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, ChevronRight, ChevronLeft, Check, FileText, Upload, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  applyMethod: string;
  applyUrlOrMail: string;
  maxApplications: string;
  expiresAt: string;
  description: string;
  requirements: string;
  requestedFiles: string[];
}

interface JobFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<JobFormData>;
  onSubmit: (data: JobFormData) => Promise<void>;
  loading?: boolean;
  applicationCount?: number;
}

export function JobForm({ mode, initialData, onSubmit, loading = false, applicationCount = 0 }: JobFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  // AI Parsing States
  const [aiText, setAiText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<JobFormData>({
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    type: initialData?.type || 'CDI',
    salary: initialData?.salary || '',
    applyMethod: initialData?.applyMethod || 'NATIVE',
    applyUrlOrMail: initialData?.applyUrlOrMail || '',
    maxApplications: initialData?.maxApplications || '',
    expiresAt: initialData?.expiresAt || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    requestedFiles: initialData?.requestedFiles || ['CV'],
  });

  const handleNext = () => {
    setError('');
    
    // Validation Step 1: Method
    if (step === 1) {
      if (formData.applyMethod !== 'NATIVE' && !formData.applyUrlOrMail) {
        setError('Un lien ou email est requis pour cette méthode de candidature.');
        return;
      }
    }
    // Validation Step 2: General Info
    if (step === 2) {
      if (!formData.title || !formData.company) {
        setError('Le titre et l\'entreprise sont requis.');
        return;
      }
    }
    // Validation Step 3: Details
    if (step === 3) {
      if (!formData.description) {
        setError('La description du poste est requise.');
        return;
      }
    }
    
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleRequestedFile = (fileKey: string) => {
    if (fileKey === 'CV') return;
    setFormData(prev => {
      const isSelected = prev.requestedFiles.includes(fileKey);
      if (isSelected) {
        return { ...prev, requestedFiles: prev.requestedFiles.filter(f => f !== fileKey) };
      }
      return { ...prev, requestedFiles: [...prev.requestedFiles, fileKey] };
    });
  };

  // ─── AI LOGIC ──────────────────────────────────────────────────────────

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Veuillez uploader un fichier PDF uniquement.');
      return;
    }

    try {
      setIsParsing(true);
      setError('');
      
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const res = await fetch('/api/utils/parse-pdf', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!res.ok) throw new Error('Erreur lors de la lecture du PDF');

      const data = await res.json();
      if (data.text) {
        setAiText(data.text);
        await parseWithGroq(data.text);
      }
    } catch (err: any) {
      setError(err.message || 'Impossible de lire le document.');
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const parseWithGroq = async (textToParse: string) => {
    if (!textToParse.trim()) {
      setError('Le texte est vide.');
      return;
    }

    try {
      setIsParsing(true);
      setError('');
      
      const res = await fetch('/api/recruiter/jobs/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToParse }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erreur lors de l\'extraction IA');
      }

      const extracted = await res.json();
      
      setFormData(prev => ({
        ...prev,
        title: extracted.title || prev.title,
        company: extracted.company || prev.company,
        location: extracted.location || prev.location,
        type: extracted.type || prev.type,
        salary: extracted.salary || prev.salary,
        description: extracted.description || prev.description,
        requirements: extracted.requirements || prev.requirements,
        applyUrlOrMail: extracted.applyUrlOrMail || prev.applyUrlOrMail,
      }));

      // Auto-avance à l'étape 2 pour voir la magie
      setStep(2);
      
    } catch (err: any) {
      setError(err.message || 'L\'IA n\'a pas pu formater cette annonce. Vous pouvez remplir manuellement.');
    } finally {
      setIsParsing(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 4 && formData.applyMethod === 'NATIVE') return;
    if (step !== 3 && formData.applyMethod !== 'NATIVE') return; // Si non native, étape 3 est la dernière (pas de documents)
    
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const maxSteps = formData.applyMethod === 'NATIVE' ? 4 : 3;
  const stepTitles = [
    'Méthode de candidature',
    'Informations générales',
    'Détails du poste',
    'Documents exigés'
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-8">
      <Link href="/recruiter/jobs" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Retour aux annonces
      </Link>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {mode === 'create' ? "Publier une Offre d'Emploi" : "Modifier l'Offre"}
            </h1>
            <p className="text-slate-500 mt-1">
              Étape {step} sur {maxSteps} • {stepTitles[step - 1]}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 flex items-center gap-2">
          {Array.from({ length: maxSteps }).map((_, i) => (
            <div key={i} className={`h-2.5 rounded-full flex-1 transition-colors duration-300 ${i + 1 <= step ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 space-y-8">
        
        {/* STEP 1: Method & AI */}
        <div className={step === 1 ? 'space-y-6 block' : 'hidden'}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              Comment les candidats doivent-ils postuler ? *
              {mode === 'edit' && applicationCount > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full" title="Des candidats ont déjà postulé, la méthode ne peut plus être modifiée">Verrouillé</span>
              )}
            </label>
            <select 
              value={formData.applyMethod}
              onChange={(e) => setFormData({...formData, applyMethod: e.target.value})}
              disabled={mode === 'edit' && applicationCount > 0}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="NATIVE">Via JobSira (Recommandé)</option>
              <option value="URL">Lien externe (Site Carrière / ATS)</option>
              <option value="EMAIL">Par Email</option>
            </select>
          </div>

          {/* Conditional Method Settings */}
          {formData.applyMethod === 'NATIVE' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Limite de candidatures (Optionnel)</label>
                <input 
                  type="number"
                  min="1"
                  placeholder="Ex: 50"
                  value={formData.maxApplications}
                  onChange={(e) => setFormData({...formData, maxApplications: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <p className="text-xs text-slate-500">L'offre se fermera automatiquement au-delà.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Date d'expiration (Optionnel)</label>
                <input 
                  type="date" 
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  {formData.applyMethod === 'URL' ? 'Lien de candidature *' : 'Email de réception *'}
                </label>
                <input 
                  required={step === 1 && formData.applyMethod !== 'NATIVE'}
                  type={formData.applyMethod === 'EMAIL' ? 'email' : 'url'}
                  placeholder={formData.applyMethod === 'URL' ? 'https://...' : 'recrutement@...'}
                  value={formData.applyUrlOrMail}
                  onChange={(e) => setFormData({...formData, applyUrlOrMail: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* SMART AI PASTE ZONE */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">NOUVEAU</div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Auto-remplissage IA (Optionnel)</h3>
                    <p className="text-sm text-slate-500">Gagnez du temps : collez l'annonce ou uploadez un PDF, notre IA remplit le reste.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <textarea 
                    rows={4}
                    placeholder="Collez ici le texte brut de l'offre (depuis WhatsApp, LinkedIn...)"
                    value={aiText}
                    onChange={(e) => setAiText(e.target.value)}
                    className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <Button 
                      type="button" 
                      onClick={() => parseWithGroq(aiText)}
                      disabled={isParsing || !aiText.trim()}
                      className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold rounded-xl"
                    >
                      {isParsing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />}
                      Analyser le texte
                    </Button>
                    
                    <span className="text-slate-400 text-sm">ou</span>
                    
                    <div className="relative w-full sm:w-auto">
                      <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        disabled={isParsing}
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        disabled={isParsing}
                        className="w-full sm:w-auto border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 font-semibold rounded-xl"
                      >
                        <Upload className="w-4 h-4 mr-2" /> Uploader un PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* STEP 2: General Info */}
        <div className={step === 2 ? 'space-y-6 block' : 'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Titre du poste *</label>
              <input 
                required={step === 2}
                type="text" 
                placeholder="Ex: Développeur React"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Entreprise *</label>
              <input 
                required={step === 2}
                type="text" 
                placeholder="Ex: TechCorp"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Localisation</label>
              <input 
                type="text" 
                placeholder="Ex: Paris, Télétravail"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Type de contrat *</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Alternance">Alternance</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Salaire / TJM</label>
              <input 
                type="text" 
                placeholder="Ex: 45k - 55k €"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* STEP 3: Details */}
        <div className={step === 3 ? 'space-y-6 block' : 'hidden'}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Prérequis (séparés par des virgules)</label>
            <input 
              type="text" 
              placeholder="Ex: React, TypeScript, 3 ans d'expérience"
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description du poste *</label>
            <textarea 
              required={step === 3}
              rows={12}
              placeholder="Décrivez les missions, l'équipe, les avantages..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
            />
          </div>
        </div>

        {/* STEP 4: Requested Files (Only NATIVE) */}
        <div className={step === 4 ? 'space-y-6 block' : 'hidden'}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Documents exigés pour postuler</h3>
              <p className="text-slate-500 text-sm">Sélectionnez les documents que le candidat devra obligatoirement fournir.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CV */}
              <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-blue-500 bg-blue-50/50 cursor-not-allowed opacity-80">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-500 text-white">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Curriculum Vitae (CV)</p>
                  <p className="text-xs text-slate-500">Fichier PDF ou Doc. Obligatoire.</p>
                </div>
              </div>

              {/* Cover Letter */}
              <div 
                onClick={() => toggleRequestedFile('COVER_LETTER')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.requestedFiles.includes('COVER_LETTER') ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center ${
                  formData.requestedFiles.includes('COVER_LETTER') ? 'bg-blue-500 text-white' : 'bg-slate-200'
                }`}>
                  {formData.requestedFiles.includes('COVER_LETTER') && <Check className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Lettre de motivation</p>
                  <p className="text-xs text-slate-500">Fichier PDF ou Doc.</p>
                </div>
              </div>

              {/* Portfolio */}
              <div 
                onClick={() => toggleRequestedFile('PORTFOLIO')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.requestedFiles.includes('PORTFOLIO') ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center ${
                  formData.requestedFiles.includes('PORTFOLIO') ? 'bg-blue-500 text-white' : 'bg-slate-200'
                }`}>
                  {formData.requestedFiles.includes('PORTFOLIO') && <Check className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Portfolio / Book</p>
                  <p className="text-xs text-slate-500">Fichier PDF contenant les réalisations.</p>
                </div>
              </div>

              {/* Diploma */}
              <div 
                onClick={() => toggleRequestedFile('DIPLOMA')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.requestedFiles.includes('DIPLOMA') ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center ${
                  formData.requestedFiles.includes('DIPLOMA') ? 'bg-blue-500 text-white' : 'bg-slate-200'
                }`}>
                  {formData.requestedFiles.includes('DIPLOMA') && <Check className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Diplôme / Certification</p>
                  <p className="text-xs text-slate-500">Copie du diplôme le plus élevé.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          {step > 1 ? (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleBack} 
              disabled={loading || isParsing}
              className="font-medium rounded-xl h-12 px-6"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Précédent
            </Button>
          ) : (
            <div />
          )}
          
          {step < maxSteps ? (
            <Button 
              key="btn-next"
              type="button" 
              onClick={handleNext}
              disabled={isParsing}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-8 font-bold shadow-sm"
            >
              Suivant <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button 
              key="btn-submit"
              type="submit" 
              disabled={loading || isParsing} 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl h-12 px-8 font-bold"
            >
              {loading ? 'Traitement...' : (
                <>
                  <Save className="w-5 h-5 mr-2" /> {mode === 'create' ? "Publier l'offre" : "Enregistrer"}
                </>
              )}
            </Button>
          )}
        </div>

      </form>
    </div>
  );
}
