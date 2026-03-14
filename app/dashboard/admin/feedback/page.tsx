'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Star, Eye, EyeOff, Loader2, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  name: string | null;
  email: string | null;
  image: string | null;
}

interface Feedback {
  id: string;
  rating: number | null;
  content: string;
  isVisible: boolean;
  createdAt: string;
  user: User;
}

export default function AdminFeedbackPanel() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/feedback');
      if (!res.ok) throw new Error('Failed to fetch feedbacks');
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      toast.error("Erreur de récupération des données. Vous n'êtes peut-être pas Admin ?");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    setIsProcessing(id);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !currentVisibility }),
      });

      if (!res.ok) throw new Error('Erreur');
      
      toast.success(currentVisibility ? 'Avis masqué' : 'Avis rendu public');
      
      // Mettre à jour la liste localement
      setFeedbacks(feedbacks.map(f => 
        f.id === id ? { ...f, isVisible: !currentVisibility } : f
      ));
    } catch (error) {
      toast.error('Échec de la modification.');
    } finally {
      setIsProcessing(null);
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis définitivement ?')) {
      return;
    }

    setIsProcessing(id);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erreur');
      
      toast.success('Avis supprimé');
      
      // Retirer l'avis de la liste
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    } catch (error) {
      toast.error('Échec de la suppression.');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Panel Admin - Commentaires</h1>
          <p className="text-slate-500 text-sm">Gérez les témoignages visibles sur la plateforme</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
         {/* Feedbacks Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500">
                 <tr>
                    <th className="p-4 rounded-tl-xl font-medium w-64">Utilisateur</th>
                    <th className="p-4 font-medium min-w-[300px]">Avis</th>
                    <th className="p-4 font-medium">Note</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium text-center">Statut</th>
                    <th className="p-4 rounded-tr-xl font-medium text-right">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {isLoading ? (
                    <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></td></tr>
                 ) : feedbacks.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-500">Aucun avis trouvé.</td></tr>
                 ) : (
                    feedbacks.map((feedback) => (
                      <tr key={feedback.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {feedback.user.image ? (
                              <img src={feedback.user.image} alt="" className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                                {(feedback.user.name || 'U')[0]}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-slate-900 line-clamp-1">{feedback.user.name || 'Anonyme'}</p>
                              <p className="text-xs text-slate-500 line-clamp-1">{feedback.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-700 italic line-clamp-2" title={feedback.content}>"{feedback.content}"</p>
                        </td>
                        <td className="p-4">
                           {feedback.rating ? (
                             <div className="flex gap-0.5">
                               {Array.from({ length: 5 }).map((_, i) => (
                                 <Star key={i} className={`w-3.5 h-3.5 ${i < feedback.rating! ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                               ))}
                             </div>
                           ) : (
                             <span className="text-xs text-slate-400">N/A</span>
                           )}
                        </td>
                        <td className="p-4 text-xs text-slate-400">{new Date(feedback.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                            feedback.isVisible 
                              ? 'bg-green-50 text-green-700 border-green-100' 
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {feedback.isVisible ? 'Public' : 'Masqué'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                           <div className="flex justify-end gap-2">
                             <button 
                               onClick={() => toggleVisibility(feedback.id, feedback.isVisible)}
                               disabled={isProcessing === feedback.id}
                               className={`p-2 rounded-lg transition-colors ${
                                 feedback.isVisible 
                                  ? 'text-amber-500 hover:bg-amber-50' 
                                  : 'text-green-600 hover:bg-green-50'
                               }`}
                               title={feedback.isVisible ? 'Masquer' : 'Rendre public'}
                             >
                               {isProcessing === feedback.id ? (
                                 <Loader2 className="w-4 h-4 animate-spin" />
                               ) : feedback.isVisible ? (
                                 <EyeOff className="w-4 h-4" />
                               ) : (
                                 <Eye className="w-4 h-4" />
                               )}
                             </button>
                             <button 
                               onClick={() => deleteFeedback(feedback.id)}
                               disabled={isProcessing === feedback.id}
                               className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                               title="Supprimer"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))
                 )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
