'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function ActivityTracker() {
  const { status } = useSession();

  useEffect(() => {
    // We only want to ping if the user is authenticated
    if (status !== 'authenticated') return;

    const performPing = async () => {
      const STORAGE_KEY = 'last_activity_ping';
      const lastPingStr = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;

      // Throttle client-side: only ping if we haven't pinged in 24 hours on this device
      if (!lastPingStr || now - parseInt(lastPingStr, 10) > ONE_DAY_MS) {
        try {
          const res = await fetch('/api/user/ping', { method: 'POST' });
          if (res.ok) {
            // Only update localStorage if the server accepted the ping
            localStorage.setItem(STORAGE_KEY, now.toString());
          }
        } catch (err) {
          // Silent catch to not disrupt UX
          console.error('[ActivityTracker] Failed to send activity ping', err);
        }
      }
    };

    // Delay the ping slightly so it doesn't block critical page loads
    const timeoutId = setTimeout(performPing, 2000);

    return () => clearTimeout(timeoutId);
  }, [status]);

  return null;
}
