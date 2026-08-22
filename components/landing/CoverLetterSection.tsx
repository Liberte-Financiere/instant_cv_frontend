'use client';

import { motion } from 'framer-motion';
import {FileText, Upload, Clock, CheckCircle2, ArrowRight, Wand2} from 'lucide-react';
import Link from 'next/link';

const benefits = [
  'Structure professionnelle recommandée par les recruteurs',
  'Ton adapté au secteur et au poste visé',
  'Mots-clés alignés avec l\'offre d\'emploi',
  'Personnalisation basée sur votre parcours',
];

const steps = [
  {
    icon: Upload,
    title: 'Importez',
    description: 'Votre CV + l\'offre d\'emploi',
    color: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-50',
  },
  {
    icon: Wand2,
    title: 'L\'IA rédige',
    description: 'Lettre persuasive en 30s',
    color: 'from-purple-500 to-pink-400',
    bg: 'bg-purple-50',
  },
  {
    icon: FileText,
    title: 'Personnalisez',
    description: 'Ajustez le ton & exportez',
    color: 'from-green-500 to-emerald-400',
    bg: 'bg-green-50',
  },
];

export function CoverLetterSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Nouveau — Lettres de Motivation IA
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            Ne perdez plus <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">2 heures</span> à rédiger
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Importez votre CV et l&apos;offre d&apos;emploi. L&apos;IA génère une lettre persuasive, 
            personnalisée et avec la structure recommandée par les recruteurs.
          </p>
        </motion.div>

        {/* Main content: 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Mini steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden" />
                )}
              </motion.div>
            ))}

            {/* Time saved badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mt-8 p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-white font-bold">2h → 30 secondes</p>
                <p className="text-slate-400 text-sm">Temps moyen de rédaction</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Benefits + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            {/* Letter mockup header */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="h-3 w-40 bg-slate-200 rounded-full" />
                  <div className="h-2 w-24 bg-slate-100 rounded-full mt-2" />
                </div>
              </div>
              {/* Skeleton letter lines */}
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-100 rounded-full" />
                <div className="h-2 w-11/12 bg-slate-100 rounded-full" />
                <div className="h-2 w-full bg-slate-100 rounded-full" />
                <div className="h-2 w-9/12 bg-purple-100 rounded-full" />
                <div className="h-2 w-full bg-slate-100 rounded-full" />
                <div className="h-2 w-10/12 bg-slate-100 rounded-full" />
              </div>
              {/* AI badge */}
              <div className="flex items-center gap-1.5 mt-4 text-xs text-purple-600 font-medium">
                <Wand2 className="w-3 h-3" />
                Généré par l&apos;IA en 30 secondes
              </div>
            </div>

            {/* Benefits list */}
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  className="flex items-start gap-3 text-slate-300 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  {benefit}
                </motion.li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link
              href="/dashboard/cover-letters"
              className="group flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              Générer ma lettre gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
