'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Briefcase, Search, ArrowRight, Lock, Unlock, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type Tab = {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  description: string;
  action: {
    label: string;
    href: string;
    variant: "primary" | "secondary";
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  mockup: React.ReactNode;
  colorClass: string;
  bgGradient: string;
  glowColor: string;
};

const tabs: Tab[] = [
  {
    id: 'ecole',
    title: 'Écoles & Universités',
    icon: <Building2 className="w-5 h-5" />,
    subtitle: 'Espace École (B2B)',
    description: "Offrez à vos étudiants un accès Premium illimité. Notre portail Admin vous permet de suivre l'évolution des cohortes en temps réel et de booster massivement leur taux d'insertion.",
    action: { label: "Découvrir l'Espace École", href: '/auth', variant: 'primary' },
    colorClass: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100',
    bgGradient: 'from-blue-50 via-white to-white border-slate-200',
    glowColor: 'bg-blue-200/40',
    mockup: (
      <div className="w-full rounded-2xl bg-slate-900 border border-blue-500/20 p-5 space-y-4 shadow-[0_0_50px_rgba(37,99,235,0.1)] transform rotate-y-[-2deg] hover:rotate-0 transition-transform duration-500">
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
    )
  },
  {
    id: 'recruteur',
    title: 'Recruteurs',
    icon: <Search className="w-5 h-5" />,
    subtitle: 'Espace Recruteurs (B2B)',
    description: "Ne perdez plus de temps à chercher. Débloquez instantanément les coordonnées des profils pré-qualifiés qui matchent exactement avec vos besoins techniques.",
    action: { label: "Devenir Recruteur", href: '/recruiter/register', variant: 'secondary' },
    colorClass: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100',
    bgGradient: 'from-blue-50 via-white to-white border-slate-200',
    glowColor: 'bg-blue-200/40',
    mockup: (
      <div className="w-full rounded-2xl bg-white/5 border border-white/10 p-5 space-y-5 backdrop-blur-md transform rotate-y-[5deg] rotate-x-[2deg] hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-black/50">
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
    )
  },
  {
    id: 'jobboard',
    title: 'Espace Emploi',
    icon: <Briefcase className="w-5 h-5" />,
    subtitle: "Place de marché des talents",
    description: "Trouvez votre prochain défi ou recrutez des talents. Parcourez les offres d'emploi (CDI, CDD, Freelance) qui matchent parfaitement avec votre profil généré par l'IA.",
    action: { label: "Rechercher une offre", href: '/jobs', variant: 'primary' },
    secondaryAction: { label: "Publier une offre", href: '/recruiter/jobs/create' },
    colorClass: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100',
    bgGradient: 'from-blue-50 via-white to-white border-slate-200',
    glowColor: 'bg-blue-200/40',
    mockup: (
      <div className="w-full rounded-2xl bg-slate-900 border border-blue-500/20 p-5 space-y-4 shadow-[0_0_50px_rgba(37,99,235,0.1)] transform rotate-y-[-2deg] rotate-x-[2deg] hover:rotate-0 transition-transform duration-500">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Briefcase className="w-5 h-5 text-blue-400" />
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
    )
  }
];

export function B2BMarketplaceSection() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const activeData = tabs[activeTab];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="md:col-span-3 mt-12 bg-white rounded-3xl p-2 sm:p-6 shadow-xl border border-slate-200"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[500px]">
        
        {/* Left Side: Tabs Navigation */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 px-4">Nos Solutions Écosystème</h2>
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border text-left",
                activeTab === idx 
                  ? `${tab.colorClass} scale-105 shadow-lg` 
                  : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "p-3 rounded-xl transition-colors",
                activeTab === idx ? "bg-blue-100/50 text-blue-600" : "bg-slate-100 text-slate-500"
              )}>
                {tab.icon}
              </div>
              <div>
                <div className="font-bold text-lg">{tab.title}</div>
                <div className={cn(
                  "text-sm transition-colors",
                  activeTab === idx ? "text-blue-600/80" : "text-slate-500"
                )}>
                  {tab.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Right Side: Active Content & Mockup */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeData.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={cn(
                "w-full h-full bg-gradient-to-br flex flex-col justify-between p-8 md:p-12 gap-8 md:gap-12",
                activeData.bgGradient
              )}
            >
              {/* Background Glow */}
              <div className={cn("absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-50", activeData.glowColor)} />

              {/* Text Content */}
              <div className="flex-1 space-y-6 relative z-10">
                <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border", activeData.colorClass)}>
                  {activeData.icon} {activeData.subtitle}
                </div>
                
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-950 tracking-tight leading-tight">
                  {activeData.id === 'ecole' && "Le partenaire carrière de vos étudiants"}
                  {activeData.id === 'recruteur' && "Accédez à notre vivier de talents cachés"}
                  {activeData.id === 'jobboard' && "Trouvez votre prochain défi ou recrutez"}
                </h3>
                
                <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl">
                  {activeData.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href={activeData.action.href}>
                    <Button className={cn(
                      "h-12 px-8 text-base font-bold rounded-full transition-all shadow-lg",
                      activeData.action.variant === 'primary'
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25"
                        : "bg-blue-800 text-white hover:bg-blue-900 shadow-blue-800/25"
                    )}>
                      {activeData.action.label}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  {activeData.secondaryAction && (
                    <Link href={activeData.secondaryAction.href}>
                      <Button variant="outline" className="h-12 px-8 text-base font-semibold rounded-full border-slate-300 text-slate-700 hover:bg-slate-100">
                        {activeData.secondaryAction.label}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Mockup */}
              <div className="w-full relative z-10 perspective-1000 flex justify-center mt-auto">
                <div className="w-full max-w-md">
                  {activeData.mockup}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
