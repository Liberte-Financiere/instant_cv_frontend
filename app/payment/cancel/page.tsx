import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Cancel Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-14 h-14 text-red-400" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Paiement annulé
        </h1>
        <p className="text-white/70 mb-8">
          Votre paiement a été annulé. Aucun montant n&apos;a été débité de votre compte.
        </p>

        {/* Help Text */}
        <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-white font-semibold mb-3">Besoin d&apos;aide ?</h3>
          <p className="text-white/70 text-sm">
            Si vous avez rencontré un problème lors du paiement, vous pouvez réessayer ou nous contacter pour assistance.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-medium py-3 px-6 rounded-xl hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au Dashboard
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-500 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Réessayer
          </Link>
        </div>
      </div>
    </div>
  );
}
