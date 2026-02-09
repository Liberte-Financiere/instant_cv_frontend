'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Hook to process referral code after user is redirected to dashboard
 * Checks URL for ?ref= parameter and calls API to register the referral
 */
export function useProcessReferral() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const processed = useRef(false);

  useEffect(() => {
    const referralCode = searchParams.get('ref');
    
    if (referralCode && !processed.current) {
      processed.current = true;
      
      // Process the referral
      fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode }),
      })
        .then(async (res) => {
          if (res.ok) {
            toast.success('🎉 Parrainage enregistré ! Merci à ton parrain.');
          } else {
            const data = await res.json();
            // Silent fail for already referred or invalid codes
            console.log('Referral processing:', data.error);
          }
        })
        .catch((err) => {
          console.error('Referral error:', err);
        })
        .finally(() => {
          // Remove ref param from URL without page reload
          const url = new URL(window.location.href);
          url.searchParams.delete('ref');
          router.replace(url.pathname, { scroll: false });
        });
    }
  }, [searchParams, router]);
}
