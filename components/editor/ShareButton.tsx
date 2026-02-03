'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Link2, ExternalLink } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';

export function ShareButton() {
  const { currentCV } = useCVStore();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!currentCV) return null;

  // Generate share URL using CV id
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/cv/${currentCV.id}`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenPreview = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
      >
        <Share2 className="w-4 h-4" />
        <span>Partager</span>
      </button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Link2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Partager votre CV</h3>
                <p className="text-sm text-slate-500">Partagez un lien vers votre CV en ligne</p>
              </div>
            </div>

            {/* Link Input */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 bg-slate-100 rounded-lg px-4 py-3 text-sm text-slate-600 truncate font-mono">
                {shareUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`p-3 rounded-lg transition-colors ${
                  copied 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                title="Copier le lien"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleOpenPreview}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Voir la page
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                Fermer
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center mt-4">
              Ce lien permet à n'importe qui de voir votre CV
            </p>
          </div>
        </div>
      )}
    </>
  );
}
