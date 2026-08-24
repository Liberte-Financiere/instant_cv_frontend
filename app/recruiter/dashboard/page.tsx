'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, Briefcase, Unlock, BarChart3, 
  ArrowRight, PlusCircle, Search, Zap 
} from 'lucide-react';

interface DashboardStats {
  activeJobs: number;
  totalApplications: number;
  unlockedProfiles: number;
  credits: number;
}

export default function RecruiterDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const fetchStats = async () => {
        try {
          const res = await fetch('/api/recruiter/dashboard');
          if (res.ok) {
            const data = await res.json();
            setStats(data);
          } else {
            console.error('Failed to fetch stats');
          }
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchStats();
    }
  }, [status, router]);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Bonjour, {session?.user?.name?.split(' ')[0] || 'Recruteur'} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Voici un aperçu de votre activité et vos raccourcis rapides.
          </p>
        </div>
        <Link href="/recruiter/jobs/create">
          <button className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all">
            <PlusCircle className="w-5 h-5 mr-2" />
            Nouvelle offre
          </button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Annonces Actives', val: stats?.activeJobs || 0, Icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Candidatures', val: stats?.totalApplications || 0, Icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Profils Débloqués', val: stats?.unlockedProfiles || 0, Icon: Unlock, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
          { label: 'Crédits Restants', val: stats?.credits || 0, Icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{s.label}</p>
                <p className="text-3xl font-extrabold mt-2 text-slate-900">{s.val}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center ${s.color}`}>
                <s.Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Shortcuts */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Raccourcis Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Link href="/recruiter" className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Rechercher des talents</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              Parcourez notre base de CVs vérifiés et trouvez les meilleurs profils pour vos offres.
            </p>
            <div className="text-blue-600 text-sm font-bold flex items-center">
              Accéder à la recherche <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/recruiter/jobs" className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Gérer vos offres</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              Consultez vos annonces actives, publiez-en de nouvelles et suivez les candidatures.
            </p>
            <div className="text-emerald-600 text-sm font-bold flex items-center">
              Voir mes annonces <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/recruiter/analytics" className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:border-purple-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Consulter les Analytics</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              Analysez les performances de vos annonces et suivez l'engagement des candidats.
            </p>
            <div className="text-purple-600 text-sm font-bold flex items-center">
              Voir les statistiques <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
