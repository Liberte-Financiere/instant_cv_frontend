'use client';

import { motion } from 'framer-motion';
import { Radar, Zap, FileText, Star, ArrowRight, Download, WifiOff, Mic, Briefcase, Lock, Unlock, Building2, Users, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { APP_CONFIG } from '@/lib/config';

export function Features() {
  return (
    <div id="features" className="bg-bg-light py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader 
          title="Fonctionnalités Intelligentes" 
          description="Une suite d&apos;outils conçue pour passer les barrières technologiques et humaines du recrutement."
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
                Importez votre CV : notre algorithme analyse votre parcours pour maximiser vos points forts, identifier les axes d&apos;amélioration et cibler les postes idéaux. Le tout en garantissant un format 
                <span className="text-white font-medium"> 100% compatible ATS</span>.
              </>
            }
          >
            {/* Visualization */}
            <div className="mt-8 relative h-32 w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="absolute top-4 left-4 right-4 space-y-2">
                  {/* Analysis Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-green-300 bg-green-500/10 px-2 py-1 rounded w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> &quot;Leadership&quot; détecté
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-white bg-blue-500/20 px-2 py-1 rounded border border-blue-500/30">
                        <Radar className="w-3 h-3" /> ATS: 100%
                    </div>
                  </div>
                  {/* Suggestion Tag */}
                  <div className="flex items-center gap-2 text-xs text-red-300 bg-red-500/10 px-2 py-1 rounded w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Retirer : &quot;Microsoft Word&quot;
                  </div>
                  {/* Job Match Tag */}
                  <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 px-2 py-1 rounded w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Poste suggéré : Chef de Projet
                  </div>

              </div>
            </div>
          </FeatureCard>

          {/* Card 2: CV Sur-Mesure (White) */}
          <FeatureCard
             className="md:col-span-1 border-slate-100"
             title="Ciblage de Poste"
             icon={Zap}
             description="Collez une offre d&apos;emploi, et l&apos;IA réécrit votre CV pour qu&apos;il matche parfaitement les mots-clés attendus."
          >
            <div className="w-full h-24 rounded-xl bg-slate-50 border border-slate-100 p-3 relative overflow-hidden">
               <div className="text-[10px] text-slate-400 font-mono">
                  Offre : &quot;Senior Dev React required...&quot;<br/>
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

          {/* Card 6: Offline / PWA */}
          <FeatureCard
            className="md:col-span-1 border-slate-100"
            title="Accès Hors-ligne"
            icon={WifiOff}
            description={`Installez ${APP_CONFIG.name} sur votre téléphone pour consulter vos CVs, lettres et historiques sans connexion.`}
          >
             <div className="w-full h-24 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4 relative overflow-hidden flex items-center justify-center">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                     <WifiOff className="w-5 h-5 text-emerald-600" />
                   </div>
                   <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Mode<br/>Offline</div>
                </div>
             </div>
          </FeatureCard>

          {/* Card 6b: Simulation d'Entretien IA (md:col-span-2) */}
          <FeatureCard
            className="md:col-span-2 border-slate-100"
            title="Entretien IA"
            icon={Mic}
            description="Entraînez-vous avec notre recruteur IA interactif pour être prêt le jour J."
          >
             <div className="w-full h-24 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4 relative overflow-hidden flex flex-col items-center justify-center gap-2">
                 <div className="flex gap-1 items-center">
                   <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                   <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-75" />
                   <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-150" />
                 </div>
                 <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider text-center">
                    Simulateur<br/>Vocal
                 </div>
             </div>
          </FeatureCard>

          {/* B2B School Promo Banner (Full Width) */}
          <div className="md:col-span-3 mt-4 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-blue-500/20 flex flex-col md:flex-row-reverse items-center gap-12 hover:border-blue-500/40 transition-colors relative overflow-hidden">
            {/* Subtle Vercel-like blue glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex-1 text-left space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                <Building2 className="w-4 h-4" /> Espace École (B2B)
              </div>
              <h3 className="text-white text-3xl md:text-4xl font-bold tracking-tight">Le partenaire carrière de vos étudiants</h3>
              <p className="text-slate-400 text-lg leading-relaxed font-light">
                Offrez à vos étudiants un accès Premium illimité. Notre portail Admin vous permet de suivre l'évolution des cohortes en temps réel et de booster massivement leur taux d'insertion.
              </p>
              <Link href="/auth" className="inline-block mt-4">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 text-base font-semibold rounded-full shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all">
                  Découvrir l'Espace École
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="flex-1 w-full max-w-md perspective-1000 relative z-10">
               {/* UI Mockup for School Admin */}
               <div className="w-full rounded-2xl bg-slate-900 border border-blue-500/20 p-5 space-y-4 shadow-[0_0_50px_rgba(37,99,235,0.1)] transform rotate-y-[2deg] hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Gestion de Cohorte</div>
                        <div className="text-xs text-slate-500">Master 2 • 2026</div>
                      </div>
                    </div>
                    <div className="text-xs font-medium bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20">
                      150 Crédits
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                     {[1, 2, 3].map((i) => (
                       <div key={i} className="flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/5">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-slate-700" />
                             <div className="h-2 w-16 bg-slate-600 rounded" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            <div className="h-2 w-10 bg-slate-600 rounded" />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* B2B Promo Banner (Full Width) */}
          <div className="md:col-span-3 mt-4 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-blue-500/20 flex flex-col md:flex-row items-center gap-12 hover:border-blue-500/40 transition-colors">
            <div className="flex-1 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20">
                <Briefcase className="w-4 h-4" /> Espace Recruteurs (B2B)
              </div>
              <h3 className="text-white text-3xl md:text-4xl font-bold tracking-tight">Accédez à notre vivier de talents cachés</h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                Ne perdez plus de temps à chercher. Débloquez instantanément les coordonnées des profils pré-qualifiés qui matchent exactement avec vos besoins techniques.
              </p>
              <Link href="/recruiter/register" className="inline-block mt-2">
                <Button className="bg-white text-slate-900 hover:bg-slate-100 h-12 px-8 text-base font-bold">
                  Devenir Recruteur
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="flex-1 w-full max-w-md perspective-1000">
               {/* UI Mockup for B2B */}
               <div className="w-full rounded-2xl bg-white/5 border border-white/10 p-5 space-y-5 backdrop-blur-md transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-black/50">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border border-blue-500/30">
                        <span className="text-blue-400 font-bold text-lg">A.S.</span>
                      </div>
                      <div>
                        <div className="text-base font-bold text-white">Profil Anonymisé</div>
                        <div className="text-xs text-slate-400">DevOps Senior • Paris</div>
                      </div>
                    </div>
                    <div className="text-xs font-bold bg-green-500/10 text-green-400 px-2.5 py-1.5 rounded-lg border border-green-500/20">
                      Match: 98%
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10">Kubernetes</span>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10">Docker</span>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10">AWS</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full mt-5">
                      <div className="w-[98%] h-full bg-gradient-to-r from-blue-500 to-green-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                      <Lock className="w-4 h-4" />
                      Contact masqué
                    </div>
                    <div className="text-sm font-bold text-white bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20">
                      <Unlock className="w-4 h-4" />
                      Débloquer (1 cr.)
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Job Board Promo Banner (Full Width) */}
          <div className="md:col-span-3 mt-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-indigo-500/20 flex flex-col md:flex-row items-center gap-12 hover:border-indigo-500/40 transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex-1 text-left space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20">
                <Briefcase className="w-4 h-4" /> Place de Marché de l'Emploi
              </div>
              <h3 className="text-white text-3xl md:text-4xl font-bold tracking-tight">Trouvez votre prochain défi ou recrutez des talents</h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                Jobsira intègre désormais un Job Board public. Parcourez les offres d'emploi (CDI, CDD, Freelance) qui matchent parfaitement avec votre profil généré par l'IA, ou publiez vos propres offres 100% gratuitement !
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Link href="/jobs" className="inline-block">
                  <Button className="bg-indigo-600 text-white hover:bg-indigo-700 h-12 px-8 text-base font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] rounded-full">
                    Rechercher une offre
                    <Search className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/recruiter/jobs/create" className="inline-block">
                  <Button variant="outline" className="text-slate-300 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5 h-12 px-8 text-base font-semibold rounded-full">
                    Publier une offre (Gratuit)
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-md perspective-1000 relative z-10">
               {/* UI Mockup for Job Board */}
               <div className="w-full rounded-2xl bg-slate-900 border border-indigo-500/20 p-5 space-y-4 shadow-[0_0_50px_rgba(79,70,229,0.1)] transform rotate-y-[-5deg] rotate-x-[2deg] hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <Briefcase className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Développeur Fullstack</div>
                        <div className="text-xs text-slate-400">TechCorp • Paris (Hybride)</div>
                      </div>
                    </div>
                    <div className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
                      95% Match
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                     <p className="text-sm text-slate-400 line-clamp-2">Rejoignez une équipe dynamique. Missions : React, Node.js, et PostgreSQL en environnement cloud natif.</p>
                     <div className="flex gap-2">
                        <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-slate-300 border border-white/10">React</span>
                        <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-slate-300 border border-white/10">Node.js</span>
                        <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-slate-300 border border-white/10">TypeScript</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Card 7: Templates Premium (Full Width) */}
          <div className="md:col-span-3 bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex flex-col md:flex-row items-center gap-8 hover:-translate-y-1 transition-transform">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold uppercase tracking-wider mb-4">
                <Star className="w-3 h-3 fill-current" /> Premium
              </div>
              <h3 className="text-bg-dark text-2xl font-bold mb-3">Templates de Classe Mondiale</h3>
              <p className="text-slate-500 mb-6">Modernes, Créatifs ou Exécutifs. Choisissez parmi une galerie conçue par des experts en recrutement.</p>
              <Link href="/auth" className="text-primary font-bold hover:underline flex items-center gap-1">
                Voir la galerie <ArrowRight className="w-4 h-4" />
              </Link>
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
