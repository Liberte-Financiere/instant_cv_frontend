'use client';

import React, { useEffect, useState } from 'react';
import { 
  Activity, AlertTriangle, Clock, Database, Server, RefreshCw, 
  ChevronLeft, ChevronRight, CheckCircle2, XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AILog {
  id: string;
  type: string;
  model: string;
  status: 'success' | 'error' | 'timeout';
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  errorMessage: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  } | null;
}

interface Stats {
  requests24h: number;
  errorRate24h: number;
  avgLatency: number;
  topModel: string;
}

export default function AILogsDashboard() {
  const [logs, setLogs] = useState<AILog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(0);
  const limit = 20;

  const fetchLogs = async (currentPage = 0) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ai-logs?offset=${currentPage * limit}&limit=${limit}`);
      if (!res.ok) {
        if (res.status === 403) throw new Error("Accès refusé. Vous n'êtes pas administrateur.");
        throw new Error("Erreur lors de la récupération des logs.");
      }
      const data = await res.json();
      setLogs(data.logs);
      setStats(data.kpis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Erreur</h2>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Monitoring Dashboard</h1>
          <p className="text-gray-500 mt-1">Surveillez l'activité, les performances et les coûts de l'Intelligence Artificielle en temps réel.</p>
        </div>
        <button 
          onClick={() => fetchLogs(page)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Requêtes (24h)" 
          value={stats?.requests24h.toString() || "..."} 
          icon={<Activity className="text-blue-500" />} 
          trend="Total des appels IA"
        />
        <KpiCard 
          title="Taux d'erreur (24h)" 
          value={stats ? `${stats.errorRate24h.toFixed(1)}%` : "..."} 
          icon={<AlertTriangle className={stats?.errorRate24h && stats.errorRate24h > 5 ? "text-red-500" : "text-amber-500"} />} 
          trend={stats?.errorRate24h === 0 ? "Système stable" : "À surveiller"}
          isAlert={stats?.errorRate24h && stats.errorRate24h > 5}
        />
        <KpiCard 
          title="Latence Moyenne" 
          value={stats ? `${Math.round(stats.avgLatency)} ms` : "..."} 
          icon={<Clock className="text-green-500" />} 
          trend="Temps de réponse global"
        />
        <KpiCard 
          title="Modèle Principal" 
          value={stats?.topModel || "..."} 
          icon={<Database className="text-purple-500" />} 
          trend="Modèle le plus sollicité"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Server className="w-5 h-5 text-gray-500" />
            Historique Récent
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium">Date & Heure</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Modèle</th>
                <th className="px-6 py-3 font-medium">Latence</th>
                <th className="px-6 py-3 font-medium">Tokens (Total)</th>
                <th className="px-6 py-3 font-medium">Utilisateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {log.status === 'success' ? (
                      <span className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2.5 py-1 rounded-full w-fit text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Succès
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-700 bg-red-50 px-2.5 py-1 rounded-full w-fit text-xs font-medium" title={log.errorMessage || "Erreur"}>
                        <XCircle className="w-3.5 h-3.5" /> Erreur
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm:ss", { locale: fr })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 capitalize">{log.type}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                    {log.model}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className={log.latencyMs > 5000 ? "text-amber-600 font-medium" : ""}>
                      {log.latencyMs} ms
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {log.totalTokens > 0 ? (
                      <span>
                        <span className="font-medium">{log.totalTokens}</span>
                        <span className="text-gray-400 text-xs ml-1">({log.promptTokens} P / {log.completionTokens} C)</span>
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {log.user ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{log.user.name || 'Anonyme'}</span>
                        <span className="text-xs text-gray-500">{log.user.email}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Système</span>
                    )}
                  </td>
                </tr>
              ))}
              
              {logs.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Aucun log d'Intelligence Artificielle enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
          <span className="text-sm text-gray-500">
            Page {page + 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0 || loading}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={logs.length < limit || loading}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, trend, isAlert = false }: { title: string, value: string, icon: React.ReactNode, trend: string, isAlert?: boolean }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col ${isAlert ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-3xl font-bold tracking-tight ${isAlert ? 'text-red-600' : 'text-gray-900'}`}>{value}</span>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        {trend}
      </div>
    </div>
  );
}
