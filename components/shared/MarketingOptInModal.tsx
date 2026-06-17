'use client';

import { useState, useEffect } from 'react';
import { Mail, Loader2, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export function MarketingOptInModal() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only show for logged in users
    if (!session?.user) return;

    const checkAndShow = async () => {
      const hasAnswered = localStorage.getItem('jobsira_marketing_asked');
      if (hasAnswered) return;

      try {
        // Fetch real status from DB to be sure they didn't already accept via Settings
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.user?.acceptsMarketing) {
            // Already accepted in the past, save locally and abort showing popup
            localStorage.setItem('jobsira_marketing_asked', 'true');
            return;
          }
        }
      } catch (error) {
        console.error("Error checking marketing status:", error);
      }

      setIsOpen(true);
    };

    // Wait a bit before showing to not overwhelm the user on initial load
    const timer = setTimeout(() => {
      checkAndShow();
    }, 2000);

    return () => clearTimeout(timer);
  }, [session]);

  const handleResponse = async (accepted: boolean) => {
    setIsSubmitting(true);
    
    try {
      if (accepted) {
        // Save to DB only if they accepted (to change the default false to true)
        const res = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ acceptsMarketing: true }),
        });

        if (!res.ok) {
          throw new Error('Erreur réseau');
        }
        toast.success("Super ! Vous êtes abonné à nos actualités exclusives.");
      }
      
      // Save locally to never ask again
      localStorage.setItem('jobsira_marketing_asked', 'true');
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving marketing preference:", error);
      // Fallback: still close and save locally so they aren't stuck
      localStorage.setItem('jobsira_marketing_asked', 'true');
      setIsOpen(false);
      if (accepted) {
        toast.error("Une erreur est survenue, mais c'est noté !");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header decoration */}
        <div className="bg-blue-600 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 rounded-full opacity-50 blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-blue-700 rounded-full opacity-50 blur-lg"></div>
          
          <button 
            onClick={() => handleResponse(false)}
            className="absolute top-3 right-3 text-blue-200 hover:text-white transition-colors"
            aria-label="Fermer"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-md relative z-10">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white relative z-10">Ne ratez aucune nouveauté !</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 text-center mb-6 leading-relaxed">
            Acceptez-vous de recevoir nos <strong className="text-slate-900">dernières fonctionnalités IA</strong>, des astuces inédites pour améliorer vos requêtes, et nos <strong className="text-blue-600">promotions exclusives</strong> ?
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleResponse(true)}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Oui, je le veux !
                </>
              )}
            </button>
            <button
              onClick={() => handleResponse(false)}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-xl font-medium transition-colors border border-slate-200"
            >
              Non, merci
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">
            Vous pourrez modifier ce choix à tout moment dans vos paramètres. Pas de spam, promis.
          </p>
        </div>
      </div>
    </div>
  );
}
