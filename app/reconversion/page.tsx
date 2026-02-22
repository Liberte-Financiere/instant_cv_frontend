'use client';

import { motion } from 'framer-motion';
import { RefreshCw, Lightbulb, PenTool, Route, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';

const benefits = [
  {
    icon: Lightbulb,
    title: 'Identifiez vos compétences transférables',
    desc: 'Vous avez de l\'expérience, mais dans un autre domaine. L\'IA identifie les compétences de votre ancien métier qui sont valorisées dans votre nouveau secteur.',
  },
  {
    icon: PenTool,
    title: 'Reformulez votre parcours',
    desc: 'Vos années d\'expérience ne sont pas perdues. L\'IA traduit votre vécu professionnel dans le vocabulaire de votre futur métier pour que les recruteurs comprennent votre valeur.',
  },
  {
    icon: Route,
    title: 'Racontez votre transition',
    desc: 'La lettre de motivation est cruciale en reconversion. Elle doit expliquer votre parcours, votre motivation et pourquoi ce changement a du sens. L\'IA structure cet argumentaire.',
  },
  {
    icon: RefreshCw,
    title: 'Testez plusieurs orientations',
    desc: 'Pas encore sûr de votre nouveau chemin ? Générez plusieurs versions de votre CV pour différents secteurs et comparez ce qui fonctionne le mieux.',
  },
];

export default function ReconversionPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-bg-dark pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
          
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <RefreshCw className="w-4 h-4" />
                Reconversion Professionnelle
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Changez de carrière,<br />
                <span className="text-orange-400">pas de confiance.</span>
              </h1>
              
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                Votre expérience passée est un atout, pas un obstacle. 
                JobSira vous aide à présenter votre parcours comme une force pour convaincre dans votre nouveau domaine.
              </p>

              <Link
                href="/auth"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-orange-500/25"
              >
                Commencer ma reconversion <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
              Comment JobSira facilite votre transition
            </h2>
            <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
              Des outils pour transformer votre expérience passée en opportunité future.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-6 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <b.icon className="w-6 h-6 text-orange-600" />
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
            <h2 className="text-3xl font-bold text-white mb-4">Prêt pour un nouveau départ ?</h2>
            <p className="text-slate-400 mb-8">
              Inscription gratuite, 25 crédits offerts, aucune carte bancaire requise.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all"
            >
              Commencer maintenant <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
