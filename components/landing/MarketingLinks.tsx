'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Scale, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export function MarketingLinks() {
  return (
    <section className="bg-bg-dark py-24 px-4 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Compare Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-[2rem] p-8 md:p-10 flex flex-col justify-between overflow-hidden bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all duration-300"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-all" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Scale className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                JobSira face à la concurrence
              </h3>
              <p className="text-slate-400 leading-relaxed mb-8 text-lg">
                Vous hésitez encore ? Découvrez pourquoi nos utilisateurs décrochent <span className="text-white font-bold">3x plus d'entretiens</span> en utilisant notre technologie IA optimisée pour les filtres ATS (Applicant Tracking Systems), comparé aux éditeurs classiques.
              </p>
            </div>
            
            <Link href="/compare" className="relative z-10 flex items-center gap-2 text-blue-400 font-bold group-hover:text-blue-300 transition-colors w-fit">
              Comparer les solutions <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Help & Tips Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-[2rem] p-8 md:p-10 flex flex-col justify-between overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-300"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-amber-500/20 transition-all" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
                <Lightbulb className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Besoin d'astuces pour craquer l'algo ?
              </h3>
              <p className="text-slate-400 leading-relaxed mb-8 text-lg">
                Les recruteurs utilisent des robots pour trier les CV. Nous vous donnons les clés pour les déjouer. Plongez dans nos guides exclusifs et transformez votre profil en un véritable <span className="text-white font-bold">aimant à recruteurs</span>.
              </p>
            </div>
            
            <Link href="/help" className="relative z-10 flex items-center gap-2 text-amber-400 font-bold group-hover:text-amber-300 transition-colors w-fit">
              Découvrir nos conseils <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
