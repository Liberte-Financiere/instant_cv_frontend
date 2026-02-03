'use client';

import { CheckCircle, AlertTriangle, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export default function AnalysisResultsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
           <h1 className="text-2xl font-bold text-slate-900">Résultats de l&apos;analyse</h1>
           <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 font-medium">
             Retour au tableau de bord
           </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Score Card */}
           <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center sticky top-8">
                 <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold text-slate-900">85</span>
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 mb-2">Excellent</h2>
                 <p className="text-slate-500 text-sm mb-6">
                   Votre CV est très performant. Quelques ajustements mineurs pourraient le rendre parfait.
                 </p>
                 <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                   Appliquer les suggestions
                 </button>
              </div>
           </div>

           {/* Details */}
           <div className="lg:col-span-2 space-y-6">
              {/* Strengths */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                 <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <div className="p-1.5 bg-green-100 rounded-lg">
                     <CheckCircle className="w-5 h-5 text-green-600" />
                   </div>
                   Points forts
                 </h3>
                 <ul className="space-y-3">
                   {['Structure claire et lisible', 'Utilisation de mots-clés pertinents', 'Coordonnées complètes'].map((item, i) => (
                     <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                       <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                       {item}
                     </li>
                   ))}
                 </ul>
              </div>

              {/* Improvements */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                 <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <div className="p-1.5 bg-amber-100 rounded-lg">
                     <AlertTriangle className="w-5 h-5 text-amber-600" />
                   </div>
                   Améliorations suggérées
                 </h3>
                 <ul className="space-y-4">
                   <li className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Résumé trop court</h4>
                        <p className="text-slate-600 text-xs">Votre résumé professionnel manque de détails sur vos objectifs.</p>
                      </div>
                      <button className="text-amber-700 font-bold text-xs hover:underline self-center">Corriger</button>
                   </li>
                   <li className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Manque de résultats chiffrés</h4>
                        <p className="text-slate-600 text-xs">Ajoutez des métriques (ex: +20% de ventes) dans vos expériences.</p>
                      </div>
                      <button className="text-amber-700 font-bold text-xs hover:underline self-center">Corriger</button>
                   </li>
                 </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
