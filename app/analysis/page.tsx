'use client';

import { Upload, FileText, Sparkles } from 'lucide-react';

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
           <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold text-sm mb-6">
             <Sparkles className="w-4 h-4" />
             Magic Analyzer
           </div>
           <h1 className="text-4xl font-bold text-slate-900 mb-4">Analysez votre CV avec l&apos;IA</h1>
           <p className="text-lg text-slate-500">
             Déposez votre CV actuel (PDF) pour obtenir un score, des corrections et des suggestions d&apos;amélioration instantanées.
           </p>
        </div>

        <div className="bg-white border-2 border-dashed border-purple-200 rounded-3xl p-12 text-center hover:border-purple-400 transition-colors cursor-pointer group">
           <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
             <Upload className="w-10 h-10 text-purple-600" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-2">Glissez-déposez votre CV ici</h3>
           <p className="text-slate-500 mb-8">ou cliquez pour sélectionner un fichier (PDF uniquement)</p>
           
           <button className="px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all active:scale-95">
             Sélectionner un fichier
           </button>
        </div>
      </div>
    </div>
  );
}
