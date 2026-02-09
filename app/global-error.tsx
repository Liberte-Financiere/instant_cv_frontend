'use client'; 
 
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { RefreshCw, AlertTriangle } from 'lucide-react';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
 
  return (
    <html>
      <body className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Une erreur critique est survenue</h2>
          
          <p className="text-slate-500 mb-8">
            L&apos;application a rencontré un problème inattendu. Nous avons été notifiés.
          </p>
          
          <button 
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            Recharger l&apos;application
          </button>
        </div>
      </body>
    </html>
  );
}
