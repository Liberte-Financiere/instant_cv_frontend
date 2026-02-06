'use client';

import { Edit, Trash2, Download, Clock, Eye, Share2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CV } from '@/types/cv';
import { CVThumbnail } from './CVThumbnail';

interface CVCardProps {
  cv: CV;
  onDelete: (id: string) => void;
  score?: number; // Optional score for the progress circle
}

export function CVCard({ cv, onDelete, score = 0 }: CVCardProps) {
  // Calculate relative time or format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Modifié aujourd\'hui';
    if (days === 1) return 'Modifié hier';
    if (days < 7) return `Modifié il y a ${days} jours`;
    
    return `Modifié le ${new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    })}`;
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="group bg-white rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden flex flex-col h-[320px]"
    >
      {/* Visual Preview Area */}
      <div className="flex-1 bg-slate-50 relative overflow-hidden group-hover:bg-slate-100/50 transition-colors flex justify-center pt-8">
        <div className="transform group-hover:scale-105 transition-transform duration-500 shadow-md">
           <CVThumbnail cv={cv} scale={0.25} />
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/60 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2 z-10">
           <Link
             href={`/editor/${cv.id}`}
             className="p-3 bg-white rounded-xl text-slate-600 hover:text-blue-600 hover:scale-110 shadow-lg shadow-slate-200 transition-all"
             title="Éditer"
           >
             <Edit className="w-5 h-5" />
           </Link>
             <Link
             href={`/share/${cv.id}`}
             target="_blank"
             className="p-3 bg-white rounded-xl text-slate-600 hover:text-purple-600 hover:scale-110 shadow-lg shadow-slate-200 transition-all"
             title="Partager"
             onClick={(e) => e.stopPropagation()}
           >
             <Share2 className="w-5 h-5" />
           </Link>
           <a
             href={`/cv/${cv.id}?print=true`}
             target="_blank"
             className="p-3 bg-white rounded-xl text-slate-600 hover:text-green-600 hover:scale-110 shadow-lg shadow-slate-200 transition-all"
             title="Télécharger"
             onClick={(e) => e.stopPropagation()}
           >
             <Download className="w-5 h-5" />
           </a>
           <button
             onClick={() => onDelete(cv.id)}
             className="p-3 bg-white rounded-xl text-slate-600 hover:text-red-500 hover:scale-110 shadow-lg shadow-slate-200 transition-all"
             title="Supprimer"
           >
             <Trash2 className="w-5 h-5" />
           </button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
           <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-slate-600 shadow-sm border border-slate-100 flex items-center gap-1.5 z-10">
              <span className={`w-1.5 h-1.5 rounded-full ${cv.isPublic ? 'bg-green-500' : 'bg-slate-300'}`} />
              {cv.isPublic ? 'Public' : 'Privé'}
           </div>
           {cv.views > 0 && (
             <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-purple-600 shadow-sm border border-slate-100 flex items-center gap-1.5 z-10">
                <Eye className="w-3 h-3" />
                {cv.views}
             </div>
           )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 flex items-center justify-between bg-white relative z-10 border-t border-slate-100">
        <div>
           <h3 className="font-bold text-slate-900 text-base mb-1 truncate max-w-[160px]" title={cv.title}>
             {cv.title}
           </h3>
           <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
             <span>{formatDate(cv.updatedAt)}</span>
           </div>
        </div>

        {/* Circular Progress */}

      </div>
    </motion.div>
  );
}
