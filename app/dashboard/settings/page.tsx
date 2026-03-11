'use client';

import { useSession } from 'next-auth/react';
import { User, Check, ChevronDown, CheckCircle, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { ReferralSection } from '@/components/dashboard/ReferralSection';
import { useCreditStore } from '@/store/useCreditStore';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const creditsLoading = useCreditStore((state) => state.isLoading);
  const creditsCount = useCreditStore((state) => state.credits);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    sector: 'Technologie & Informatique'
  });

  // Fetch complete user profile data from DB upon landing
  useEffect(() => {
    async function fetchProfileData() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
           const userData = await res.json();
           // Map fetched user data to form
           if (userData?.user) {
              setFormData((prev) => ({
                 ...prev,
                 firstName: userData.user.name?.split(' ')[0] || '',
                 lastName: userData.user.name?.split(' ').slice(1).join(' ') || '',
                 email: userData.user.email || '',
                 phone: userData.user.phone || '',
                 jobTitle: userData.user.jobTitle || '',
                 sector: userData.user.sector || prev.sector,
              }));
           }
        }
      } catch (error) {
         console.error('Error fetching profile', error);
      }
    }
    
    fetchProfileData();
  }, []); // Run on mount

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
                      <option>Technologie & Informatique</option>
                      <option>Finance & Banque</option>
                      <option>Santé & Médical</option>
                      <option>Design & Créatif</option>
                      <option>Autre</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
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

        {/* Referral Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100/50 overflow-hidden p-6">
          <h3 className="font-bold text-slate-900 mb-4">Programme de Parrainage</h3>
          <ReferralSection />
        </section>



      </div>
    </div>
  );
}
