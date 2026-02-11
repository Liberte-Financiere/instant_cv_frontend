'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
  className?: string;
  iconClassName?: string;
}

export function ShareButton({ title, text, url, className, iconClassName }: ShareButtonProps) {
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
      toast.success('Lien copié dans le presse-papier !');
    } catch {
      toast.error('Impossible de copier le lien.');
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleShare();
      }}
      className={cn(
        'p-3 bg-white rounded-xl text-slate-600 hover:text-purple-600 hover:scale-110 shadow-lg shadow-slate-200 transition-all',
        className
      )}
      title="Partager"
    >
      <Share2 className={cn('w-5 h-5', iconClassName)} />
    </button>
  );
}
