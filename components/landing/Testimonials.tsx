'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const testimonials = [
  {
    name: 'Hassan BIKIENGA',
    role: 'Développeur Fullstack',
    quote: "Avant, je passais des heures à ajuster la mise en page de mon CV sur Word. Avec JobSira, je choisis un template professionnel, l'IA m'aide à reformuler mes expériences, et j'exporte un PDF propre en quelques minutes. C'est un vrai gain de temps.",
    rating: 5,
    avatar: 'HB',
    gradient: 'from-blue-500 to-indigo-400',
  },
  {
    name: 'Traore Adama',
    role: 'Entrepreneur',
    quote: "Ce que j'apprécie le plus, c'est la lettre de motivation générée pour chaque offre. Au lieu de repartir de zéro à chaque candidature, l'IA me propose un texte adapté au poste que je peux personnaliser. C'est simple et efficace.",
    rating: 5,
    avatar: 'TA',
    gradient: 'from-amber-500 to-orange-400',
  },
];

export function Testimonials() {
  return (
    <section className="bg-bg-dark py-24 px-4 border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeader
          theme="dark"
          title="Ce qu'en pensent nos utilisateurs"
          description="Des retours honnêtes de personnes qui utilisent JobSira au quotidien."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <p className="text-slate-400 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
