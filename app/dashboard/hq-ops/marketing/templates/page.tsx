'use client';

import { Plus, Eye, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { getHtmlForTemplate } from '@/lib/email-templates';

export default function MarketingTemplatesPage() {
  const libraryCategories = ['Tous', 'Annonces', 'Newsletters', 'Transactionnel', 'Sur-mesure'];
  const [activeLibraryCategory, setActiveLibraryCategory] = useState('Tous');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const getPreviewHtml = (templateId: string) => {
    return getHtmlForTemplate(templateId, {
      subject: "Ceci est un exemple de sujet d'e-mail",
      message: "Bonjour, \n\nVoici un aperçu visuel de la structure de ce modèle. Votre texte sera organisé en paragraphes de cette manière.\n\nCe design est conçu pour mettre en valeur votre contenu tout en restant professionnel et lisible sur tous les appareils.",
      buttonText: "Bouton d'exemple",
      buttonUrl: "#"
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
         
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Bibliothèque de Templates</h1>
              <p className="text-slate-500">Gérez et créez des modèles réutilisables pour vos campagnes.</p>
           </div>
           <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2">
             <Plus className="w-4 h-4" />
             Créer un Template
           </button>
         </div>

         {/* Library Sub-nav */}
         <div className="border-b border-slate-200 flex gap-8 mb-8">
           {libraryCategories.map(cat => (
             <button
               key={cat}
               onClick={() => setActiveLibraryCategory(cat)}
               className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
                 activeLibraryCategory === cat 
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
               }`}
             >
               {cat}
             </button>
           ))}
         </div>

         {/* Grid of Templates */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           
           {/* Card 1: Annonce Standard */}
           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
             <div className="h-48 bg-slate-100 relative p-4 flex items-center justify-center">
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-sm">
                 Annonce
               </div>
               {/* Abstract representation of Annonce layout */}
               <div className="w-3/4 h-3/4 bg-white shadow-md rounded-lg overflow-hidden flex flex-col group-hover:scale-105 transition-transform duration-500">
                 <div className="h-8 bg-blue-600 w-full"></div>
                 <div className="p-3">
                   <div className="w-2/3 h-2 bg-slate-800 rounded mb-3"></div>
                   <div className="w-full h-1 bg-slate-200 rounded mb-1.5"></div>
                   <div className="w-full h-1 bg-slate-200 rounded mb-1.5"></div>
                   <div className="w-4/5 h-1 bg-slate-200 rounded mb-3"></div>
                   <div className="w-16 h-4 mx-auto bg-blue-600 rounded"></div>
                 </div>
               </div>
             </div>
             <div className="p-6 flex flex-col flex-1">
               <h3 className="text-lg font-black text-slate-900 mb-2">Annonce Standard</h3>
               <p className="text-sm text-slate-500 mb-6 flex-1">Le modèle classique, clair et professionnel. Idéal pour les newsletters et mises à jour importantes de Jobsira.</p>
               
               <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                 <div className="flex gap-2 w-full">
                   <button 
                     onClick={() => setPreviewTemplate('annonce')}
                     className="flex-1 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                   >
                     <Eye className="w-4 h-4" /> Aperçu
                   </button>
                   <Link href="/dashboard/hq-ops/marketing?template=annonce" className="flex-1 py-2 text-sm font-bold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-colors shadow-sm flex items-center justify-center text-center">
                     Utiliser
                   </Link>
                 </div>
               </div>
             </div>
           </div>

           {/* Card 2: Alerte Promo */}
           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
             <div className="h-48 bg-slate-900 relative p-4 flex items-center justify-center overflow-hidden">
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-sm z-10">
                 Promo
               </div>
               {/* Abstract Promo layout */}
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
               <div className="w-3/4 h-3/4 bg-white shadow-xl rounded-lg overflow-hidden border-2 border-blue-500 flex flex-col relative z-0 group-hover:scale-105 transition-transform duration-500">
                 <div className="h-10 bg-gradient-to-r from-blue-500 to-purple-500 w-full flex items-center justify-center">
                   <div className="w-1/3 h-2 bg-white/80 rounded"></div>
                 </div>
                 <div className="p-3 text-center flex flex-col items-center">
                   <div className="w-1/2 h-2 bg-slate-800 rounded mb-3"></div>
                   <div className="w-full h-1 bg-slate-200 rounded mb-1.5"></div>
                   <div className="w-full h-1 bg-slate-200 rounded mb-3"></div>
                   <div className="w-20 h-5 bg-amber-500 rounded-full mt-1"></div>
                 </div>
               </div>
             </div>
             <div className="p-6 flex flex-col flex-1">
               <h3 className="text-lg font-black text-slate-900 mb-2">Alerte Promo (Flashy)</h3>
               <p className="text-sm text-slate-500 mb-6 flex-1">Design percutant avec dégradés et gros bouton d'action. Parfait pour les réductions ou événements limités.</p>
               
               <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                 <div className="flex gap-2 w-full">
                   <button 
                     onClick={() => setPreviewTemplate('promo')}
                     className="flex-1 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                   >
                     <Eye className="w-4 h-4" /> Aperçu
                   </button>
                   <Link href="/dashboard/hq-ops/marketing?template=promo" className="flex-1 py-2 text-sm font-bold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-colors shadow-sm flex items-center justify-center text-center">
                     Utiliser
                   </Link>
                 </div>
               </div>
             </div>
           </div>

           {/* Card 3: Minimaliste */}
           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
             <div className="h-48 bg-slate-50 relative p-4 flex items-center justify-center">
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-sm">
                 Textuel
               </div>
               {/* Abstract Minimal layout */}
               <div className="w-3/4 h-3/4 bg-white shadow-sm border border-slate-100 rounded p-4 group-hover:-translate-y-1 transition-transform duration-500">
                  <div className="w-2/3 h-2 bg-slate-800 rounded mb-2"></div>
                  <div className="w-full h-px bg-slate-200 mb-3"></div>
                  <div className="w-full h-1 bg-slate-300 rounded mb-1.5"></div>
                  <div className="w-5/6 h-1 bg-slate-300 rounded mb-1.5"></div>
                  <div className="w-full h-1 bg-slate-300 rounded mb-4"></div>
                  <div className="w-1/3 h-1.5 bg-blue-600 rounded"></div>
               </div>
             </div>
             <div className="p-6 flex flex-col flex-1">
               <h3 className="text-lg font-black text-slate-900 mb-2">Défaut Minimaliste</h3>
               <p className="text-sm text-slate-500 mb-6 flex-1">Ressemble à un e-mail personnel. Pas de décoration, juste du texte direct. Idéal pour une relation intime avec les utilisateurs.</p>
               
               <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                 <div className="flex gap-2 w-full">
                   <button 
                     onClick={() => setPreviewTemplate('minimal')}
                     className="flex-1 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                   >
                     <Eye className="w-4 h-4" /> Aperçu
                   </button>
                   <Link href="/dashboard/hq-ops/marketing?template=minimal" className="flex-1 py-2 text-sm font-bold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-colors shadow-sm flex items-center justify-center text-center">
                     Utiliser
                   </Link>
                 </div>
               </div>
             </div>
           </div>

         </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setPreviewTemplate(null)}></div>
          <div className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl h-[85vh] relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-20 relative">
              <h3 className="text-lg font-bold text-slate-800">Aperçu du Template</h3>
              <div className="flex items-center gap-4">
                <Link 
                  href={`/dashboard/hq-ops/marketing?template=${previewTemplate}`} 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
                >
                  Utiliser ce modèle
                </Link>
                <button 
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-100 p-8 overflow-y-auto w-full flex justify-center relative">
               <iframe 
                 srcDoc={getPreviewHtml(previewTemplate)} 
                 className="w-full max-w-[600px] bg-white h-full min-h-[600px] shadow-sm rounded-lg border-0"
                 title="Email Preview"
               />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
