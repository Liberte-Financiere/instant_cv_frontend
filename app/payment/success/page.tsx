import Link from 'next/link';
import { CheckCircle, ArrowRight, Crown } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-14 h-14 text-green-400" />
          </div>
          
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-4">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-200 font-medium">Premium Activé</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Paiement réussi ! 🎉
        </h1>
        <p className="text-white/70 mb-8">
          Votre abonnement Premium est maintenant actif. Profitez de toutes les fonctionnalités sans limite !
        </p>

        {/* Features Unlocked */}
        <div className="bg-white/10 rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-white font-semibold mb-4">Fonctionnalités débloquées :</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Exports PDF illimités</span>
            </li>
            <li className="flex items-center gap-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Tous les templates Premium</span>
            </li>
            <li className="flex items-center gap-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Analyse IA avancée</span>
            </li>
            <li className="flex items-center gap-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Sans filigrane</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold py-3 px-8 rounded-xl hover:bg-white/90 transition-colors"
        >
          Aller au Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
