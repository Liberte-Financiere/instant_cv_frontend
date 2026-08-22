'use client';

import { useCreditStore } from '@/store/useCreditStore';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import {AlertCircle, X, Coins, Wand2} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OutOfCreditsModal() {
  const isOpen = useCreditStore((state) => state.isOutOfCreditsModalOpen);
  const setOpen = useCreditStore((state) => state.setOutOfCreditsModalOpen);
  const router = useRouter();

  const handleGoToPricing = () => {
    setOpen(false);
    router.push('/dashboard/pricing');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 overflow-hidden"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-centertext-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center">Crédits IA Insuffisants</h2>
              <p className="text-slate-500 mt-2 text-center text-sm">
                Vous n'avez pas assez de crédits pour effectuer cette action. Rechargez votre compte pour continuer à profiter de l'intelligence artificielle.
              </p>
            </div>

            <div className="flex flex-col gap-4 py-6">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                 <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                    <Coins className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="font-bold text-sm text-slate-900">Packs de crédits</p>
                    <p className="text-xs text-slate-500 mt-0.5">Ajoutez des crédits ponctuels, sans aucun abonnement à gérer.</p>
                 </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Plus tard
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-500/25"
                onClick={handleGoToPricing}
              >
                <Coins className="w-4 h-4" />
                Voir les tarifs
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
