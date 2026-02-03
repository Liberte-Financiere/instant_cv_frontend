'use client';

import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Découverte',
    price: '0',
    currency: 'FCFA',
    description: 'Pour tester et créer votre premier CV.',
    features: [
      '1 CV Gratuit',
      'Modèles Basiques',
      'Export PDF avec filigrane',
      'Suggestions IA limitées'
    ],
    cta: 'Commencer',
    popular: false,
    dark: false
  },
  {
    name: 'Pro',
    price: '3 500',
    currency: 'FCFA',
    period: '/mois',
    description: 'L\'essentiel pour décrocher un job.',
    features: [
      'CV Illimités',
      'Modèles Premium & Design',
      'Coach IA & Anti-Rejet ATS',
      'Lettres de Motivation Illimitées',
      'Export PDF HD sans filigrane',
      'Ciblage de poste (Job Match)'
    ],
    cta: 'Démarrer (Essai gratuit)',
    popular: true,
    dark: true // Highlighted styling
  },
  {
    name: 'Annuel',
    price: '25 000',
    currency: 'FCFA',
    period: '/an',
    description: 'Économisez 40% sur l\'année.',
    features: [
      'Tout inclus (Pack Pro)',
      'Support Prioritaire',
      'Accès aux futurs features',
      'Revue de CV par un Expert (1/an)'
    ],
    cta: 'Devenir Membre',
    popular: false,
    dark: false
  }
];

import { SectionHeader } from '@/components/ui/SectionHeader';

export function Pricing() {
  return (
    <div className="bg-[#f6f6f8] py-20 px-4 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Investissez dans votre avenir"
          description="Des tarifs adaptés à votre réussite. Annulez à tout moment."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.dark 
                  ? 'bg-[#0F172A] text-white shadow-2xl scale-105 z-10' 
                  : 'bg-white text-slate-900 shadow-xl border border-slate-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-4">
                  <span className="bg-[#2463eb] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> Populaire
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${plan.dark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className={`text-sm font-bold ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>{plan.currency}</span>
                  {plan.period && <span className={`text-sm ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>}
                </div>
                <p className={`mt-2 text-sm ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      plan.dark ? 'bg-[#2463eb]/20 text-[#2463eb]' : 'bg-green-100 text-green-600'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={plan.dark ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.dark 
                  ? 'bg-[#2463eb] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
