'use client';

import { useState } from 'react';
import { Edit, Trash2, Download, Clock, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CV } from '@/types/cv';
import { CVThumbnail } from './CVThumbnail';
import { ShareButton } from '@/components/ui/ShareButton';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/lib/config';

interface CVCardProps {
  cv: CV;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, currentIsPublic: boolean) => void;
  score?: number; // Optional score for the progress circle
}

export function CVCard({ cv, onDelete, onToggleVisibility, score = 0 }: CVCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownloadPDF = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isDownloading) return;

    setIsDownloading(true);
    const toastId = toast.loading('Génération du PDF...');

    try {
      const res = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cv.id }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Erreur lors de la génération du PDF');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cv.personalInfo?.firstName || 'CV'}_${cv.personalInfo?.lastName || ''}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('PDF téléchargé !', { id: toastId });
    } catch (error: any) {
      console.error('PDF download failed:', error);
      toast.error(error.message || 'Erreur lors du téléchargement.', { id: toastId });
    } finally {
      setIsDownloading(false);
    }
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

        {/* Overlay Actions — always visible on mobile, hover on desktop */}
        <div className="absolute inset-0 bg-white/60 lg:bg-white/0 lg:group-hover:bg-white/60 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 gap-2 z-10">
           <Link
             href={`/editor/${cv.id}`}
             className="p-3 bg-white rounded-xl text-slate-600 hover:text-blue-600 hover:scale-110 shadow-lg shadow-slate-200 transition-all"
             title="Éditer"
           >
             <Edit className="w-5 h-5" />
           </Link>
             <ShareButton 
               url={`/share/${cv.id}`}
               title={`Mon CV ${APP_CONFIG.name}`}
               text={`Découvrez mon CV "${cv.title}" créé avec ${APP_CONFIG.name}`}
             />
           <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="p-3 bg-white rounded-xl text-slate-600 hover:text-green-600 hover:scale-110 shadow-lg shadow-slate-200 transition-all disabled:opacity-50"
              title="Télécharger PDF"
           >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
           </button>
           <button
             onClick={(e) => {
               e.stopPropagation();
               if (confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
                 onDelete(cv.id);
               }
             }}
             className="p-3 bg-white rounded-xl text-slate-600 hover:text-red-500 hover:scale-110 shadow-lg shadow-slate-200 transition-all"
             title="Supprimer"
           >
             <Trash2 className="w-5 h-5" />
           </button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
           <button
             onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(cv.id, cv.isPublic);
             }}
             className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 shadow-sm border border-slate-100 flex items-center gap-2 z-10 hover:bg-white hover:scale-105 transition-all active:scale-95 group/badge cursor-pointer"
             title={cv.isPublic ? "Désactiver le partage" : "Rendre public pour partager"}
           >
              <div className="relative flex items-center justify-center">
                 <span className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    cv.isPublic ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-slate-300 group-hover/badge:bg-slate-400"
                 )} />
              </div>
              <span className="min-w-[40px] text-center font-bold">
                {cv.isPublic ? 'Public' : 'Privé'}
              </span>
           </button>
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

