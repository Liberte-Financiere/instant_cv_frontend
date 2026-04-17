'use client';

import { Check, Star, Zap, FileText, Languages, Mic, PenLine, Search, BarChart3, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { APP_CONFIG } from '@/lib/config';

const creditActions = [
  { icon: BarChart3, label: 'Analyse de CV', cost: '2 cr.', color: 'text-blue-500' },
  { icon: Search, label: 'Match CV vs Offre', cost: '2 cr.', color: 'text-indigo-500' },
  { icon: FileText, label: 'Lettre de motivation', cost: '2 cr.', color: 'text-violet-500' },
  { icon: PenLine, label: 'Amelioration IA', cost: '1 cr.', color: 'text-emerald-500' },
  { icon: Zap, label: 'Correction / Reformulation', cost: '0.5 cr.', color: 'text-amber-500' },
  { icon: Languages, label: 'Traduction de CV', cost: '10 cr.', color: 'text-cyan-500' },
  { icon: MessageSquare, label: 'Entretien ecrit', cost: '5 cr.', color: 'text-rose-500' },
  { icon: Mic, label: 'Entretien vocal', cost: '1 cr./min', color: 'text-orange-500' },
];

const plans = [
  {
    name: 'Essai Gratuit',
    price: '0',
    currency: 'FCFA',
    description: `${APP_CONFIG.credits.signupBonus} credits offerts a l'inscription.`,
    features: [
      'IA incluse (25 credits)',
      'Creation de CV illimitee',
      'Export PDF Pro illimite',
      'Templates CV & LM gratuits',
      'Credits sans expiration'
    ],
    cta: 'Creer mon compte',
    popular: false,
    dark: false
  },
  {
    name: 'Pack Standard',
    price: '1 000',
    currency: 'FCFA',
    period: ' / achat unique',
    description: '35 credits',
    features: [
      'Valable a vie',
      'Analyse + Match IA',
      'Lettres de motivation IA',
      'Refonte IA de votre CV'
    ],
    cta: 'Explorer',
    popular: true,
    dark: true
  },
  {
    name: 'Pack Premium',
    price: '2 000',
    currency: 'FCFA',
    period: ' / achat unique',
    description: '80 credits',
    features: [
      'Valable a vie',
      'Correction et traduction IA',
      'Entretiens simules IA',
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
    description: '250 credits',
    features: [
      'Valable a vie',
      'Coach IA complet',
      'Entretiens vocaux illimites',
      'Toutes les options'
    ],
    cta: "Voir l'offre",
    popular: false,
    dark: false
  }
];

export function Pricing() {
  return (
    <div id="pricing" className="bg-bg-light py-20 px-4 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Finis les abonnements mensuels"
          description="Achetez des credits et utilisez-les quand vous voulez. Pas d'engagement, pas d'expiration."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h3 className="text-center text-lg font-bold text-slate-800 mb-6">
            Combien coute chaque action ?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {creditActions.map((action) => (
              <div
                key={action.label}
                className="flex flex-col items-center gap-2 rounded-xl bg-white border border-slate-100 shadow-sm p-4 text-center"
              >
                <action.icon className={`w-5 h-5 ${action.color}`} />
                <span className="text-xs text-slate-600 leading-tight">{action.label}</span>
                <span className="text-sm font-bold text-slate-900">{action.cost}</span>
              </div>
            ))}
          </div>
        </motion.div>

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
