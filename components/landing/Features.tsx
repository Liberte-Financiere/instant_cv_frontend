'use client';

import { motion } from 'framer-motion';
import { Radar, Zap, FileText, Star, ArrowRight, Download } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeatureCard } from '@/components/landing/FeatureCard';

export function Features() {
  return (
    <div className="bg-[#f6f6f8] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader 
          title="Fonctionnalités Intelligentes" 
          description="Une suite d'outils conçue pour passer les barrières technologiques et humaines du recrutement."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Analyse & Fact-Checking (Large, Indigo) */}
          <FeatureCard
            variant="indigo"
            className="md:col-span-2"
            title="Coach IA & Anti-Rejet ATS"
            icon={Radar}
            description={
              <>
                Notre algorithme analyse votre parcours pour maximiser votre impact, tout en garantissant un format 
                <span className="text-white font-medium"> 100% compatible avec les robots recruteurs (ATS)</span>.
              </>
            }
          >
            {/* Visualization */}
            <div className="mt-8 relative h-32 w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="absolute top-4 left-4 right-4 space-y-2">
                  {/* Analysis Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-green-300 bg-green-500/10 px-2 py-1 rounded w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> "Leadership" détecté
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-white bg-blue-500/20 px-2 py-1 rounded border border-blue-500/30">
                        <Radar className="w-3 h-3" /> ATS: 100%
                    </div>
                  </div>
                  {/* Suggestion Tag */}
                  <div className="flex items-center gap-2 text-xs text-red-300 bg-red-500/10 px-2 py-1 rounded w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Retirer : "Microsoft Word"
                  </div>
              </div>
            </div>
          </FeatureCard>

          {/* Card 2: CV Sur-Mesure (White) */}
          <FeatureCard
             className="md:col-span-1 border-slate-100"
             title="Ciblage de Poste"
             icon={Zap}
             description="Collez une offre d'emploi, et l'IA réécrit votre CV pour qu'il matche parfaitement les mots-clés attendus."
          >
            <div className="w-full h-24 rounded-xl bg-slate-50 border border-slate-100 p-3 relative overflow-hidden">
               <div className="text-[10px] text-slate-400 font-mono">
                  Offre : "Senior Dev React required..."<br/>
                  <span className="text-blue-600 font-bold">Matching : 98%</span>
               </div>
            </div>
          </FeatureCard>

          {/* Card 3: Lettre de Motivation (White) */}
          <FeatureCard
            className="md:col-span-1 border-slate-100"
            title="Lettre de Motivation"
            icon={FileText}
            description="Ne perdez plus 2h à rédiger. L'IA génère une lettre persuasive et personnalisée."
          >
             <div className="mt-auto flex items-center gap-2 text-purple-600 font-bold text-sm">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                Génération auto
             </div>
          </FeatureCard>

          {/* Card 4: Vitesse / Speed (White) */}
          <FeatureCard
            className="md:col-span-1 border-slate-100"
            title="Ultra Rapide"
            icon={Zap}
            description="Importez votre ancien CV ou LinkedIn. Le design est prêt en moins de 2 minutes."
          >
             <div className="w-full h-24 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 p-4 relative overflow-hidden flex items-center justify-center">
                <div className="flex items-center gap-3">
                   <div className="text-3xl font-black text-orange-400">02:00</div>
                   <div className="text-xs font-bold text-orange-300 uppercase tracking-widest">Minutes<br/>Chrono</div>
                </div>
             </div>
          </FeatureCard>

          {/* Card 5: Export HD (White - NEW) */}
          <FeatureCard
            className="md:col-span-1 border-slate-100"
            title="Export PDF HD"
            icon={Download}
            description="PDF vectoriel ultra-net, compatible ATS et lisible sur tous les appareils."
          >
             <div className="w-full h-24 rounded-xl bg-slate-50 border border-slate-100 p-4 relative overflow-hidden flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                   <Download className="w-6 h-6 mb-1" />
                   <div className="text-[10px] font-mono border border-slate-200 px-2 py-1 rounded bg-white">
                      CV_Final_2024.pdf
                   </div>
                </div>
             </div>
          </FeatureCard>

          {/* Card 6: Templates Premium (Full Width) */}
          <div className="md:col-span-3 bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex flex-col md:flex-row items-center gap-8 hover:-translate-y-1 transition-transform">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold uppercase tracking-wider mb-4">
                <Star className="w-3 h-3 fill-current" /> Premium
              </div>
              <h3 className="text-[#0F172A] text-2xl font-bold mb-3">Templates de Classe Mondiale</h3>
              <p className="text-slate-500 mb-6">Modernes, Créatifs ou Exécutifs. Choisissez parmi une galerie conçue par des experts en recrutement.</p>
              <button className="text-[#2463eb] font-bold hover:underline flex items-center gap-1">
                Voir la galerie <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 w-full relative h-48 md:h-64 flex items-center justify-center overflow-hidden">
               {/* Gallery of Miniatures */}
               <div className="flex gap-4 absolute left-1/2 -translate-x-1/2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`w-32 h-44 bg-slate-100 rounded shadow-md border border-slate-200 transform ${i%2===0 ? 'translate-y-4' : '-translate-y-4'} transition-transform hover:scale-105`}>
                       <div className="h-2 w-16 bg-white/50 m-2 rounded" />
                       <div className="space-y-2 p-2">
                          <div className="h-1 w-full bg-slate-200 rounded" />
                          <div className="h-1 w-full bg-slate-200 rounded" />
                          <div className="h-1 w-2/3 bg-slate-200 rounded" />
                       </div>
                    </div>
                  ))}
               </div>
               <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
