'use client';

import { useState, useEffect } from 'react';
import { Copy, Gift, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ReferralCodeCard() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralCode();
  }, []);

  const fetchReferralCode = async () => {
    try {
      const res = await fetch('/api/referral');
      if (res.ok) {
        const json = await res.json();
        setReferralCode(json.referralCode);
      }
    } catch (error) {
      console.error('Failed to fetch referral code', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!referralCode) return;
    
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success('Code copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erreur lors de la copie');
    }
  };

  return (
    <div className="bg-white p-3 md:p-6 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-2 md:mb-4">
        <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-purple-50 text-purple-600">
          <Gift className="w-4 h-4 md:w-6 md:h-6" />
        </div>
      </div>
      <div>
        <p className="text-xs md:text-sm font-medium text-slate-500 mb-0.5 md:mb-1">Code Parrainage</p>
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-bold text-slate-900 font-mono tracking-wider">
              {referralCode || '---'}
            </span>
            <button
              onClick={copyCode}
              className="p-1.5 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
              title="Copier le code"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
