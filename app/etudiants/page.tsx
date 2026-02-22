'use client';

import { motion } from 'framer-motion';
import { GraduationCap, FileText, Brain, Sparkles, Target, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';

const benefits = [
  {
    icon: Brain,
    title: 'Valorisez vos projets académiques',
    desc: 'Pas d\'expérience professionnelle ? L\'IA reformule vos projets scolaires, travaux de groupe et mémoires en compétences concrètes que les recruteurs recherchent.',
  },
  {
    icon: FileText,
    title: 'Templates adaptés aux débutants',
    desc: 'Des modèles de CV pensés pour les profils juniors : mise en avant de la formation, des compétences techniques et des soft skills plutôt que des années d\'expérience.',
  },
  {
    icon: Target,
    title: 'Lettres de motivation ciblées',
    desc: 'Pour chaque offre de stage ou premier emploi, générez une lettre personnalisée qui montre votre motivation et votre potentiel, pas juste un texte générique.',
  },
  {
    icon: Sparkles,
    title: 'Gratuit pour commencer',
    desc: '25 crédits offerts dès l\'inscription. Assez pour créer votre CV, générer plusieurs lettres de motivation et postuler à vos premières offres.',
  },
];

export default function EtudiantsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-bg-dark pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
          
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                Étudiants & Jeunes Diplômés
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Votre premier CV pro,<br />
                <span className="text-emerald-400">même sans expérience.</span>
              </h1>
              
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                Vous débutez votre carrière et vous ne savez pas quoi mettre sur votre CV ? 
                JobSira transforme votre parcours académique en un profil attractif pour les recruteurs.
              </p>

              <Link
                href="/auth"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-emerald-500/25"
              >
                Créer mon CV gratuitement <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
              Comment JobSira vous aide
            </h2>
            <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
              Des outils pensés pour les profils en début de carrière.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <b.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{b.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-bg-dark py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Prêt à décrocher votre premier stage ?</h2>
            <p className="text-slate-400 mb-8">
              Inscription gratuite, 25 crédits offerts, aucune carte bancaire requise.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all"
            >
              Commencer maintenant <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
