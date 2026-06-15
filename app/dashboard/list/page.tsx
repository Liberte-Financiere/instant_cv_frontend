'use client';

import { useEffect, useState } from 'react';
import { CV } from '@/types/cv';
import { useCVStore } from '@/store/useCVStore';
import { formatDate } from '@/lib/utils';
import { Edit, Eye, Trash2, Search, FileText, ArrowRight, Loader2, Share2, MoreVertical, CheckCircle, Briefcase, Info } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function CVListPage() {
  const { cvList, fetchUserCVs, deleteCV } = useCVStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [syncingIds, setSyncingIds] = useState<Record<string, boolean>>({});
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setIsLoading(true);
    fetchUserCVs().finally(() => setIsLoading(false));
  }, [fetchUserCVs]);

  // Reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) return;
    try {
      await deleteCV(id);
      toast.success('CV supprimé.');
    } catch (e) {
      toast.error('Erreur de suppression.');
    }
  };

  const handleToggleVisibility = async (id: string, currentIsPublic: boolean) => {
    try {
      const response = await fetch(`/api/cv/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !currentIsPublic }),
      });

      if (!response.ok) throw new Error('Erreur réseau');
      
      useCVStore.getState().togglePublic(id);
      
      if (!currentIsPublic) {
        toast.success("Le CV est maintenant public et partageable !");
      } else {
        toast.success("Le CV est redevenu privé.");
      }
    } catch (error) {
       console.error("Erreur toggle visibility:", error);
       toast.error("Impossible de modifier la visibilité");
    }
  };

  const handleCopyLink = async (cv: CV) => {
    if (!cv.isPublic) {
      toast.error('Le CV doit être public pour avoir un lien de partage.');
      return;
    }
    
    // Fallback URL directly constructed from origin
    const shareUrl = `${window.location.origin}/share/${cv.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedUrl(shareUrl);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (e) {
      console.error('Erreur lors de la copie du lien:', e);
      toast.error('Impossible de copier le lien.');
    }
  };

  const handleSyncRecruiter = async (cv: CV) => {
    if (!cv.isPublic) {
      toast.error('Le CV doit être "Public" (pastille verte) pour être partagé aux recruteurs.');
      return;
    }

    setSyncingIds(prev => ({ ...prev, [cv.id]: true }));
    const toastId = toast.loading('Synchronisation IA avec le portail recruteur...');

    try {
      const res = await fetch(`/api/cv/${cv.id}/searchable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSearchable: true }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la synchronisation');

      toast.success('Profil mis à jour et optimisé pour les recruteurs !', { id: toastId });
      
      // Rafraîchir les données pour afficher le nouveau statut "isSearchable"
      useCVStore.getState().fetchUserCVs();
    } catch (error: any) {
      console.error('Sync failed:', error);
      toast.error(error.message || 'Erreur lors de la synchronisation.', { id: toastId });
    } finally {
      setSyncingIds(prev => ({ ...prev, [cv.id]: false }));
    }
  };

  const filteredCVs = cvList
    .filter(cv => cv.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()); // Plus récent d'abord

  const totalPages = Math.ceil(filteredCVs.length / ITEMS_PER_PAGE) || 1;
  const paginatedCVs = filteredCVs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2 md:gap-3">
            <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            Mes CVs
          </h1>
          <p className="text-slate-500 text-sm mt-1 hidden md:block">
            Gérez vos CVs et décidez lesquels sont visibles par les recruteurs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Rechercher..." 
               className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <Link 
            href="/dashboard/templates"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap"
          >
            <span className="text-lg leading-none">+</span>
            <span className="hidden md:inline">Créer un CV</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : filteredCVs.length === 0 ? (
        <div className="text-center py-12 md:py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
           <p className="text-slate-500 mb-4">Aucun CV trouvé.</p>
           <Link href="/dashboard" className="text-blue-600 font-medium hover:underline">
             + Créer un nouveau CV
           </Link>
        </div>
      ) : (
        <>
          {/* Mobile: Card Layout */}
          <div className="md:hidden space-y-3">
            {paginatedCVs.map((cv) => (
              <motion.div
                key={cv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{cv.title || 'Sans titre'}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Modifié le {new Date(cv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${cv.isPublic ? 'text-green-700' : 'text-slate-500'}`}>
                      {cv.isPublic ? 'Public' : 'Privé'}
                    </span>
                    <button
                      role="switch"
                      aria-checked={cv.isPublic}
                      onClick={() => handleToggleVisibility(cv.id, cv.isPublic)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${
                        cv.isPublic ? 'bg-green-500' : 'bg-slate-300'
                      }`}
                    >
                      <span className="sr-only">Toggle visibilité</span>
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          cv.isPublic ? 'translate-x-2' : '-translate-x-2'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 mb-1">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Eye className="w-3.5 h-3.5" />
                    {cv.views} vues
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1 group relative">
                       <span className="text-xs text-slate-500">Portail Recruteur:</span>
                       <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[11px] leading-tight rounded shadow-xl z-50 text-center">
                         Permet aux recruteurs de trouver votre profil de façon anonyme.
                       </div>
                     </div>
                     <button 
                       onClick={() => handleSyncRecruiter(cv)}
                       disabled={syncingIds[cv.id]}
                       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                       cv.isSearchable 
                         ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200' 
                         : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                     }`}>
                       {syncingIds[cv.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Briefcase className="w-3 h-3" />}
                       {cv.isSearchable ? 'Mettre à jour' : 'Activer'}
                     </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                     Actions:
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleCopyLink(cv)}
                      className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Copier le lien"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <Link 
                      href={`/editor/${cv.id}`}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(cv.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: Table Layout */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider [&>th:first-child]:rounded-tl-2xl [&>th:last-child]:rounded-tr-2xl">
                  <th className="px-6 py-4">Titre du CV</th>
                  <th className="px-6 py-4">Dernière modif.</th>
                  <th className="px-6 py-4">Vues</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 group relative">
                      Portail Recruteur
                      <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block w-56 p-2 bg-slate-800 text-white text-[11px] leading-tight rounded shadow-xl z-[100] font-normal normal-case text-center">
                        Permet aux recruteurs de trouver votre profil de façon anonyme.
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCVs.map((cv) => (
                  <motion.tr 
                    key={cv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {cv.title || 'Sans titre'}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">ID: {cv.id.slice(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(cv.updatedAt).toLocaleDateString()} <span className="text-slate-400 text-xs">à {new Date(cv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Eye className="w-4 h-4 text-slate-400" />
                        {cv.views}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         <button
                           role="switch"
                           aria-checked={cv.isPublic}
                           onClick={() => handleToggleVisibility(cv.id, cv.isPublic)}
                           className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${
                             cv.isPublic ? 'bg-green-500' : 'bg-slate-300'
                           }`}
                         >
                           <span className="sr-only">Toggle visibilité</span>
                           <span
                             className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                               cv.isPublic ? 'translate-x-2' : '-translate-x-2'
                             }`}
                           />
                         </button>
                         <span className={`text-xs font-semibold ${cv.isPublic ? 'text-green-700' : 'text-slate-500'}`}>
                           {cv.isPublic ? 'Public' : 'Privé'}
                         </span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <button 
                         onClick={() => handleSyncRecruiter(cv)}
                         disabled={syncingIds[cv.id]}
                         className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 w-28 rounded-lg text-xs font-semibold transition-all border ${
                         cv.isSearchable 
                           ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200' 
                           : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200 shadow-sm'
                       }`}>
                         {syncingIds[cv.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Briefcase className="w-3.5 h-3.5" />}
                         {cv.isSearchable ? 'Mettre à jour' : 'Activer'}
                       </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => handleCopyLink(cv)}
                           className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                           title="Copier le lien de partage"
                         >
                           <Share2 className="w-4 h-4" />
                         </button>
                         <Link 
                           href={`/editor/${cv.id}`} 
                           className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                           title="Éditer"
                         >
                           <Edit className="w-4 h-4" />
                         </Link>
                         <button 
                           onClick={() => handleDelete(cv.id)}
                           className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                           title="Supprimer"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-6 px-2 md:px-0">
              <p className="text-sm text-slate-500">
                Page <span className="font-bold text-slate-900">{currentPage}</span> / <span className="font-bold text-slate-900">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Précédent
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Success Modal for Copy Link */}
      {copiedUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4 backdrop-blur-sm bg-slate-900/20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm pointer-events-auto border border-slate-100"
          >
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Lien copié !</h3>
              <p className="text-slate-500 text-sm">
                Le lien public a été copié dans votre presse-papiers.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

