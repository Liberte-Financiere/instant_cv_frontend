'use client';

import { useState } from 'react';
import { Share2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
  className?: string;
  iconClassName?: string;
}

export function ShareButton({ title, text, url, className, iconClassName }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${url}`;

    // Use Web Share API if available (mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or API error — fall through to clipboard
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    } catch {
      toast.error('Impossible de copier le lien.');
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleShare();
        }}
        className={cn(
          'p-3 bg-white rounded-xl text-slate-600 hover:text-purple-600 hover:scale-110 shadow-lg shadow-slate-200 transition-all cursor-pointer',
          className
        )}
        title="Partager"
      >
        <Share2 className={cn('w-5 h-5', iconClassName)} />
      </button>

      {/* Success Modal for Copy Link */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4 backdrop-blur-sm bg-slate-900/20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm pointer-events-auto border border-slate-100"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Lien copié !</h3>
                <p className="text-slate-500 text-sm">
                  Le lien public a été copié dans votre presse-papiers.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
