'use client';

import { motion } from 'framer-motion';
import { Upload, Sparkles, Download, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const steps = [
  {
    number: '01',
    title: 'Importez votre profil',
    description: 'Collez votre ancien CV ou remplissez vos informations. Notre éditeur intelligent pré-remplit les champs pour vous.',
    icon: Upload,
    color: 'from-blue-500 to-cyan-400',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    number: '02',
    title: "L'IA optimise tout",
    description: "Notre coach IA réécrit vos descriptions, ajoute les bons mots-clés ATS et adapte le ton au poste visé.",
    icon: Sparkles,
    color: 'from-purple-500 to-pink-400',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  {
    number: '03',
    title: 'Téléchargez & Postulez',
    description: "Exportez un PDF HD professionnel en un clic. Votre lettre de motivation est prête aussi.",
    icon: Download,
    color: 'from-green-500 to-emerald-400',
    bgLight: 'bg-green-50',
    textColor: 'text-green-600',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-24 px-4 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Aussi simple que 1, 2, 3"
          description="Pas besoin d'être un expert. En 3 étapes, votre CV professionnel est prêt."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step number circle */}
              <div className={`relative z-10 w-32 h-32 rounded-3xl ${step.bgLight} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Step label */}
              <span className={`text-xs font-bold uppercase tracking-widest ${step.textColor} mb-2`}>
                Étape {step.number}
              </span>

              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed max-w-xs">{step.description}</p>

              {/* Arrow between steps (mobile only) */}
              {index < steps.length - 1 && (
                <div className="md:hidden my-6">
                  <ArrowRight className="w-5 h-5 text-slate-300 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
