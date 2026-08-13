'use client';

import { useState } from 'react';
import { GraduationCap, ShieldCheck, KeyRound, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface SchoolEnrollmentSectionProps {
  schoolData: { id: string; name: string } | null;
  onSuccess: (schoolName: string) => void;
}

export function SchoolEnrollmentSection({ schoolData, onSuccess }: SchoolEnrollmentSectionProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Veuillez entrer un code d\'accès valide.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/b2b/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la validation du code.');
      }

      toast.success(data.message);
      
      // We extract the school name from the message or assume success implies a state update
      // Since our API returns "Bienvenue ! Vous êtes maintenant rattaché à [Nom de l'école]."
      // We can trigger the onSuccess callback which should re-fetch profile or update local state
      onSuccess(data.message.split('rattaché à ')[1]?.replace('.', '') || 'votre établissement');
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // État 2 : L'étudiant est déjà rattaché à une école
  if (schoolData) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-lg font-bold text-slate-900">Mon Établissement</h4>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-slate-700 font-medium text-lg mb-2">
              {schoolData.name}
            </p>
            <p className="text-sm text-emerald-800 leading-relaxed bg-emerald-100/50 p-3 rounded-lg border border-emerald-100 inline-block">
              <strong className="font-semibold text-emerald-900">✓ Vous êtes membre. </strong>
              Vos services IA éligibles sont pris en charge par votre établissement.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // État 1 : L'étudiant n'est pas encore rattaché
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
          <GraduationCap className="w-6 h-6 text-slate-400" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Rejoindre mon établissement</h4>
          <p className="text-slate-500 text-sm mt-1">
            Si votre école ou université est partenaire de Jobsira, saisissez votre code d'accès personnel pour débloquer vos avantages.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <KeyRound className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ex: JBS-7F92-KQ"
            disabled={loading}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-medium uppercase placeholder:normal-case placeholder:font-normal disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Valider le code
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
