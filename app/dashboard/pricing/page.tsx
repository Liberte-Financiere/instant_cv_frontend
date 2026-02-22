'use client';

import { useCreditStore } from '@/store/useCreditStore';
import { useSession } from 'next-auth/react';
import { Sparkles, Check, Star, Zap, MessageCircle, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const creditPacks = [
  {
    name: 'Pack Standard',
    credits: 35,
    price: '1 000',
    priceNum: 1000,
    currency: 'FCFA',
    description: 'L\'essentiel pour postuler.',
    features: [
      'Valable à vie',
      'Création et modifications libres',
      'Refonte IA de votre CV',
      'Lettres pour chaque offre'
    ],
    popular: false,
    dark: false
  },
  {
    name: 'Pack Premium',
    credits: 80,
    price: '2 000',
    priceNum: 2000,
    currency: 'FCFA',
    description: 'Pour postuler activement.',
    features: [
      'Valable à vie',
      'Correction et traduction IA',
      'Analyse CV vs Offre IA',
      'Multiples versions de CV'
    ],
    popular: true,
    dark: true
  },
  {
    name: 'Pack Pro',
    credits: 250,
    price: '5 000',
    priceNum: 5000,
    currency: 'FCFA',
    description: 'La tranquillité ultime.',
    features: [
      'Valable à vie',
      'Création sans limite',
      'Coach IA complet à disposition',
      'Toutes les options débloquées'
    ],
    popular: false,
    dark: false
  }
];

export default function DashboardPricingPage() {
  const credits = useCreditStore((state) => state.credits);
  const isLoading = useCreditStore((state) => state.isLoading);
  const { data: session } = useSession();

  const handlePurchase = (packName: string, price: string, creditsAmount: number) => {
    const adminPhone = '22607997114';
    const userEmail = session?.user?.email || '[MON_EMAIL_ICI]';
    
    const message = `Bonjour JobSira !\n\nJe souhaite recharger mon compte avec le *${packName}* (+${creditsAmount} Crédits pour ${price} FCFA).\n\nMon adresse e-mail associée au compte est : ${userEmail}\n\nComment puis-je procéder au paiement s'il vous plaît ?`;
    
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
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
            <Sparkles className="w-5 h-5 text-amber-600" />
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
              <h3 className="font-bold text-emerald-900">Essai Gratuit — 25 crédits offerts</h3>
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

      {/* Packs Payants */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Besoin de plus de crédits ?</h2>
        <p className="text-sm text-slate-500 mb-6">Choisissez le pack qui vous convient. Paiement unique, crédits valables à vie.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creditPacks.map((pack, index) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 flex flex-col ${
                pack.dark 
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
                  <Zap className={`w-5 h-5 ${pack.dark ? 'text-amber-400' : 'text-blue-500'}`} />
                  <h3 className={`text-lg font-bold ${pack.dark ? 'text-white' : 'text-slate-900'}`}>{pack.name}</h3>
                </div>
                
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black">{pack.price}</span>
                  <span className={`text-sm font-medium ${pack.dark ? 'text-slate-400' : 'text-slate-500'}`}>{pack.currency}</span>
                </div>
                
                <div className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className={`text-sm font-bold ${pack.dark ? 'text-blue-400' : 'text-blue-600'}`}>+{pack.credits} crédits</p>
                </div>

                <p className={`mt-3 text-sm ${pack.dark ? 'text-slate-400' : 'text-slate-500'}`}>{pack.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6 flex-1">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      pack.dark ? 'bg-blue-500/20 text-blue-400' : 'bg-green-100 text-green-600'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={pack.dark ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button 
                onClick={() => handlePurchase(pack.name, pack.price, pack.credits)}
                className={`w-full py-3.5 flex items-center justify-center gap-2 rounded-xl font-bold transition-all mt-auto text-sm ${
                  pack.dark 
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Contacter via WhatsApp
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="text-center bg-blue-50 p-5 rounded-2xl border border-blue-100">
         <h4 className="font-bold text-blue-900 mb-1.5 text-sm">Comment se passe la recharge ?</h4>
         <p className="text-sm text-blue-700/80 max-w-2xl mx-auto">
            Sélectionnez votre pack ci-dessus, ce qui ouvrira une conversation WhatsApp avec notre équipe. 
            Une fois le paiement mobile (Wave, Orange Money...) effectué, vos crédits seront ajoutés instantanément.
         </p>
      </div>
    </div>
  );
}
