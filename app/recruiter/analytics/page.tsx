'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BarChart3, Eye, MousePointerClick, Briefcase, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RecruiterAnalyticsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const isRecruiter = session?.user?.role === 'RECRUITER' || session?.user?.role === 'ADMIN';
      if (!isRecruiter) {
        router.push('/dashboard');
      } else {
        fetchJobs();
      }
    }
  }, [status, session, router]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/recruiter/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Chargement de vos statistiques...</p>
      </div>
    );
  }

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'ACTIVE').length;
  const totalViews = jobs.reduce((sum, job) => sum + (job.viewsCount || 0), 0);
  const totalClicks = jobs.reduce((sum, job) => sum + (job.clicksCount || 0), 0);
  const totalApplications = jobs.reduce((sum, job) => sum + (job.totalApplications || 0), 0);
  
  // Top performing jobs by views
  const topJobs = [...jobs].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
            <BarChart3 className="w-6 h-6" />
          </div>
          Tableau de bord Analytique
        </h1>
        <p className="text-slate-500 text-sm mt-2 ml-15">Vue d'ensemble des performances de vos annonces et de l'engagement candidat.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Vues */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Vues Totales</p>
            <p className="text-4xl font-black text-slate-900">{totalViews.toLocaleString()}</p>
          </div>
        </div>

        {/* Total Clics */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Clics (Postuler)</p>
            <p className="text-4xl font-black text-slate-900">{totalClicks.toLocaleString()}</p>
          </div>
        </div>

        {/* Candidatures */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Candidatures reçues</p>
            <p className="text-4xl font-black text-slate-900">{totalApplications.toLocaleString()}</p>
          </div>
        </div>

        {/* Taux de conversion */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Taux de Conversion</p>
            <p className="text-4xl font-black text-slate-900">
              {totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0}%
            </p>
            <p className="text-xs text-slate-400 mt-1">Clics par rapport aux vues</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Top Annonces */}
        <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-3xl p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Top 5 de vos meilleures annonces</h3>
          
          {topJobs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 mb-4">Aucune donnée disponible pour le moment.</p>
              <Link href="/recruiter/jobs/create">
                <Button className="bg-blue-600 text-white shadow-sm rounded-xl">Créer une offre</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {topJobs.map((job, idx) => {
                const maxViews = topJobs[0].viewsCount || 1;
                const widthPct = Math.max(((job.viewsCount || 0) / maxViews) * 100, 2);
                
                return (
                  <div key={job.id} className="space-y-3 group">
                    <div className="flex items-center justify-between text-sm">
                      <Link href={`/jobs/${job.id}`} target="_blank" className="font-bold text-slate-800 hover:text-blue-600 transition-colors truncate max-w-[60%] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">{idx + 1}</span>
                        {job.title}
                      </Link>
                      <div className="text-slate-500 flex items-center gap-4 bg-slate-50 px-3 py-1 rounded-lg">
                        <span className="flex items-center gap-1.5 font-medium" title="Vues"><Eye className="w-4 h-4 text-blue-500"/> {job.viewsCount || 0}</span>
                        <span className="flex items-center gap-1.5 font-medium" title="Clics"><MousePointerClick className="w-4 h-4 text-emerald-500"/> {job.clicksCount || 0}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ width: `${widthPct}%` }}
                      >
                        <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Résumé du compte */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          
          <h3 className="text-xl font-bold mb-8 relative z-10 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            Résumé du compte
          </h3>
          
          <div className="space-y-6 relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1">Annonces actives</p>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-black text-white">{activeJobs}</p>
                <p className="text-slate-500 mb-1">/ {totalJobs} total</p>
              </div>
            </div>
            
            <hr className="border-slate-700" />
            
            <div className="space-y-4">
              <Link href="/recruiter/jobs/create" className="block w-full">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-lg shadow-blue-500/25 rounded-xl py-6 font-bold text-base">
                  Publier une nouvelle offre
                </Button>
              </Link>
              <Link href="/recruiter/jobs" className="block w-full">
                <Button variant="outline" className="w-full bg-transparent hover:bg-white/10 text-white border-white/20 rounded-xl py-6">
                  Gérer mes annonces
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
