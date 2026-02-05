'use client';

import { FileText, Plus, ArrowRight, Wand2 } from 'lucide-react';
import Link from 'next/link';

export default function CoverLettersPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            Mes Lettres de Motivation
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Gérez et personnalisez vos lettres de motivation pour chaque candidature.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          Nouvelle Lettre
        </button>
      </div>

      {/* Empty State / Placeholder */}
      <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Wand2 className="w-10 h-10 text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Aucune lettre créée</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
          Utilisez notre assistant IA pour générer une lettre de motivation percutante en quelques secondes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group text-left">
             <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4 border border-slate-100">
               <Wand2 className="w-5 h-5 text-purple-600" />
             </div>
             <h4 className="font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">Générer avec l&apos;IA</h4>
             <p className="text-sm text-slate-500">À partir de votre CV et d&apos;une offre d&apos;emploi.</p>
          </div>
          
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group text-left">
             <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4 border border-slate-100">
               <FileText className="w-5 h-5 text-blue-600" />
             </div>
             <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">Rédiger manuellement</h4>
             <p className="text-sm text-slate-500">Utilisez nos modèles professionnels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
