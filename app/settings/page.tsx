'use client';

import { useSession, signOut } from 'next-auth/react';
import { User, Mail, CreditCard, Bell, Shield, LogOut, Trash2, Check, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { data: session } = useSession();

  const handleUpdateProfile = () => {
    toast.success('Profil mis à jour (Simulation)');
  };

  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera tous vos CVs.')) {
      toast.error('Veuillez contacter le support pour la suppression définitive.');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Paramètres du compte</h1>
        <p className="text-slate-500 text-lg">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <div className="grid gap-8">
        
        {/* User Profile Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Profil Utilisateur
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-wider">
              Compte Google
            </span>
          </div>
          
          <div className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              {session?.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt="Avatar" 
                  width={100} 
                  height={100} 
                  className="rounded-full border-4 border-white shadow-xl" 
                />
              ) : (
                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                  <User className="w-10 h-10 text-slate-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                  <div className="flex items-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
                    <User className="w-4 h-4 mr-3 text-slate-400" />
                    {session?.user?.name || 'Utilisateur'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Adresse Email</label>
                  <div className="flex items-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
                    <Mail className="w-4 h-4 mr-3 text-slate-400" />
                    {session?.user?.email || 'email@example.com'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription / Plan */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              Abonnement & Plan
            </h2>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-xl">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">Plan Gratuit</h3>
                  <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded font-medium border border-white/10">ACTIF</span>
                </div>
                <p className="text-slate-300 max-w-md">
                  Vous utilisez la version gratuite. Créez des CVs illimités avec les modèles standards.
                </p>
              </div>
              <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-lg active:scale-95 text-sm whitespace-nowrap">
                Passer en PRO 🚀
              </button>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="flex items-center gap-2 text-sm text-slate-600">
                 <Check className="w-4 h-4 text-green-500" />
                 <span>Export PDF Illimité</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-600">
                 <Check className="w-4 h-4 text-green-500" />
                 <span>Analyses IA (5/mois)</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-600">
                 <Check className="w-4 h-4 text-green-500" />
                 <span>Accès à 5 modèles</span>
               </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-red-50 bg-red-50/30">
            <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Zone de Danger
            </h2>
          </div>
          <div className="p-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-100">
                <div>
                  <h4 className="font-bold text-slate-800">Se déconnecter</h4>
                  <p className="text-sm text-slate-500">Terminer votre session actuelle.</p>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-100">
                <div>
                  <h4 className="font-bold text-red-700">Supprimer le compte</h4>
                  <p className="text-sm text-red-600/80">Supprimer définitivement votre compte et toutes vos données.</p>
                </div>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-500/20"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
