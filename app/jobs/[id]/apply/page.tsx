'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, UploadCloud, CheckCircle, Loader2, AlertCircle, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  
  const [job, setJob] = useState<any>(null);
  const [loadingJob, setLoadingJob] = useState(true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    CV: null,
    COVER_LETTER: null,
    PORTFOLIO: null,
    DIPLOMA: null
  });
  const [uploading, setUploading] = useState(false);
  
  const defaultFirstName = session?.user?.name ? session.user.name.split(' ')[0] : '';
  const defaultLastName = session?.user?.name ? session.user.name.split(' ').slice(1).join(' ') : '';

  const [formData, setFormData] = useState({
    firstName: defaultFirstName,
    lastName: defaultLastName,
    email: session?.user?.email || '',
    phone: '',
    availability: '',
    salaryExpectation: '',
    experienceYears: '',
    profileSummary: '',
    hasConsent: false
  });

  // Fetch job details to get requestedFiles
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
        } else {
          setError("Impossible de charger les détails de l'offre.");
        }
      } catch (error) {
        console.error(error);
        setError("Erreur de connexion.");
      } finally {
        setLoadingJob(false);
      }
    };
    fetchJob();
  }, [resolvedParams.id]);

  // Update data if session loads after initial render
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || (session.user?.name ? session.user.name.split(' ')[0] : ''),
        lastName: prev.lastName || (session.user?.name ? session.user.name.split(' ').slice(1).join(' ') : ''),
        email: prev.email || session.user?.email || ''
      }));
    }
  }, [session]);

  const fillDebugData = () => {
    setFormData({
      firstName: 'Jean',
      lastName: 'Candidat (Test)',
      email: 'jean.candidat@example.com',
      phone: '+226 70 00 00 00',
      availability: 'Immédiate',
      salaryExpectation: '1 500 000 FCFA/mois',
      experienceYears: '5',
      profileSummary: 'Passionné par le développement, j\'adore relever de nouveaux défis techniques. Ceci est une candidature de test.',
      hasConsent: true
    });
    
    // Create fake files
    const mockContent = new Blob(['Contenu du fichier de test.'], { type: 'application/pdf' });
    const mockFiles: any = {};
    if (job?.requestedFiles?.includes('CV')) {
      mockFiles.CV = new File([mockContent], "cv-test-debug.pdf", { type: 'application/pdf' });
    }
    if (job?.requestedFiles?.includes('COVER_LETTER')) {
      mockFiles.COVER_LETTER = new File([mockContent], "lettre-test.pdf", { type: 'application/pdf' });
    }
    if (job?.requestedFiles?.includes('PORTFOLIO')) {
      mockFiles.PORTFOLIO = new File([mockContent], "portfolio-test.pdf", { type: 'application/pdf' });
    }
    if (job?.requestedFiles?.includes('DIPLOMA')) {
      mockFiles.DIPLOMA = new File([mockContent], "diplome-test.pdf", { type: 'application/pdf' });
    }
    setFiles(mockFiles);
  };

  const handleFileChange = (fileKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [fileKey]: e.target.files![0] }));
    }
  };

  const uploadSingleFile = async (fileToUpload: File): Promise<string | null> => {
    const form = new FormData();
    form.append('file', fileToUpload);
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: form
    });
    
    if (!res.ok) {
      throw new Error(`Erreur lors de l'upload de ${fileToUpload.name}`);
    }
    
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate required files
    const requested = job?.requestedFiles || ['CV'];
    for (const reqFile of requested) {
      if (!files[reqFile]) {
        setError(`Veuillez fournir le document requis : ${getFileLabel(reqFile)}.`);
        return;
      }
    }

    if (!formData.hasConsent) {
      setError('Vous devez accepter les conditions.');
      return;
    }

    setLoading(true);
    setUploading(true);
    
    try {
      // Upload all files in parallel
      const uploadPromises: Promise<{ key: string, url: string }>[] = [];
      
      for (const [key, file] of Object.entries(files)) {
        if (file && requested.includes(key)) {
          uploadPromises.push(
            uploadSingleFile(file).then(url => ({ key, url: url || '' }))
          );
        }
      }

      const uploadedResults = await Promise.all(uploadPromises);
      setUploading(false);
      
      // Map URLs to payload
      const fileUrls: any = {};
      uploadedResults.forEach(res => {
        if (res.key === 'CV') fileUrls.cvUrl = res.url;
        if (res.key === 'COVER_LETTER') fileUrls.coverLetterUrl = res.url;
        if (res.key === 'PORTFOLIO') fileUrls.portfolioUrl = res.url;
        if (res.key === 'DIPLOMA') fileUrls.diplomaUrl = res.url;
      });

      const payload = {
        ...formData,
        ...fileUrls,
        experienceYears: formData.experienceYears ? parseInt(formData.experienceYears, 10) : undefined,
      };

      const res = await fetch(`/api/jobs/${resolvedParams.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la soumission de la candidature');
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const getFileLabel = (key: string) => {
    switch (key) {
      case 'CV': return 'Curriculum Vitae (CV)';
      case 'COVER_LETTER': return 'Lettre de motivation';
      case 'PORTFOLIO': return 'Portfolio / Book';
      case 'DIPLOMA': return 'Diplôme / Certification';
      default: return 'Document';
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-200">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Candidature envoyée !</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Votre profil a été transmis au recruteur avec succès. Un e-mail de confirmation vient de vous être envoyé.
          </p>
          <Button onClick={() => router.push('/jobs')} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-bold text-lg">
            Retour aux offres
          </Button>
        </div>
      </div>
    );
  }

  const requested = job?.requestedFiles || ['CV'];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link href={`/jobs/${resolvedParams.id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Annuler et retourner à l'offre
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white relative">
            {process.env.NODE_ENV === 'development' && (
              <Button type="button" variant="outline" size="sm" onClick={fillDebugData} className="absolute top-4 right-4 text-xs bg-white/20 text-white hover:bg-white/30 border-white/30">
                🛠 Auto-remplir
              </Button>
            )}
            <h1 className="text-3xl font-black mb-2 text-center">Postuler maintenant</h1>
            <p className="text-blue-100 font-medium text-center">
              Candidature pour le poste de <strong>{job?.title || 'Chargement...'}</strong> chez {job?.company || ''}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium text-sm">{error}</p>
              </div>
            )}
            
            {/* Informations Personnelles */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Informations Personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Prénom <span className="text-rose-500">*</span></label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all" placeholder="Jean" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nom <span className="text-rose-500">*</span></label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all" placeholder="Dupont" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email <span className="text-rose-500">*</span></label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all" placeholder="jean.dupont@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Téléphone <span className="text-rose-500">*</span></label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all" placeholder="+226 XX XX XX XX" />
                </div>
              </div>
            </section>
            
            {/* Profil Professionnel */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Profil & Documents Exigés</h2>
              
              <div className="space-y-4">
                {requested.map((fileKey: string) => {
                  const currentFile = files[fileKey];
                  return (
                    <div key={fileKey} className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        {getFileLabel(fileKey)} <span className="text-rose-500">*</span>
                      </label>
                      <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors relative cursor-pointer group ${currentFile ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                        <input 
                          required 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(fileKey, e)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${currentFile ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                            {currentFile ? <Check className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
                          </div>
                          {currentFile ? (
                            <div className="text-center md:text-left">
                              <p className="font-bold text-emerald-900 line-clamp-1">{currentFile.name}</p>
                              <p className="text-xs text-emerald-600 font-medium">{(currentFile.size / 1024 / 1024).toFixed(2)} Mo • Modifié</p>
                            </div>
                          ) : (
                            <div className="text-center md:text-left">
                              <p className="font-bold text-slate-900">Importer {getFileLabel(fileKey).toLowerCase()}</p>
                              <p className="text-xs text-slate-500 mt-1">PDF ou Word (Max: 5 Mo)</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Années d'expérience</label>
                  <input type="number" min="0" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all" placeholder="Ex: 3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Prétentions salariales</label>
                  <input type="text" value={formData.salaryExpectation} onChange={e => setFormData({...formData, salaryExpectation: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all" placeholder="Ex: 500 000 FCFA/mois" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Disponibilité <span className="text-rose-500">*</span></label>
                <input required type="text" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all" placeholder="Ex: Immédiate, Sous 1 mois..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">En quelques mots (Optionnel)</label>
                <textarea rows={4} value={formData.profileSummary} onChange={e => setFormData({...formData, profileSummary: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all resize-none" placeholder="Présentez brièvement votre profil et vos motivations..."></textarea>
              </div>
            </section>
            
            {/* Consentement */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
              <input 
                type="checkbox" 
                id="consent" 
                checked={formData.hasConsent} 
                onChange={e => setFormData({...formData, hasConsent: e.target.checked})}
                className="mt-1 w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-600 shrink-0" 
              />
              <label htmlFor="consent" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                En cochant cette case, j'accepte que mes données personnelles soient traitées par JobSira et transmises au recruteur dans le cadre strict de cette candidature, conformément à la politique de confidentialité (RGPD).
              </label>
            </div>

            <Button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all disabled:bg-slate-400">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 
                  {uploading ? 'Upload des documents...' : 'Soumission...'}
                </>
              ) : (
                'Envoyer ma candidature'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
