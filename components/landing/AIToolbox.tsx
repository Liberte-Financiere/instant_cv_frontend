'use client';

import { motion } from 'framer-motion';
import { Camera, ClipboardList, Scissors, Globe, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';

const tools = [
  {
    id: 'bilan',
    title: 'Bilan de Compétences',
    badge: 'Nouveau',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    description: 'Analysez votre parcours pour identifier vos forces, obtenir des carrières compatibles avec vos compétences et recevoir des suggestions de formations.',
    icon: ClipboardList,
    color: 'from-amber-500 to-orange-400',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
    visual: (
      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Métier suggéré</span>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-100 shadow-sm">98% match</span>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-800">Directeur de Projet Cloud</div>
          <div className="text-[10px] text-slate-500 leading-normal">Compétences validées : Architecture, Gestion d'équipe, AWS</div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Formation recommandée associée
        </div>
      </div>
    )
  },
  {
    id: 'photo',
    title: 'Photo Pro',
    badge: 'Nouveau',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    description: 'Transformez un simple selfie de smartphone en un portrait professionnel digne d\'un studio de photographie pour votre CV et LinkedIn.',
    icon: Camera,
    color: 'from-purple-500 to-indigo-400',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-600',
    visual: (
      <div className="mt-6 flex items-center justify-around p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-medium">Selfie</div>
          <span className="text-[9px] text-slate-400">Avant</span>
        </div>
        <div className="text-slate-300">➔</div>
        <div className="flex flex-col items-center gap-1.5 relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg relative overflow-hidden">
            <span className="text-white text-xs font-black">PRO</span>
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
          <span className="text-[9px] text-purple-600 font-bold">Studio Pro</span>
        </div>
      </div>
    )
  },
  {
    id: 'remove-bg',
    title: 'Détourage Magique',
    badge: 'Populaire',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    description: 'Isolez instantanément votre portrait en supprimant l\'arrière-plan en un seul clic pour l\'intégrer de manière parfaite sur vos modèles de CV.',
    icon: Scissors,
    color: 'from-blue-500 to-cyan-400',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    visual: (
      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden h-24">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:10px_10px] bg-[position:0_0,0_5px,5px_-5px,-5px_0] opacity-15" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Scissors className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-white px-2.5 py-1 rounded shadow-sm border border-blue-100">Fond supprimé</span>
        </div>
      </div>
    )
  },
  {
    id: 'portfolio',
    title: 'Générateur de Portfolio',
    badge: 'Bientôt',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    description: 'Transformez votre CV statique en un mini-site web portfolio interactif et responsive pour épater les recruteurs.',
    icon: Globe,
    color: 'from-emerald-500 to-teal-400',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    visual: (
      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5 opacity-60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <div className="h-2 w-28 bg-slate-200 rounded-full ml-2" />
        </div>
        <div className="h-10 w-full bg-slate-200 rounded-lg flex items-center justify-center">
          <span className="text-[9px] font-bold text-slate-400">www.mon-portfolio.fr</span>
        </div>
      </div>
    )
  }
];

export function AIToolbox() {
  return (
    <section className="bg-white py-24 px-4 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="La Boîte à Outils Carrière"
          description="Au-delà du simple CV, bénéficiez d'une suite complète d'outils exclusifs pour vous démarquer à chaque étape."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group min-h-[350px]"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${tool.bgLight} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-md`}>
                      <tool.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3">{tool.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{tool.description}</p>
              </div>

              {tool.visual}

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Disponibilité : Immédiate</span>
                <Link
                  href="/auth"
                  className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
                >
                  Découvrir l'outil <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
