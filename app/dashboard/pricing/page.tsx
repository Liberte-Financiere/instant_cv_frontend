'use client';

import { useState } from 'react';
import { useCreditStore } from '@/store/useCreditStore';
import { useSession } from 'next-auth/react';
import {Check, Star, Zap, CreditCard, Gift, Minus, Plus, Coins, Wand2} from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '@/lib/config';
import { PaymentModal } from '@/components/payment/PaymentModal';

const creditPacks = APP_CONFIG.pricing.packs;

export default function DashboardPricingPage() {
  const credits = useCreditStore((state) => state.credits);
  const isLoading = useCreditStore((state) => state.isLoading);
  const fetchCredits = useCreditStore((state) => state.fetchCredits);
  const { data: session } = useSession();

  const [selectedPack, setSelectedPack] = useState<(typeof creditPacks)[number] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePurchase = (pack: (typeof creditPacks)[number]) => {
    setSelectedPack(pack);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header + Solde */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Recharger vos Crédits IA</h1>
          <p className="text-slate-500 mt-1 text-sm">Achetez des crédits uniquement lorsque vous en avez besoin. Pas d&apos;abonnement.</p>
        </div>
        <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200 shadow-sm flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Coins className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Solde</p>
            <p className="text-xl font-black text-slate-900">
              {isLoading ? '...' : credits} <span className="text-xs font-bold text-slate-400">crédits</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bandeau Gratuit */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900">Essai Gratuit — {APP_CONFIG.credits.signupBonus} crédits offerts</h3>
              <p className="text-sm text-emerald-700/70 mt-0.5">
                Export PDF illimité · Design illimité · Templates gratuits · Crédits sans expiration
              </p>
            </div>
          </div>
          <div className="bg-emerald-100/80 border border-emerald-200 rounded-xl px-4 py-2 text-center shrink-0">
            <p className="text-sm font-semibold text-emerald-700">✓ Déjà inclus dans votre compte</p>
          </div>
        </div>
      </motion.div>

      {/* À la carte */}
      <AlaCarteSection onPurchase={(credits: number) => {
        const price = credits * APP_CONFIG.pricing.alaCarte.pricePerCredit;
        setSelectedPack({
          id: 'alacarte',
          name: 'À la carte',
          credits,
          price,
          priceLabel: price.toLocaleString('fr-FR'),
        } as any);
        setIsModalOpen(true);
      }} />

      {/* Packs Payants */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Packs crédits — Meilleur rapport qualité-prix</h2>
        <p className="text-sm text-slate-500 mb-6">Plus vous achetez en pack, moins le crédit coûte cher. Paiement unique, crédits valables à vie.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creditPacks.map((pack, index) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 flex flex-col ${
                pack.popular 
                  ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-blue-500/50' 
                  : 'bg-white text-slate-900 shadow-lg border border-slate-100'
              }`}
            >
              {pack.popular && (
                <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-white" /> Populaire
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className={`w-5 h-5 ${pack.popular ? 'text-amber-400' : 'text-blue-500'}`} />
                  <h3 className={`text-lg font-bold ${pack.popular ? 'text-white' : 'text-slate-900'}`}>{pack.name}</h3>
                </div>
                
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black">{pack.priceLabel}</span>
                  <span className={`text-sm font-medium ${pack.popular ? 'text-slate-400' : 'text-slate-500'}`}>{APP_CONFIG.pricing.currency}</span>
                </div>
                
                <div className="mt-3 flex items-center gap-2">
                  <span className={`inline-block px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm font-bold ${pack.popular ? 'text-blue-400' : 'text-blue-600'}`}>
                    +{pack.credits} crédits
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${pack.popular ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                    {Math.round(pack.price / pack.credits)}F/cr.
                  </span>
                </div>

                <p className={`mt-3 text-sm ${pack.popular ? 'text-slate-400' : 'text-slate-500'}`}>{pack.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6 flex-1">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      pack.popular ? 'bg-blue-500/20 text-blue-400' : 'bg-green-100 text-green-600'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={pack.popular ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button 
                onClick={() => handlePurchase(pack)}
                className={`w-full py-3.5 flex items-center justify-center gap-2 rounded-xl font-bold transition-all mt-auto text-sm ${
                  pack.popular 
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Acheter maintenant
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="text-center bg-blue-50 p-5 rounded-2xl border border-blue-100">
         <h4 className="font-bold text-blue-900 mb-1.5 text-sm">Comment se passe la recharge ?</h4>
         <p className="text-sm text-blue-700/80 max-w-2xl mx-auto">
            Sélectionnez votre pack, entrez votre numéro Mobile Money (Orange, Moov, LigdiCash), 
            confirmez avec le code OTP reçu par SMS et vos crédits sont ajoutés instantanément.
         </p>
      </div>

      {/* Payment Modal */}
      {selectedPack && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPack(null);
          }}
          pack={selectedPack}
          onCreditsUpdated={() => fetchCredits()}
        />
      )}
    </div>
  );
}

// ─── À la carte Component ──────────────────────
function AlaCarteSection({ onPurchase }: { onPurchase: (credits: number) => void }) {
  const [credits, setCredits] = useState<number>(APP_CONFIG.pricing.alaCarte.minCredits);
  const pricePerCredit = APP_CONFIG.pricing.alaCarte.pricePerCredit;
  const minCredits = APP_CONFIG.pricing.alaCarte.minCredits;
  const totalPrice = credits * pricePerCredit;

  const adjustCredits = (delta: number) => {
    setCredits(prev => Math.max(minCredits, prev + delta));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Coins className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Achat à la carte</h3>
          </div>
          <p className="text-sm text-slate-500">Achetez uniquement le nombre de crédits dont vous avez besoin. Minimum {minCredits} crédits.</p>
          <p className="text-xs text-slate-400 mt-1">{pricePerCredit} {APP_CONFIG.pricing.currency} par crédit</p>
        </div>

        {/* Right: Selector + CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Credit Selector */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2">
            <button
              onClick={() => adjustCredits(-5)}
              disabled={credits <= minCredits}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              <Minus className="w-4 h-4 text-slate-700" />
            </button>

            <div className="text-center min-w-[80px]">
              <input
                type="number"
                value={credits}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= minCredits) setCredits(val);
                  else if (!isNaN(val) && val >= 1) setCredits(val);
                }}
                onBlur={() => {
                  if (credits < minCredits) setCredits(minCredits);
                }}
                min={minCredits}
                className="w-20 text-center text-2xl font-black text-slate-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider -mt-1">crédits</p>
            </div>

            <button
              onClick={() => adjustCredits(5)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-black text-slate-900">
              {totalPrice.toLocaleString('fr-FR')} <span className="text-sm font-semibold text-slate-500">{APP_CONFIG.pricing.currency}</span>
            </p>
            <button
              onClick={() => onPurchase(credits)}
              disabled={credits < minCredits}
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <CreditCard className="w-4 h-4" />
              Acheter {credits} crédits
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
