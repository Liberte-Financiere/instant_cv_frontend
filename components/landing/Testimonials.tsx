'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const testimonials = [
  {
    name: 'Aminata K.',
    role: 'Développeuse Frontend',
    company: 'Recrutée chez Orange',
    quote: "J'ai postulé avec un CV générique pendant 3 mois sans résultat. Avec OptiJob, j'ai eu 4 entretiens en 2 semaines. Le ciblage de poste est magique.",
    rating: 5,
    avatar: 'AK',
    gradient: 'from-pink-500 to-rose-400',
  },
  {
    name: 'Ibrahim S.',
    role: 'Étudiant en Master',
    company: 'Stage chez Deloitte',
    quote: "En tant qu'étudiant, je ne savais pas comment valoriser mon profil. L'IA a transformé mes projets scolaires en compétences concrètes. Résultat : stage décroché du premier coup.",
    rating: 5,
    avatar: 'IS',
    gradient: 'from-blue-500 to-indigo-400',
  },
  {
    name: 'Fatou D.',
    role: 'Ex-Comptable → UX Designer',
    company: 'Reconversion réussie',
    quote: "OptiJob a su traduire 8 ans de comptabilité en compétences UX : rigueur analytique, gestion de données, attention au détail. Mon nouveau CV raconte une vraie histoire.",
    rating: 5,
    avatar: 'FD',
    gradient: 'from-amber-500 to-orange-400',
  },
];

export function Testimonials() {
  return (
    <section className="bg-bg-dark py-24 px-4 border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          theme="dark"
          title="Ils ont décroché le job"
          description="Des candidats comme vous qui ont transformé leur recherche d'emploi."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col hover:bg-white/[0.08] transition-colors"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary/40 mb-4 -scale-x-100" />

              {/* Quote text */}
              <p className="text-slate-300 leading-relaxed flex-1 text-sm">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Stars */}
              <div className="flex gap-1 my-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role} — {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
