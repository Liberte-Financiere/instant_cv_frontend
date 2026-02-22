'use client';

import { useCreditStore } from '@/store/useCreditStore';
import { useSession } from 'next-auth/react';
import { Sparkles, Check, Star, Zap, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';

const creditPacks = [
  {
    name: 'Pack Standard',
    credits: 35,
    price: '1 000',
    currency: 'FCFA',
    description: 'L\'essentiel pour postuler à quelques offres.',
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
    currency: 'FCFA',
    description: 'Pour postuler activement.',
    features: [
      'Valable à vie',
      'Correction et traduction',
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
    currency: 'FCFA',
    description: 'La tranquillité ultime pour votre recherche.',
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
    
    const message = `Bonjour Instant CV !\n\nJe souhaite recharger mon compte avec le *${packName}* (+${creditsAmount} Crédits pour ${price} FCFA).\n\nMon adresse e-mail associée au compte est : ${userEmail}\n\nComment puis-je procéder au paiement s'il vous plaît ?`;
    
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    
    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-12">
      {/* Solde actuel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Recharger vos Crédits IA</h1>
          <p className="text-slate-500 mt-1">Achetez des crédits uniquement lorsque vous en avez besoin. Pas d'abonnement.</p>
        </div>
        <div className="bg-slate-50 rounded-xl px-6 py-4 border border-slate-100 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Votre solde actuel</p>
            <p className="text-2xl font-black text-slate-900">
              {isLoading ? '...' : credits} <span className="text-sm font-bold text-slate-400">CRÉDITS</span>
            </p>
          </div>
        </div>
      </div>

      {/* Packs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-4">
        {creditPacks.map((pack, index) => (
          <motion.div
            key={pack.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-2xl p-8 flex flex-col h-full ${
              pack.dark 
                ? 'bg-slate-900 text-white shadow-2xl md:-translate-y-4 border border-slate-800' 
                : 'bg-white text-slate-900 shadow-xl border border-slate-100'
            }`}
          >
            {pack.popular && (
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-2">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" /> Recommandé
                </span>
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Zap className={`w-5 h-5 ${pack.dark ? 'text-amber-400' : 'text-blue-500'}`} />
                <h3 className={`text-xl font-bold ${pack.dark ? 'text-white' : 'text-slate-900'}`}>{pack.name}</h3>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{pack.price}</span>
                <span className={`text-sm font-bold ${pack.dark ? 'text-slate-400' : 'text-slate-500'}`}>{pack.currency}</span>
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 inline-block">
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">+{pack.credits} Crédits</p>
              </div>
              
              <p className={`mt-4 text-sm ${pack.dark ? 'text-slate-400' : 'text-slate-500'}`}>{pack.description}</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {pack.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    pack.dark ? 'bg-blue-500/20 text-blue-400' : 'bg-green-100 text-green-600'
                  }`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className={pack.dark ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handlePurchase(pack.name, pack.price, pack.credits)}
              className={`w-full py-4 px-2 flex items-center justify-center gap-2 rounded-xl font-bold transition-all mt-auto ${
                pack.dark 
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25' 
                  : 'bg-slate-100 hover:bg-green-50 hover:text-green-700 text-slate-900 border border-transparent hover:border-green-200'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              Contacter via WhatsApp
            </button>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center bg-blue-50 p-6 rounded-2xl border border-blue-100">
         <h4 className="font-bold text-blue-900 mb-2">Comment se passe la recharge manuelle ?</h4>
         <p className="text-sm text-blue-700 max-w-2xl mx-auto">
            Sélectionnez votre pack ci-dessus, ce qui ouvrira une conversation WhatsApp avec notre équipe. 
            Une fois le paiement mobile (Wave, Orange Money...) effectué, vos crédits seront ajoutés instantanément sur votre compte.
         </p>
      </div>
    </div>
  );
}
