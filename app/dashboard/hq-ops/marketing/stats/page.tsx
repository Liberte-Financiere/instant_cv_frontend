'use client';

import { Users, Send, BarChart2, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StatsData {
  totalSubscribers: number;
  emailsSent: number;
  openRate: number;
  clickRate: number;
  chartData: number[];
}

export default function MarketingStatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/hq-ops/marketing/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Erreur stats', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Statistiques & Performances</h1>
          <p className="text-slate-500">Analysez l'impact de vos campagnes marketing et newsletters.</p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Abonnés Totaux</p>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mt-auto">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : stats?.totalSubscribers?.toLocaleString() || '0'}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <Send className="w-5 h-5 ml-0.5" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emails Envoyés</p>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mt-auto">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : stats?.emailsSent?.toLocaleString() || '0'}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                <BarChart2 className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taux d'Ouverture</p>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mt-auto">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : `${stats?.openRate || '0'}%`}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taux de Clic</p>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mt-auto">
               {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : `${stats?.clickRate || '0'}%`}
            </h2>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 h-80 flex flex-col relative overflow-hidden group">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Évolution de l'engagement (30 jours)</h3>
          {loading ? (
             <div className="flex-1 flex items-center justify-center">
               <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
             </div>
          ) : (
            <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-4">
               {(stats?.chartData || []).map((height, i) => (
                 <div key={i} className="w-full bg-slate-100 rounded-t-sm relative group-hover:bg-slate-200 transition-colors" style={{ height: '100%' }}>
                   <div 
                     className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all duration-500" 
                     style={{ height: `${height}%` }}
                   ></div>
                 </div>
               ))}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none opacity-20"></div>
        </div>

      </div>
    </div>
  );
}
