'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, Clock, Award, Trash2, Loader2, ArrowLeft, MessageSquare, Mic, Keyboard } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface HistorySession {
  id: string;
  jobTitle: string;
  status: string; // 'active' | 'completed'
  format: string; // 'text' | 'audio'
  totalScore: number | null;
  questionCount: number;
  createdAt: string;
}

export default function InterviewHistoryHub() {
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'text' | 'audio'>('all');

  useEffect(() => {
    fetch('/api/ai/interview/history')
      .then((r) => r.json())
      .then((data) => {
        setSessions(data || []);
      })
      .catch(() => toast.error('Erreur lors du chargement de l\'historique.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Supprimer cet entretien ? Cette action est irréversible.')) return;
    
    setIsDeletingId(sessionId);
    try {
      const res = await fetch(`/api/ai/interview/${sessionId}`, { method: 'DELETE' });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        toast.success('Entretien supprimé.');
      } else {
        toast.error('Impossible de supprimer cet entretien.');
      }
    } catch {
      toast.error('Erreur réseau.');
    } finally {
      setIsDeletingId(null);
    }
  };

  // Apply filters
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesFormat = formatFilter === 'all' || session.format === formatFilter;
    return matchesSearch && matchesStatus && matchesFormat;
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/dashboard/ai/interview"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au simulateur
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            Historique des entretiens
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Retrouvez tous vos entretiens passés, reprenez ceux en cours, ou consultez vos bilans.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-100">
            {sessions.length} session{sessions.length > 1 ? 's' : ''} au total
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par poste..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">En cours</option>
            <option value="completed">Terminés</option>
          </select>
        </div>

        {/* Format Filter */}
        <select
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value as any)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="all">Tous les formats</option>
          <option value="audio">Audio Live</option>
          <option value="text">Écrit</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
          <p className="text-sm font-medium">Chargement de l'historique...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sessions.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Aucun entretien</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            Vous n'avez pas encore passé d'entretien IA. Lancez le simulateur pour vous entraîner !
          </p>
          <Link
            href="/dashboard/ai/interview"
            className="inline-flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
          >
            Démarrer un entretien
          </Link>
        </div>
      )}

      {/* No Results Filter State */}
      {!isLoading && sessions.length > 0 && filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">Aucun entretien ne correspond à vos filtres.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setFormatFilter('all');
            }}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredSessions.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <div className="relative group/card h-full">
                <Link
                  href={`/interview/${s.id}`}
                  className="block h-full bg-white rounded-xl p-5 pr-14 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-500 shrink-0" />
                      <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {s.jobTitle}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      s.status === 'completed'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {s.status === 'completed' ? 'Terminé' : 'En cours'}
                    </span>
                    
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {s.format === 'audio' ? (
                        <><Mic className="w-3 h-3" /> Audio</>
                      ) : (
                        <><Keyboard className="w-3 h-3" /> Écrit</>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      {new Date(s.createdAt).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="flex items-center justify-between">
                      {s.format !== 'audio' && (
                        <span className="text-xs text-slate-500">{s.questionCount} question{s.questionCount > 1 ? 's' : ''}</span>
                      )}
                      {s.totalScore !== null && (
                        <span className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
                          <Award className="w-3.5 h-3.5" />
                          {s.totalScore}/100
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={(e) => handleDelete(e, s.id)}
                  disabled={isDeletingId === s.id}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all disabled:opacity-50 z-10"
                  title="Supprimer la session"
                >
                  {isDeletingId === s.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
