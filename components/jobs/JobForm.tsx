'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, ChevronRight, ChevronLeft, Check, FileText } from 'lucide-react';
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
  applicationCount?: number; // Used to disable applyMethod if > 0
}

export function JobForm({ mode, initialData, onSubmit, loading = false, applicationCount = 0 }: JobFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
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

  const fillDebugData = () => {
    setFormData({
      title: 'Ingénieur DevOps (Test)',
      company: 'TechCorp SA',
      location: 'Paris, France (Hybride)',
      type: 'CDI',
      salary: '55k - 65k €',
      applyMethod: 'NATIVE',
      applyUrlOrMail: '',
      maxApplications: '50',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Nous recherchons un profil talentueux pour rejoindre notre équipe. Vous serez responsable de la mise en place de nouvelles solutions et de l\'amélioration continue.\n\nAvantages:\n- Télétravail 3j/semaine\n- Mutuelle prise en charge à 100%\n- Tickets restaurant',
      requirements: 'React, Node.js, TypeScript, CI/CD, Docker',
      requestedFiles: ['CV', 'COVER_LETTER', 'PORTFOLIO'],
    });
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.title || !formData.company) {
        setError('Le titre et l\'entreprise sont requis.');
        return;
      }
      if (formData.applyMethod !== 'NATIVE' && !formData.applyUrlOrMail) {
        setError('Un lien ou email est requis pour cette méthode de candidature.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.description) {
        setError('La description du poste est requise.');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleRequestedFile = (fileKey: string) => {
    if (fileKey === 'CV') return; // Cannot toggle CV
    setFormData(prev => {
      const isSelected = prev.requestedFiles.includes(fileKey);
      if (isSelected) {
        return { ...prev, requestedFiles: prev.requestedFiles.filter(f => f !== fileKey) };
      }
      return { ...prev, requestedFiles: [...prev.requestedFiles, fileKey] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

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
              Étape {step} sur 3 • {step === 1 ? 'Informations générales' : step === 2 ? 'Détails du poste' : 'Documents exigés'}
            </p>
          </div>
          {mode === 'create' && process.env.NODE_ENV === 'development' && (
            <Button type="button" variant="outline" size="sm" onClick={fillDebugData} className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">
              🛠 Auto-remplir
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2.5 rounded-full flex-1 transition-colors duration-300 ${i <= step ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 space-y-8">
        
        {/* STEP 1: General Info */}
        <div className={step === 1 ? 'space-y-6 block' : 'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Titre du poste *</label>
              <input 
                required={step === 1}
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
                required={step === 1}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Candidature via *
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
                <option value="NATIVE">JobSira (Recommandé)</option>
                <option value="URL">Lien externe (ATS)</option>
                <option value="EMAIL">Email</option>
              </select>
            </div>
            <div className="space-y-2">
              {formData.applyMethod === 'NATIVE' ? (
                <>
                  <label className="text-sm font-semibold text-slate-700">Limite (Optionnel)</label>
                  <input 
                    type="number"
                    min="1"
                    placeholder="Ex: 50"
                    value={formData.maxApplications}
                    onChange={(e) => setFormData({...formData, maxApplications: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </>
              ) : (
                <>
                  <label className="text-sm font-semibold text-slate-700">
                    {formData.applyMethod === 'URL' ? 'Lien *' : 'Email *'}
                  </label>
                  <input 
                    required={step === 1 && formData.applyMethod !== 'NATIVE'}
                    type={formData.applyMethod === 'EMAIL' ? 'email' : 'url'}
                    placeholder={formData.applyMethod === 'URL' ? 'https://...' : 'recrutement@...'}
                    value={formData.applyUrlOrMail}
                    onChange={(e) => setFormData({...formData, applyUrlOrMail: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Date limite (Optionnel)</label>
              <input 
                type="date" 
                value={formData.expiresAt}
                onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* STEP 2: Details */}
        <div className={step === 2 ? 'space-y-6 block' : 'hidden'}>
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
              required={step === 2}
              rows={12}
              placeholder="Décrivez les missions, l'équipe, les avantages..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
            />
          </div>
        </div>

        {/* STEP 3: Requested Files */}
        <div className={step === 3 ? 'space-y-6 block' : 'hidden'}>
          
          {formData.applyMethod !== 'NATIVE' ? (
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Candidature Externe</h3>
              <p className="text-slate-500">
                Vous avez choisi une méthode de candidature externe ({formData.applyMethod === 'URL' ? 'Lien' : 'Email'}). <br/>
                La gestion des fichiers et des candidatures se fera en dehors de JobSira.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Documents exigés pour postuler</h3>
                <p className="text-slate-500 text-sm">Sélectionnez les documents que le candidat devra obligatoirement fournir.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CV - Always Required */}
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
          )}
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          {step > 1 ? (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleBack} 
              disabled={loading}
              className="font-medium rounded-xl h-12 px-6"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Précédent
            </Button>
          ) : (
            <div />
          )}
          
          {step < 3 ? (
            <Button 
              key="btn-next"
              type="button" 
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-8 font-bold shadow-sm"
            >
              Suivant <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button 
              key="btn-submit"
              type="submit" 
              disabled={loading} 
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
