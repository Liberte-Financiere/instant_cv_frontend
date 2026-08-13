'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Building2, Users, FileText, Loader2, CreditCard, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  school: { id: string; name: string };
  wallet: { balance: number };
  stats: {
    totalStudents: number;
    pendingInvitations: number;
    acceptedInvitations: number;
  };
}

export default function SchoolAdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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
    try {
      const res = await fetch('/api/b2b/school-admin/stats');
      if (!res.ok) throw new Error('Erreur de chargement des statistiques');
      const json = await res.json();
      setData(json);
    } catch (error: any) {
      toast.error(error.message);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Wallet Balance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full blur-2xl" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Crédits Disponibles</p>
              <h3 className="text-3xl font-bold text-slate-900">{data.wallet.balance}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded">
            Utilisés par vos étudiants
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Étudiants Rattachés</p>
              <h3 className="text-3xl font-bold text-slate-900">{data.stats.totalStudents}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Accepted Invitations */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Invitations Acceptées</p>
              <h3 className="text-3xl font-bold text-slate-900">{data.stats.acceptedInvitations}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Pending Invitations */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Invitations en Attente</p>
              <h3 className="text-3xl font-bold text-slate-900">{data.stats.pendingInvitations}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </div>
      </div>
      
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
