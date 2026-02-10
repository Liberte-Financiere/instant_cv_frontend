'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PRICING_PLANS } from '@/lib/ligdicash';

const plans = [
  {
    ...PRICING_PLANS.monthly,
    popular: false,
    features: [
      'Exports PDF illimités',
      'Analyse IA avancée',
      'Templates Premium',
      'Sans filigrane',
    ],
  },
  {
    ...PRICING_PLANS.yearly,
    popular: true,
    features: [
      'Tout du plan Mensuel',
      'Économisez 37%',
      'Import LinkedIn',
      'Support prioritaire',
    ],
  },
  {
    ...PRICING_PLANS.lifetime,
    popular: false,
    features: [
      'Accès à vie',
      'Toutes les fonctionnalités',
      'Mises à jour futures incluses',
      'Support VIP',
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (planId: string) => {
    if (!phone.trim()) {
      toast.error('Entrez votre numéro de téléphone');
      return;
    }

    setSelectedPlan(planId);
    setIsLoading(true);

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planType: planId,
          phone: phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du paiement');
      }

      // PawaPay sends USSD prompt to phone - show success message
      toast.success('Validez le paiement sur votre téléphone !', {
        duration: 10000,
        description: 'Vous recevrez une demande de paiement Mobile Money',
      });

      // Redirect to success page after delay
      setTimeout(() => {
        router.push('/payment/success?pending=true');
      }, 3000);

    } catch (error: any) {
      console.error('[Pricing] Payment error:', error);
      toast.error(error.message || 'Erreur lors du paiement');
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="pt-8 pb-4 px-4">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-200 font-medium">InstantCV Premium</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Débloquez tout le potentiel
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Créez des CV professionnels sans limite avec toutes nos fonctionnalités premium.
          </p>
        </motion.div>
      </section>

      {/* Phone Input (Required for PawaPay) */}
      <section className="px-4 mb-8">
        <div className="max-w-md mx-auto">
          <label className="block text-white/80 text-sm font-medium mb-2 text-center">
            Numéro Mobile Money <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex: 70123456 (Orange ou Moov)"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
          <p className="text-white/50 text-xs mt-2 text-center">
            Orange Money ou Moov Money
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 ${
                plan.popular 
                  ? 'bg-gradient-to-b from-purple-600 to-purple-800 border-2 border-purple-400 shadow-2xl shadow-purple-500/30 scale-105' 
                  : 'bg-white/10 border border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                  POPULAIRE
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">
                    {plan.amount.toLocaleString()}
                  </span>
                  <span className="text-white/70">FCFA</span>
                </div>
                {plan.id === 'yearly' && (
                  <p className="text-green-400 text-sm mt-1">Économisez 37%</p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-white/90">
                    <Check className="w-5 h-5 text-green-400 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan.id)}
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-white text-purple-700 hover:bg-white/90'
                    : 'bg-purple-600 text-white hover:bg-purple-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Choisir ce plan
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-4 pb-12 text-center">
        <div className="flex items-center justify-center gap-8 text-white/50 text-sm">
          <span>🔒 Paiement sécurisé</span>
          <span>📱 Orange Money & Moov</span>
          <span>💳 Visa & Mastercard</span>
        </div>
      </section>
    </div>
  );
}
