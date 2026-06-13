'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Shield, CheckCircle, XCircle, Loader2, ArrowLeft, KeyRound, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/lib/config';

type PaymentStep = 'form' | 'success' | 'error' | 'pending';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pack: {
    id: string;
    name: string;
    credits: number;
    price: number;
    priceLabel: string;
  };
  onCreditsUpdated?: (newBalance: number) => void;
}

export function PaymentModal({ isOpen, onClose, pack, onCreditsUpdated }: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>('form');
  const [countryCode, setCountryCode] = useState('226');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultData, setResultData] = useState<{ credits: number; newBalance: number; operator: string } | null>(null);

  // Keep track of the pending transaction token
  const pendingToken = useRef<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setCountryCode('226');
      setPhone('');
      setOtp('');
      setError('');
      setResultData(null);
      pendingToken.current = null;
    }
  }, [isOpen]);

  // Handle Polling Document
  useEffect(() => {
    if (step !== 'pending' || !pendingToken.current) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status?token=${pendingToken.current}`);
        if (!res.ok) return;

        const data = await res.json();
        if (data.status === 'completed') {
           setResultData({
             credits: data.credits,
             newBalance: data.newBalance,
             operator: data.operator || '',
           });
           setStep('success');
           toast.success(`+${data.credits} crédits ajoutés !`);
           onCreditsUpdated?.(data.newBalance);
        } else if (data.status === 'failed') {
           setError('Le paiement a échoué ou a été annulé.');
           setStep('error');
        }
      } catch (e) {
        console.error('Polling error', e);
      }
    }, 4000); // Check every 4 seconds

    return () => clearInterval(interval);
  }, [step, onCreditsUpdated]);

  // ─── Step: Validate Payment ───────────────────

  const handleValidatePayment = async () => {
    if (!phone.trim()) {
      setError('Veuillez entrer votre numéro de téléphone.');
      return;
    }

    if (otp.length < 4) {
      setError('Veuillez entrer le code OTP complet.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payment/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: `${countryCode}${phone.trim()}`,
          otp: otp.trim(),
          packId: pack.id,
          ...(pack.id === 'alacarte' && { credits: pack.credits }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Paiement refusé.');
        return;
      }

      if (data.status === 'completed') {
        setResultData({
          credits: data.credits,
          newBalance: data.newBalance,
          operator: data.operator || '',
        });
        setStep('success');
        toast.success(`+${data.credits} crédits ajoutés !`);
        onCreditsUpdated?.(data.newBalance);
      } else {
        // Pending — start polling
        pendingToken.current = data.token;
        setStep('pending');
      }
    } catch {
      setError('Erreur de connexion. Vérifiez votre réseau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={step === 'success' || step === 'error' ? onClose : undefined}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {/* ─── STEP: Form (USSD Instructions + Phone + OTP) ─────────────────────── */}
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 sm:p-8"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <Phone className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{pack.name}</h3>
                <p className="text-slate-500 mt-1">
                  <span className="text-2xl font-bold text-indigo-600">{pack.priceLabel}</span>{' '}
                  <span className="text-sm">{APP_CONFIG.pricing.currency}</span>
                  <span className="text-slate-400 mx-2">•</span>
                  <span className="text-green-600 font-semibold">+{pack.credits} crédits</span>
                </p>
              </div>

              {/* Instructions USSD */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <h4 className="text-sm font-bold text-amber-900 mb-2">Comment payer ?</h4>
                <ol className="text-sm text-amber-800 space-y-2 list-decimal list-inside">
                  <li>Pour Orange Burkina, composez sur votre téléphone : <br/>
                    <strong className="text-indigo-600 text-base font-mono bg-white px-2 py-0.5 rounded border border-amber-100">*144*4*6*{pack.price}#</strong>
                  </li>
                  <li>Entrez votre code secret Orange Money</li>
                  <li>Vous recevrez un <strong>code OTP</strong> par SMS</li>
                  <li>Saisissez votre numéro et ce code OTP ci-dessous</li>
                </ol>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Numéro de Téléphone
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-[135px] shrink-0">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full h-full appearance-none pl-3 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                      >
                        <option value="226">🇧🇫 +226</option>
                        <option value="225">🇨🇮 +225</option>
                        <option value="221">🇸🇳 +221</option>
                        <option value="223">🇲🇱 +223</option>
                        <option value="228">🇹🇬 +228</option>
                        <option value="229">🇧🇯 +229</option>
                        <option value="227">🇳🇪 +227</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/[^\d\s]/g, ''));
                        setError('');
                      }}
                      placeholder="70 00 00 00"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Code OTP (reçu par SMS)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <KeyRound className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\s/g, ''));
                        setError('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleValidatePayment()}
                      placeholder="Ex: 123456"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <XCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleValidatePayment}
                  disabled={isLoading || !phone.trim() || !otp.trim()}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Validation en cours...
                    </>
                  ) : (
                    `Confirmer le paiement — ${pack.priceLabel} ${APP_CONFIG.pricing.currency}`
                  )}
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-slate-400">
                <Shield className="w-3.5 h-3.5" />
                Paiement sécurisé par LigdiCash
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                disabled={isLoading}
              >
                ✕
              </button>
            </motion.div>
          )}

          {/* ─── STEP: Pending ───────────────────── */}
          {step === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-5">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Confirmation en cours...</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                Nous attendons la validation finale de votre paiement. <br/><br/>
                Veuillez patienter quelques instants, cette page se mettra à jour toute seule.
              </p>
              
              <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-amber-600 bg-amber-50 py-2 rounded-lg">
                <Shield className="w-3.5 h-3.5" />
                Ne fermez pas cette fenêtre
              </div>
            </motion.div>
          )}

          {/* ─── STEP: Success ───────────────────── */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-9 h-9 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Paiement réussi !</h3>
              <p className="text-slate-500 mb-1">
                <span className="text-2xl font-bold text-green-600">+{resultData?.credits || pack.credits}</span>{' '}
                crédits ajoutés à votre compte
              </p>
              {resultData?.operator && (
                <p className="text-xs text-slate-400 mb-5">
                  Via {resultData.operator}
                </p>
              )}
              {resultData?.newBalance ? (
                <p className="text-sm text-slate-500 mb-6">
                  Solde actuel : <span className="font-bold text-indigo-600">{resultData.newBalance} crédits</span>
                </p>
              ) : null}
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all"
              >
                Retour au tableau de bord
              </button>
            </motion.div>
          )}

          {/* ─── STEP: Error ─────────────────────── */}
          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-9 h-9 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Paiement échoué</h3>
              <p className="text-slate-500 mb-6">{error || 'Une erreur est survenue.'}</p>
              <button
                onClick={() => {
                  setStep('form');
                  setError('');
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all"
              >
                Réessayer
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
