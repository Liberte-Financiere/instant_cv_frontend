'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Shield, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/lib/config';

type PaymentStep = 'phone' | 'otp' | 'success' | 'error';

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
  const [step, setStep] = useState<PaymentStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [transactionId, setTransactionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultData, setResultData] = useState<{ credits: number; newBalance: number; operator: string } | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setTransactionId('');
      setError('');
      setResultData(null);
    }
  }, [isOpen]);

  // ─── Step 1: Send OTP ─────────────────────────

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      setError('Veuillez entrer votre numéro de téléphone.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), packId: pack.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l\'envoi du code.');
        return;
      }

      setTransactionId(data.transactionId);
      setStep('otp');
      toast.success('Code OTP envoyé par SMS !');
    } catch {
      setError('Erreur de connexion. Vérifiez votre réseau.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 2: Validate OTP ─────────────────────

  const handleValidateOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 4) {
      setError('Veuillez entrer le code OTP complet.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payment/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpCode, transactionId }),
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
        // Pending — will be credited via callback
        setResultData({
          credits: pack.credits,
          newBalance: 0,
          operator: '',
        });
        setStep('success');
        toast.info('Paiement en cours de traitement...');
      }
    } catch {
      setError('Erreur de connexion. Vérifiez votre réseau.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── OTP Input Handler ────────────────────────

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && otp.join('').length >= 4) {
      handleValidateOTP();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    otpRefs.current[nextIndex]?.focus();
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
          {/* ─── STEP: Phone ─────────────────────── */}
          {step === 'phone' && (
            <motion.div
              key="phone"
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

              {/* Phone Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Numéro Mobile Money
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                      +226
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/[^\d\s]/g, ''));
                        setError('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                      placeholder="70 00 00 00"
                      className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Orange Money, Moov Money, ou Wallet LigdiCash
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <XCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSendOTP}
                  disabled={isLoading || !phone.trim()}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Recevoir le code OTP →'
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
              >
                ✕
              </button>
            </motion.div>
          )}

          {/* ─── STEP: OTP ───────────────────────── */}
          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 sm:p-8"
            >
              {/* Back button */}
              <button
                onClick={() => setStep('phone')}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Code OTP envoyé</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Entrez le code reçu par SMS au{' '}
                  <span className="font-medium text-slate-700">{phone}</span>
                </p>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center gap-2 sm:gap-3 mb-5" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">
                  <XCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleValidateOTP}
                disabled={isLoading || otp.join('').length < 4}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
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

              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full mt-3 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Pas reçu ? Renvoyer le code
              </button>
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
                  setStep('phone');
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
