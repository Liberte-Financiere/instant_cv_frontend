'use client';

import { useCVStore, AnalysisHistoryItem } from '@/store/useCVStore';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Target, Clock, ArrowRight, Trash2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface HistoryListProps {
  type?: 'analysis' | 'match' | 'bilan';
}

export function HistoryList({ type }: HistoryListProps) {
  const router = useRouter();
  const { history, setAnalysisData, setMatchData, removeFromHistory } = useCVStore();

  const filteredHistory = type 
    ? history.filter(item => item.type === type)
    : history;

  if (!filteredHistory || filteredHistory.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Aucun historique pour le moment</p>
      </div>
    );
  }

  const handleItemClick = (item: AnalysisHistoryItem) => {
    if (item.type === 'analysis') {
      setAnalysisData(item.data);
      router.push('/dashboard/ai/analyze');
    } else if (item.type === 'match') {
      setMatchData(item.data);
      router.push('/dashboard/ai/match');
    } else if (item.type === 'bilan') {
      useCVStore.getState().setBilanData(item.data);
      router.push('/dashboard/tools/bilan');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/ai/history?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur de suppression');
      
      removeFromHistory(id);
      toast.success('Historique supprimé');
    } catch (error) {
      toast.error('Impossible de supprimer cet élément');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-500" />
        Historique récent
      </h3>
      <div className="grid gap-3">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.type === 'analysis' ? 'bg-purple-100 text-purple-600' :
                item.type === 'bilan' ? 'bg-cyan-100 text-cyan-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {item.type === 'analysis' ? <FileText className="w-5 h-5" /> : 
                 item.type === 'bilan' ? <GraduationCap className="w-5 h-5" /> : 
                 <Target className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{format(new Date(item.date), 'dd MMM yyyy à HH:mm', { locale: fr })}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className={`font-semibold ${
                    item.score >= 80 ? 'text-emerald-600' : 
                    item.score >= 50 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    Score: {Math.round(item.score)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => handleDelete(e, item.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
