"use client";

import { useSession } from "next-auth/react";
import { LogOut, AlertTriangle } from "lucide-react";
import { useState } from "react";

import { clearAllLocalData } from '@/lib/utils';

export function ImpersonationBanner() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (!session?.user?.impersonatedBy) {
    return null;
  }

  const handleStopImpersonation = async () => {
    try {
      setIsLoading(true);
      // Log the stop action in DB first
      await fetch("/api/admin/impersonate/stop", {
        method: "POST",
      });

      // Clear the edge session token and local data
      await clearAllLocalData();
      await update({ stopImpersonation: true });
      
      // Force reload to clear any cached data
      window.location.href = "/dashboard/hq-ops/users";
    } catch (error) {
      console.error("Failed to stop impersonation", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-4 sticky top-0 z-[100] shadow-md w-full">
      <AlertTriangle className="w-5 h-5 text-yellow-200" />
      <span className="font-medium text-sm sm:text-base">
        Mode Impersonation Actif : Vous êtes connecté en tant que <strong className="bg-white/20 px-2 rounded">{session.user.name || session.user.email}</strong>
      </span>
      <button
        onClick={handleStopImpersonation}
        disabled={isLoading}
        className="ml-auto flex items-center gap-2 bg-white text-red-600 hover:bg-red-50 px-3 py-1 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
        {isLoading ? "Déconnexion..." : "Quitter"}
      </button>
    </div>
  );
}
