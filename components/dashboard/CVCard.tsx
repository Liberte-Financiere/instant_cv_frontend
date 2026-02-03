'use client';

import { Edit, Trash2, Calendar, Download } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CVCardProps {
  id: string;
  title: string;
  updatedAt: Date;
  onDelete: (id: string) => void;
}

export function CVCard({ id, title, updatedAt, onDelete }: CVCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden"
    >
      {/* Visual Preview */}
      <div className="aspect-[3/4] bg-slate-100 relative p-4 overflow-hidden">
        {/* Mockup Content */}
        <div className="w-full h-full bg-white shadow-sm rounded-lg p-3 text-[5px] text-slate-300 space-y-2 select-none pointer-events-none transform group-hover:scale-105 transition-transform duration-500">
           <div className="flex gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-slate-200" />
              <div className="space-y-1">
                 <div className="w-16 h-1 bg-slate-300 rounded" />
                 <div className="w-10 h-1 bg-slate-200 rounded" />
              </div>
           </div>
           <div className="w-full h-1 bg-slate-200 rounded" />
           <div className="w-5/6 h-1 bg-slate-200 rounded" />
           <div className="w-full h-1 bg-slate-200 rounded" />
           <div className="mt-4 p-2 bg-blue-50/50 rounded">
              <div className="w-1/2 h-1 bg-blue-200 rounded mb-1" />
           </div>
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-[#0F172A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <Link
            href={`/editor/${id}`}
            className="p-3 bg-white rounded-xl text-slate-700 hover:text-blue-600 hover:scale-110 transition-all shadow-lg"
            title="Éditer"
          >
            <Edit className="w-5 h-5" />
          </Link>
          <button
            onClick={() => {}} 
            className="p-3 bg-white rounded-xl text-slate-700 hover:text-green-600 hover:scale-110 transition-all shadow-lg"
            title="Télécharger PDF"
          >
             <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-3 bg-white rounded-xl text-slate-700 hover:text-red-500 hover:scale-110 transition-all shadow-lg"
            title="Supprimer"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Footer */}
      <div className="p-4 border-t border-slate-100 bg-white relative z-10">
        <h3 className="font-bold text-slate-900 truncate mb-1" title={title}>
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>Modifié le {formatDate(updatedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
}
