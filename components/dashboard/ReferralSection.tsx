'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Gift, Users, Share2, Check, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/lib/config';

interface ReferralData {
  referralCode: string;
  referralLink: string;
  referralCount: number;
  referredUsers: Array<{
    id: string;
    name: string | null;
    image: string | null;
  }>;
}

export function ReferralSection() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const res = await fetch('/api/referral');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch referral data', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!data?.referralLink) return;
    
    try {
      await navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      toast.success('Lien copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erreur lors de la copie');
    }
  };

  const shareLink = async () => {
    if (!data?.referralLink) return;
    
    const shareText = `🚀 Crée ton CV pro avec l'IA ${APP_CONFIG.name} ! Inscris-toi avec mon lien et reçois un bonus de ${APP_CONFIG.credits.referralBonus} crédits gratuits 👉 ${data.referralLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '{APP_CONFIG.name}',
          text: shareText,
          url: data.referralLink,
        });
      } catch {
        // User cancelled
      }
    } else {
      copyLink();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-center h-24">
        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl border border-blue-100 p-4"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Left: Title + Link */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-800">Parrainage (Gagnez des Crédits)</h3>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
              +10 Cr. / Filleul
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={data.referralLink}
              className="flex-1 px-3 py-1.5 bg-white rounded-lg text-xs text-slate-600 border border-slate-200 truncate"
            />
            <button
              onClick={copyLink}
              className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              title="Copier"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={shareLink}
              className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              title="Partager"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <Users className="w-4 h-4" />
              <span className="text-lg font-bold">{data.referralCount}</span>
            </div>
            <p className="text-xs text-slate-500">Amis parrainés</p>
          </div>
          
          <div className="text-center">
             <div className="flex items-center justify-center gap-1 text-amber-500">
               <Sparkles className="w-4 h-4" />
               <span className="text-lg font-bold">{data.referralCount * 10}</span>
             </div>
             <p className="text-xs text-slate-500">Crédits générés</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
