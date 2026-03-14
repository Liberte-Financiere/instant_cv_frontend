'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { APP_CONFIG } from '@/lib/config';
import Image from 'next/image';

interface Feedback {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  rating: number;
  image: string | null;
  gradient: string;
}

export function TestimonialsClient({ testimonials }: { testimonials: Feedback[] }) {
  if (!testimonials || testimonials.length === 0) {
    return null; // Do not render section if there are no testimonials
  }

  return (
    <section className="bg-bg-dark py-24 px-4 border-t border-white/5 relative overflow-hidden" id="testimonials">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeader
          theme="dark"
          title="Ce qu'en pensent nos utilisateurs"
          description={`Des retours honnêtes de personnes qui utilisent ${APP_CONFIG.name} au quotidien.`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col hover:bg-white/[0.08] transition-colors"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary/40 mb-4 -scale-x-100" />

              {/* Quote text */}
              <p className="text-slate-300 leading-relaxed flex-1 text-sm italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Stars */}
              <div className="flex gap-1 my-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-auto">
                <div className={`w-10 h-10 relative rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold overflow-hidden`}>
                  {t.image ? (
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  ) : (
                    <span className="text-sm">{(t.name || 'U').substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{t.name || 'Utilisateur Anonyme'}</p>
                  <p className="text-slate-400 text-xs">{t.role || 'Utilisateur'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
