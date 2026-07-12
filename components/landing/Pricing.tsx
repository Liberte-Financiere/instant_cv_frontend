'use client';

import { useState } from 'react';
import { Check, Star, Zap, FileText, Languages, Mic, PenLine, Search, BarChart3, MessageSquare, ClipboardList, Camera, Scissors, Minus, Plus, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { APP_CONFIG } from '@/lib/config';

const creditActions = [
  { icon: BarChart3, label: 'Analyse de CV', cost: '2 cr.', color: 'text-blue-500' },
  { icon: Search, label: 'Match CV vs Offre', cost: '2 cr.', color: 'text-indigo-500' },
  { icon: FileText, label: 'Lettre de motivation', cost: '2 cr.', color: 'text-violet-500' },
  { icon: ClipboardList, label: 'Bilan de Compétences', cost: '2 cr.', color: 'text-amber-500' },
  { icon: Camera, label: 'Photo Pro', cost: '20 cr.', color: 'text-purple-500' },
  { icon: Scissors, label: 'Détourage Magique', cost: '1 cr.', color: 'text-blue-600' },
  { icon: PenLine, label: 'Amélioration', cost: '1 cr.', color: 'text-emerald-500' },
  { icon: Zap, label: 'Correction / Reformulation', cost: '0.5 cr.', color: 'text-yellow-500' },
  { icon: Languages, label: 'Traduction de CV', cost: '5 cr.', color: 'text-cyan-500' },
  { icon: MessageSquare, label: 'Entretien écrit', cost: '5 cr.', color: 'text-rose-500' },
  { icon: Mic, label: 'Entretien vocal', cost: '1 cr./min', color: 'text-orange-500' },
];

const plans = [
  {
    name: 'Essai Gratuit',
    price: '0',
    currency: 'FCFA',
    description: `${APP_CONFIG.credits.signupBonus} crédits offerts à l'inscription.`,
    cta: 'Créer mon compte',
    popular: false,
    dark: false
  },
  {
    name: 'Pack Standard',
    price: '1 000',
    currency: 'FCFA',
    period: ' / achat unique',
    description: '35 crédits',
    cta: 'Explorer',
    popular: true,
    dark: true
  },
  {
    name: 'Pack Premium',
    price: '2 000',
    currency: 'FCFA',
    period: ' / achat unique',
    description: '80 crédits',
    cta: 'En savoir plus',
    popular: false,
    dark: false
  }
];

export function Pricing() {
  const minCredits = APP_CONFIG.pricing.alaCarte.minCredits;
  const maxCredits = APP_CONFIG.pricing.alaCarte.maxCredits;
  const pricePerCredit = APP_CONFIG.pricing.alaCarte.pricePerCredit;

  const [customCredits, setCustomCredits] = useState(10);
  const customPrice = customCredits * pricePerCredit;

  const adjustCredits = (delta: number) => {
    setCustomCredits(prev => Math.min(maxCredits, Math.max(minCredits, prev + delta)));
  };

  return (
    <div id="pricing" className="bg-bg-light py-20 px-4 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Finis les abonnements mensuels"
          description="Achetez des crédits et utilisez-les quand vous voulez. Pas d'engagement, pas d'expiration."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-16"
        >
          <h3 className="text-center text-lg font-bold text-slate-800 mb-6">
            Combien coûte chaque action ?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {creditActions.map((action) => (
              <div
                key={action.label}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-100 shadow-sm p-3 text-center transition-all hover:shadow-md"
              >
                <action.icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-[11px] font-semibold text-slate-600 leading-tight">{action.label}</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5">{action.cost}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
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

        {/* À la carte sur-mesure */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto bg-primary text-white rounded-3xl p-6 lg:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-3.5 text-center lg:text-left">
              <span className="inline-block px-3 py-1 bg-white/20 border border-white/30 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                Option À la carte
              </span>
              <h3 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                Achetez uniquement ce qui vous suffit
              </h3>
              <p className="text-blue-100 text-sm max-w-lg leading-relaxed">
                Pas besoin de pack ? Choisissez le nombre exact de crédits requis pour vos démarches professionnelles. Sans abonnement, sans engagement et valables à vie.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1 text-xs font-medium text-blue-100">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-white" /> Sans engagement
                </span>
                <span className="h-3 w-px bg-blue-400/50 hidden sm:inline" />
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-white" /> Valable à vie
                </span>
                <span className="h-3 w-px bg-blue-400/50 hidden sm:inline" />
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-white" /> Mobile Money accepté
                </span>
              </div>
            </div>

            <div className="w-full lg:w-auto shrink-0 bg-white text-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6 shadow-xl border border-slate-100">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Quantité de crédits
                </span>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-1.5 shadow-inner">
                  <button
                    onClick={() => adjustCredits(-5)}
                    disabled={customCredits <= minCredits}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-20 transition-all text-slate-600 shadow-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="text-center min-w-[70px]">
                    <span className="text-2xl font-black text-slate-900">{customCredits}</span>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider -mt-1">crédits</p>
                  </div>

                  <button
                    onClick={() => adjustCredits(5)}
                    disabled={customCredits >= maxCredits}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-20 transition-all text-slate-600 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="w-full sm:w-auto lg:w-full flex flex-col items-center gap-3 text-center">
                <div>
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span className="text-3xl font-black text-slate-900">
                      {customPrice.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{APP_CONFIG.pricing.currency}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    soit {pricePerCredit} {APP_CONFIG.pricing.currency} par crédit
                  </span>
                </div>

                <Link href="/auth" className="w-full">
                  <button className="w-full py-3 px-6 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" />
                    Acheter {customCredits} crédits
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
