'use client';

import { useEffect } from 'react';
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Une erreur est survenue ! 😕</h2>
        <p className="text-gray-600">
          Nos équipes ont été notifiées. Essayez de rafraîchir la page.
        </p>
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
