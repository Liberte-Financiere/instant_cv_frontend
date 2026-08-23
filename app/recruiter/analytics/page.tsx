'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BarChart3, Eye, MousePointerClick, Briefcase, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
    return <div className="p-8 text-center text-slate-400">Chargement des statistiques...</div>;
  }

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'ACTIVE').length;
  const totalViews = jobs.reduce((sum, job) => sum + (job.viewsCount || 0), 0);
  const totalClicks = jobs.reduce((sum, job) => sum + (job.clicksCount || 0), 0);
  
  // Top performing jobs by views
  const topJobs = [...jobs].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-500" /> Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">Vue d'ensemble de l'engagement sur vos annonces publiées.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Vues */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Eye className="w-16 h-16 text-blue-500" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Vues Totales</p>
            <p className="text-3xl font-bold text-white">{totalViews}</p>
          </div>
        </div>

        {/* Total Clics */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MousePointerClick className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Clics (Postuler)</p>
            <p className="text-3xl font-bold text-white">{totalClicks}</p>
          </div>
        </div>

        {/* Taux de conversion */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-purple-500" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Taux de Conversion</p>
            <p className="text-3xl font-bold text-white">
              {totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Annonces Actives */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase className="w-16 h-16 text-amber-500" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Annonces Actives</p>
            <p className="text-3xl font-bold text-white">{activeJobs} <span className="text-sm font-normal text-slate-500">/ {totalJobs}</span></p>
          </div>
        </div>
      </div>

      {/* Top Annonces */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Top 5 de vos meilleures annonces</h3>
        
        {topJobs.length === 0 ? (
          <div className="text-center py-8 text-slate-400">Aucune donnée disponible.</div>
        ) : (
          <div className="space-y-5">
            {topJobs.map((job, idx) => {
              const maxViews = topJobs[0].viewsCount || 1;
              const widthPct = Math.max(((job.viewsCount || 0) / maxViews) * 100, 2);
              
              return (
                <div key={job.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-white truncate max-w-[60%]">{idx + 1}. {job.title}</span>
                    <span className="text-slate-400 flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-blue-400"/> {job.viewsCount || 0}</span>
                      <span className="flex items-center gap-1.5"><MousePointerClick className="w-4 h-4 text-emerald-400"/> {job.clicksCount || 0}</span>
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
