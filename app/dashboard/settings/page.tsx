'use client';

import { useSession } from 'next-auth/react';
import { User, Check, ChevronDown, CheckCircle, Sparkles, Eye, EyeOff, Shield, AlertTriangle, Loader2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { ReferralSection } from '@/components/dashboard/ReferralSection';
import { useCreditStore } from '@/store/useCreditStore';
import Link from 'next/link';
import { SECTORS } from '@/lib/constants';

interface CvEntry {
  id: string;
  title: string;
  isPublic: boolean;
  isSearchable: boolean;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const creditsLoading = useCreditStore((state) => state.isLoading);
  const creditsCount = useCreditStore((state) => state.credits);

  // Recruiter opt-in state
  const [userCvs, setUserCvs] = useState<CvEntry[]>([]);
  const [togglingCvId, setTogglingCvId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    sector: 'Technologie & Informatique',
    acceptsMarketing: false,
  });

  // Fetch complete user profile data from DB upon landing
  useEffect(() => {
    async function fetchProfileData() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
           const userData = await res.json();
           if (userData?.user) {
              setFormData((prev) => ({
                 ...prev,
                 firstName: userData.user.name?.split(' ')[0] || '',
                 lastName: userData.user.name?.split(' ').slice(1).join(' ') || '',
                 email: userData.user.email || '',
                 phone: userData.user.phone || '',
                 jobTitle: userData.user.jobTitle || '',
                 sector: userData.user.sector || prev.sector,
                 acceptsMarketing: userData.user.acceptsMarketing || false,
              }));
           }
        }
      } catch (error) {
         console.error('Error fetching profile', error);
      }
    }

    async function fetchUserCvs() {
      try {
        const res = await fetch('/api/cv?summary=true');
        if (res.ok) {
          const cvs = await res.json();
          setUserCvs(cvs.map((cv: any) => ({
            id: cv.id,
            title: cv.title,
            isPublic: cv.isPublic || false,
            isSearchable: cv.isSearchable || false,
          })));
        }
      } catch (error) {
        console.error('Error fetching CVs', error);
      }
    }
    
    fetchProfileData();
    fetchUserCvs();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           firstName: formData.firstName,
           lastName: formData.lastName,
           phone: formData.phone,
           jobTitle: formData.jobTitle,
           sector: formData.sector,
           acceptsMarketing: formData.acceptsMarketing,
        }),
      });

      if (!res.ok) throw new Error('Failed to update');
      toast.success('Modifications enregistrées');
      
      // Force refreshing the session via next-auth could be added here if needed
      // await update({ name: `${formData.firstName} ${formData.lastName}`.trim() })
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const toggleSearchable = async (cvId: string, currentValue: boolean) => {
    if (!currentValue) {
      const activeCount = userCvs.filter(cv => cv.isSearchable).length;
      if (activeCount >= 2) {
        toast.error("Vous ne pouvez rendre que 2 CVs maximum visibles pour les recruteurs.");
        return;
      }
    }

    setTogglingCvId(cvId);
    try {
      const res = await fetch(`/api/cv/${cvId}/searchable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSearchable: !currentValue }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Impossible de modifier la visibilité.');
        if (data.qualityReport?.reasons) {
          data.qualityReport.reasons.forEach((r: string) => toast.error(r, { duration: 6000 }));
        }
        return;
      }

      setUserCvs((prev) =>
        prev.map((cv) =>
          cv.id === cvId ? { ...cv, isSearchable: !currentValue } : cv
        )
      );
      toast.success(!currentValue ? 'CV visible par les recruteurs' : 'CV retiré du talent pool');
    } catch {
      toast.error('Erreur de connexion.');
    } finally {
      setTogglingCvId(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-slate-50 min-h-screen">
      
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <div className="text-sm text-slate-500 mb-2 font-medium">
          <span className="hover:text-blue-600 cursor-pointer">Accueil</span> / <span className="text-slate-900">Paramètres</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Paramètres du compte</h1>
        <p className="text-slate-500">Gérez vos informations personnelles et vos préférences de recherche d&apos;emploi.</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/50 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group cursor-pointer">
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt="Avatar" 
                width={80} 
                height={80} 
                className="rounded-full object-cover w-20 h-20" 
              />
            ) : (
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-slate-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-slate-900">Votre photo de profil</h3>
            <p className="text-slate-500 text-sm mt-1">
              Modifier votre photo et vos informations personnelles visibles par les recruteurs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors">
              Modifier
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
              Supprimer
            </button>
          </div>
        </section>

        {/* Personal Info Form */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100/50 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Informations personnelles</h3>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Prénom</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nom</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Adresse e-mail</label>
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Numéro de téléphone</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 text-sm"
                />
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-6">Préférences d&apos;Emploi</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Titre du poste actuel</label>
                  <input 
                    type="text" 
                    placeholder="ex: Product Designer"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Secteurs d&apos;activité</label>
                  <div className="relative">
                    <select 
                      value={formData.sector}
                      onChange={(e) => setFormData({...formData, sector: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 text-sm appearance-none cursor-pointer"
                    >
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Opt-in */}
            <div className="pt-4 border-t border-slate-50 mt-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center h-6">
                  <button
                    onClick={() => setFormData({ ...formData, acceptsMarketing: !formData.acceptsMarketing })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                      formData.acceptsMarketing ? 'bg-indigo-500' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      formData.acceptsMarketing ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">S'abonner aux nouveautés Jobsira</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Recevez nos emails concernant les nouvelles fonctionnalités, mises à jour importantes et offres spéciales. Vous pouvez vous désabonner à tout moment.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-50 mt-6">
              <button className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                Annuler
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </section>

        {/* Crédits IA */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100/50 overflow-hidden p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900">Crédits IA</h3>
                <p className="text-slate-500 text-sm truncate">Solde actuel de vos crédits IA</p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-3xl font-black text-amber-600">
                {creditsLoading ? '...' : creditsCount}
              </span>
              <Link 
                href="/dashboard/pricing" 
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                Recharger
              </Link>
            </div>
          </div>
        </section>

        {/* Recruiter Opt-in */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Visibilité Recruteurs</h3>
                <p className="text-slate-500 text-sm mt-0.5">Rendez vos CVs visibles dans le vivier de talents pour être contacté par des recruteurs.</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong className="font-semibold text-blue-900">Confidentialité garantie : </strong>
                Vos coordonnées (nom, email, téléphone) restent masquées. Les recruteurs voient un profil anonymisé et utilisent leurs crédits pour débloquer vos informations uniquement si votre profil les intéresse.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">Vos CVs disponibles</h4>
              {userCvs.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-sm text-slate-500">Aucun CV trouvé. Créez un CV pour activer cette option.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {userCvs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((cv) => (
                    <div key={cv.id} className="group flex items-center justify-between bg-white hover:bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-sm transition-all duration-200">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{cv.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            {cv.isPublic ? 'Public' : 'Privé'}
                            {cv.isSearchable && (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-1"></span>
                                <span className="text-blue-600 font-medium">Visible par les recruteurs</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSearchable(cv.id, cv.isSearchable)}
                        disabled={togglingCvId === cv.id}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                          cv.isSearchable ? 'bg-blue-600' : 'bg-slate-200'
                        } ${togglingCvId === cv.id ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:shadow-md'}`}
                        aria-label="Toggle visibility"
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                          cv.isSearchable ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Pagination Controls */}
                  {userCvs.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                      <p className="text-sm text-slate-500">
                        Affichage de <span className="font-medium text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> à <span className="font-medium text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, userCvs.length)}</span> sur <span className="font-medium text-slate-900">{userCvs.length}</span> CVs
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(Math.ceil(userCvs.length / ITEMS_PER_PAGE), p + 1))}
                          disabled={currentPage >= Math.ceil(userCvs.length / ITEMS_PER_PAGE)}
                          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Referral Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100/50 overflow-hidden p-6">
          <h3 className="font-bold text-slate-900 mb-4">Programme de Parrainage</h3>
          <ReferralSection />
        </section>



      </div>
    </div>
  );
}
