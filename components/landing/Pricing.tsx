'use client';

import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const plans = [
  {
    name: 'Essai Gratuit',
    price: '0',
    currency: 'FCFA',
    description: '25 crédits offerts dès l\'inscription.',
    features: [
      'IA incluse mais limitée (25 cr.)',
      'Générer des CV',
      'Lettres de motivation',
      'Analyse de CV',
      'Export PDF Pro illimité',
      'Design et couleurs illimités',
      'Templates CV & LM gratuits',
      'Crédits sans expiration'
    ],
    cta: 'Créer mon compte',
    popular: false,
    dark: false
  },
  {
    name: 'Pack Standard',
    price: '1 000',
    currency: 'FCFA',
    period: ' / achat unique',
    description: '35 crédits - L\'essentiel pour postuler.',
    features: [
      'Valable à vie',
      'Création et modifications libres',
      'Refonte IA de votre CV',
      'Lettres pour chaque offre'
    ],
    cta: 'Explorer',
    popular: true,
    dark: true // Highlighted styling
  },
  {
    name: 'Pack Premium',
    price: '2 000',
    currency: 'FCFA',
    period: ' / achat unique',
    description: '80 crédits - Pour postuler activement.',
    features: [
      'Valable à vie',
      'Correction et traduction',
      'Analyse CV vs Offre IA',
      'Multiples versions de CV'
    ],
    cta: 'En savoir plus',
    popular: false,
    dark: false
  },
  {
    name: 'Pack Pro',
    price: '5 000',
    currency: 'FCFA',
    period: ' / achat unique',
    description: '250 crédits - La tranquillité ultime.',
    features: [
      'Valable à vie',
      'Création sans limite',
      'Coach IA complet à disposition',
      'Toutes les options débloquées'
    ],
    cta: 'Voir l\'offre',
    popular: false,
    dark: false
  }
];

import { SectionHeader } from '@/components/ui/SectionHeader';

export function Pricing() {
  return (
    <div id="pricing" className="bg-[#f6f6f8] py-20 px-4 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Finis les abonnements mensuels"
          description="Achetez uniquement les crédits IA dont vous avez besoin."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 ${
                plan.dark 
                  ? 'bg-bg-dark text-white shadow-2xl md:scale-105 z-10' 
                  : 'bg-white text-slate-900 shadow-xl border border-slate-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-4">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
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
                      plan.dark ? 'bg-primary/20 text-primary' : 'bg-green-100 text-green-600'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={plan.dark ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth">
                <button className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.dark 
                    ? 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}>
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
