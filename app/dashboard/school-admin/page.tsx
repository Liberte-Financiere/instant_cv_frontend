'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Building2, Users, FileText, Loader2, CreditCard, CheckCircle, AlertTriangle, Hourglass, PlusCircle, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  school: { id: string; name: string };
  wallet: { balance: number };
  stats: {
    totalStudents: number;
    pendingInvitations: number;
    failedEmails: number;
    processingEmails: number;
  };
}

export default function SchoolAdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session.user.role !== 'SCHOOL_ADMIN') {
        router.push('/dashboard');
        return;
      }
      fetchStats();
    }
  }, [status, session, router]);

  const fetchStats = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await fetch('/api/b2b/school-admin/stats');
      if (!res.ok) throw new Error('Erreur de chargement des statistiques');
      const json = await res.json();
      setData(json);
    } catch (error: any) {
      toast.error(error.message);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  // Si erreur de chargement
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] max-w-lg mx-auto text-center px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Oups, un problème est survenu</h2>
        <p className="text-slate-600 mb-8">
          Nous n'avons pas pu charger les données de votre établissement. Cela peut être dû à un problème réseau temporaire.
        </p>
        <button 
          onClick={fetchStats}
          className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Tableau de bord École</h1>
        </div>
        <p className="text-slate-500">
          Bienvenue dans l'espace d'administration de <strong className="text-slate-700">{data.school.name}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Wallet Balance (Option 2 - Upsell B2B) */}
        <div className={`p-6 rounded-2xl shadow-sm border relative overflow-hidden ${data.wallet.balance < 50 ? 'bg-red-50 border-red-100' : 'bg-white border-border'}`}>
          <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl ${data.wallet.balance < 50 ? 'bg-red-200' : 'bg-warning-light'}`} />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className={`text-sm font-medium mb-1 ${data.wallet.balance < 50 ? 'text-red-600' : 'text-muted'}`}>Crédits Disponibles</p>
              <h3 className={`text-3xl font-bold ${data.wallet.balance < 50 ? 'text-red-700' : 'text-slate-900'}`}>{data.wallet.balance}</h3>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.wallet.balance < 50 ? 'bg-red-100' : 'bg-warning-light'}`}>
              <CreditCard className={`w-5 h-5 ${data.wallet.balance < 50 ? 'text-red-600' : 'text-warning'}`} />
            </div>
          </div>
          
          {data.wallet.balance < 50 ? (
            <button 
              onClick={() => router.push('/dashboard/school-admin/billing')}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors w-full justify-center shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Recharger mon compte
            </button>
          ) : (
            <div className="mt-4 text-xs font-medium text-warning bg-warning-light inline-block px-2 py-1 rounded">
              Utilisés par vos étudiants
            </div>
          )}
        </div>

        {/* Total Students */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted mb-1">Étudiants Rattachés</p>
              <h3 className="text-3xl font-bold text-slate-900">{data.stats.totalStudents}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>


        {/* Pending Invitations */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted mb-1">Invitations en Attente</p>
              <h3 className="text-3xl font-bold text-slate-900">{data.stats.pendingInvitations}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-muted-light flex items-center justify-center">
              <FileText className="w-5 h-5 text-muted" />
            </div>
          </div>
        </div>

        {/* Processing Emails */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted mb-1">Emails en traitement</p>
              <h3 className="text-3xl font-bold text-slate-900">{data.stats.processingEmails}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-warning-light flex items-center justify-center">
              <Hourglass className="w-5 h-5 text-warning" />
            </div>
          </div>
        </div>

        {/* Failed Emails */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted mb-1">Emails échoués</p>
              <h3 className="text-3xl font-bold text-slate-900">{data.stats.failedEmails}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-destructive-light flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Option 4 - Empty State pour les nouveaux établissements */}
      {data.stats.totalStudents === 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-8 rounded-2xl mb-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/30 blur-3xl rounded-full -ml-20 -mb-20 pointer-events-none" />
           
           <div className="w-16 h-16 bg-white shadow-sm text-indigo-600 rounded-2xl flex items-center justify-center mb-5 relative z-10">
             <UserPlus className="w-8 h-8" />
           </div>
           <h3 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">Accueillez vos premiers talents</h3>
           <p className="text-slate-600 max-w-lg mb-8 relative z-10">
             Votre espace école est prêt. Générez dès maintenant des invitations pour permettre à vos étudiants de créer leur CV enrichi à l'IA et de devenir visibles par les recruteurs.
           </p>
           <button 
            onClick={() => router.push('/dashboard/school-admin/invitations')} 
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all relative z-10 flex items-center gap-2"
           >
             <FileText className="w-5 h-5" />
             Générer une invitation
           </button>
        </div>
      )}
      
      {/* Navigation Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Gérer votre établissement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => router.push('/dashboard/school-admin/students')}
            className="flex items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left group"
          >
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">Mes Étudiants</h3>
              <p className="text-sm text-slate-500">Voir la liste des étudiants rattachés et suivre leur activité.</p>
            </div>
          </button>

          <button 
            onClick={() => router.push('/dashboard/school-admin/invitations')}
            className="flex items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:emerald-300 transition-all text-left group"
          >
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Invitations</h3>
              <p className="text-sm text-slate-500">Générer des codes d'invitation pour vos étudiants.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
