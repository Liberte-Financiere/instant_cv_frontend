'use client';

import { useSession } from 'next-auth/react';
import { User, Check, ChevronDown, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // Mock state for form
  const [formData, setFormData] = useState({
    firstName: session?.user?.name?.split(' ')[0] || 'Jean',
    lastName: session?.user?.name?.split(' ')[1] || 'Dupont',
    email: session?.user?.email || 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    jobTitle: '',
    sector: 'Technologie & Informatique'
  });

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success('Modifications enregistrées');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-[#F8FAFC] min-h-screen">
      
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
            <button className="px-4 py-2 bg-[#6366F1] hover:bg-[#4f46e5] text-white text-sm font-medium rounded-lg transition-colors">
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
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all text-slate-700 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nom</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all text-slate-700 text-sm"
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
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all text-slate-700 text-sm"
                />
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-bold text-[#6366F1] uppercase tracking-wider mb-6">Préférences d&apos;Emploi</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Titre du poste actuel</label>
                  <input 
                    type="text" 
                    placeholder="ex: Product Designer"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all text-slate-700 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Secteurs d&apos;activité</label>
                  <div className="relative">
                    <select 
                      value={formData.sector}
                      onChange={(e) => setFormData({...formData, sector: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all text-slate-700 text-sm appearance-none cursor-pointer"
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
                className="px-6 py-3 bg-[#6366F1] hover:bg-[#4f46e5] text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </section>

        {/* Subscription Banner */}
        <section className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#6366F1] rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
               <CheckCircle className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-indigo-900">Optijob Pro</h3>
               <p className="text-indigo-600/80 text-sm">
                 Prochaine facturation le 15 Octobre 2026
               </p>
             </div>
          </div>
          <button className="px-6 py-3 bg-[#6366F1] hover:bg-[#4f46e5] text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-colors whitespace-nowrap">
            Gérer l&apos;abonnement
          </button>
        </section>

      </div>
    </div>
  );
}
