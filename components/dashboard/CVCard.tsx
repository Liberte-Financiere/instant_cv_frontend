'use client';

import { Edit, Trash2, Download, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CVCardProps {
  id: string;
  title: string;
  updatedAt: Date;
  onDelete: (id: string) => void;
  score?: number; // Optional score for the progress circle
}

export function CVCard({ id, title, updatedAt, onDelete, score = 0 }: CVCardProps) {
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

  // Circular Progress Calculation
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="group bg-white rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden flex flex-col h-[320px]"
    >
      {/* Visual Preview Area */}
      <div className="flex-1 bg-slate-50 relative overflow-hidden group-hover:bg-slate-100/50 transition-colors">
        {/* Mockup - Simplified for elegance */}
        <div className="absolute inset-x-8 top-8 bottom-0 bg-white rounded-t-lg shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] p-4 transform group-hover:translate-y-[-4px] transition-transform duration-500">
           <div className="space-y-3 opacity-30">
              <div className="w-12 h-12 rounded-full bg-slate-200 mb-4" />
              <div className="h-2 bg-slate-200 rounded w-3/4" />
              <div className="h-2 bg-slate-200 rounded w-1/2" />
              <div className="h-32 bg-slate-100 rounded-lg mt-6" />
           </div>
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/60 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
           <Link
             href={`/editor/${id}`}
             className="p-3 bg-white rounded-xl text-slate-600 hover:text-blue-600 hover:scale-110 shadow-lg shadow-slate-200 transition-all"
             title="Éditer"
           >
             <Edit className="w-5 h-5" />
           </Link>
           <button
             className="p-3 bg-white rounded-xl text-slate-600 hover:text-green-600 hover:scale-110 shadow-lg shadow-slate-200 transition-all"
             title="Télécharger"
           >
             <Download className="w-5 h-5" />
           </button>
           <button
             onClick={() => onDelete(id)}
             className="p-3 bg-white rounded-xl text-slate-600 hover:text-red-500 hover:scale-110 shadow-lg shadow-slate-200 transition-all"
             title="Supprimer"
           >
             <Trash2 className="w-5 h-5" />
           </button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-slate-600 shadow-sm border border-slate-100 flex items-center gap-1.5">
           <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
           En ligne
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 flex items-center justify-between bg-white relative z-10">
        <div>
           <h3 className="font-bold text-slate-900 text-base mb-1 truncate max-w-[160px]" title={title}>
             {title}
           </h3>
           <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
             <span>{formatDate(updatedAt)}</span>
           </div>
        </div>

        {/* Circular Progress */}
        <div className="relative w-12 h-12 flex items-center justify-center">
           <svg className="w-full h-full transform -rotate-90">
             <circle
               cx="24"
               cy="24"
               r={radius}
               fill="transparent"
               className="stroke-slate-100"
               strokeWidth="3"
             />
             <circle
               cx="24"
               cy="24"
               r={radius}
               fill="transparent"
               className={cn("transition-all duration-1000 ease-out", getScoreColor(score))}
               strokeWidth="3"
               strokeDasharray={circumference}
               strokeDashoffset={strokeDashoffset}
               strokeLinecap="round"
               stroke="currentColor"
             />
           </svg>
           <span className={cn("absolute text-[10px] font-bold", getScoreColor(score))}>
             {score}%
           </span>
        </div>
      </div>
    </motion.div>
  );
}
