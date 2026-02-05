'use client';

import { useEffect, useState } from 'react';
import { CV } from '@/types/cv';
import { CVService } from '@/services/cvService';
import { formatDate } from '@/lib/utils';
import { Edit, Eye, Trash2, Search, FileText, ArrowRight, Loader2, Share2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function CVListPage() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCVs = async () => {
    setIsLoading(true);
    try {
      // Use the optimized summary fetch (no heavy content)
      const data = await CVService.getAllSummaries();
      setCvs(data);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement de la liste.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) return;
    try {
      await CVService.delete(id);
      setCvs(prev => prev.filter(c => c.id !== id));
      toast.success('CV supprimé.');
    } catch (e) {
      toast.error('Erreur de suppression.');
    }
  };

  const filteredCVs = cvs.filter(cv => 
    cv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Mes CVs (Vue Liste)
          </h1>
          <p className="text-slate-500 mt-1">
            Gérez vos CVs efficacement avec cette vue optimisée.
          </p>
        </div>

        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Rechercher..." 
             className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : filteredCVs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
           <p className="text-slate-500 mb-4">Aucun CV trouvé.</p>
           <Link href="/dashboard" className="text-blue-600 font-medium hover:underline">
             + Créer un nouveau CV
           </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <th className="px-6 py-4">Titre du CV</th>
                <th className="px-6 py-4">Dernière modif.</th>
                <th className="px-6 py-4">Vues</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCVs.map((cv) => (
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
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                       cv.isPublic 
                         ? 'bg-green-100 text-green-800' 
                         : 'bg-slate-100 text-slate-600'
                     }`}>
                       {cv.isPublic ? 'Public' : 'Privé'}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Link 
                         href={`/share/${cv.id}`} 
                         target="_blank"
                         className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                         title="Partager"
                       >
                         <Share2 className="w-4 h-4" />
                       </Link>
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
      )}
    </div>
  );
}
