'use client';

import { motion } from 'framer-motion';
import { Briefcase, BarChart3, Shield, FileSearch, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { APP_CONFIG } from '@/lib/config';

const benefits = [
  {
    icon: BarChart3,
    title: 'Mettez en avant vos résultats',
    desc: 'L\'IA vous aide à quantifier vos réalisations : chiffre d\'affaires généré, équipes managées, projets livrés. Les recruteurs veulent des preuves, pas des listes de tâches.',
  },
  {
    icon: Shield,
    title: 'Passez les filtres ATS',
    desc: `Les grandes entreprises utilisent des logiciels pour filtrer les CV avant même qu'un humain ne les lise. ${APP_CONFIG.name} optimise vos mots-clés pour que votre CV passe ces filtres.`,
  },
  {
    icon: FileSearch,
    title: 'CV adapté à chaque poste',
    desc: 'Un seul CV ne suffit plus. Générez des versions ciblées pour chaque offre, avec les compétences et le vocabulaire que le recruteur recherche spécifiquement.',
  },
  {
    icon: Briefcase,
    title: 'Lettres de motivation stratégiques',
    desc: 'Pour des postes de direction ou de management, la lettre doit montrer votre vision. L\'IA vous aide à structurer un argumentaire professionnel adapté au poste visé.',
  },
];

export default function ProfessionnelsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-bg-dark pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
          
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                Professionnels & Cadres
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Votre expérience mérite<br />
                <span className="text-blue-400">un CV à la hauteur.</span>
              </h1>
              
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                Vous avez des années d&apos;expérience mais votre CV ne reflète pas votre valeur ? 
                {APP_CONFIG.name} structure vos réalisations pour maximiser votre impact auprès des recruteurs.
              </p>

              <Link
                href="/auth"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-blue-500/25"
              >
                Optimiser mon CV <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
              Pourquoi les professionnels choisissent {APP_CONFIG.name}
            </h2>
            <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
              Des outils conçus pour les profils expérimentés qui visent haut.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <b.icon className="w-6 h-6 text-blue-600" />
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
            <h2 className="text-3xl font-bold text-white mb-4">Prêt à viser plus haut ?</h2>
            <p className="text-slate-400 mb-8">
              Inscription gratuite, {APP_CONFIG.credits.signupBonus} crédits offerts, aucune carte bancaire requise.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all"
            >
              Commencer maintenant <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
