'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Building2, Gift, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RecruiterRegisterPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!session) {
    router.push('/login');
    return null;
  }

  if (session.user?.role === 'RECRUITER') {
    router.push('/recruiter/unlocks');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/recruiter/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: companyName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      
      // Update local NextAuth session to reflect the new RECRUITER role
      await update({ role: 'RECRUITER' });
      
      router.push('/recruiter');
    } catch {
      setError('Erreur de connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto pt-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/20 border border-blue-500/20 flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Devenir Recruteur</h1>
        <p className="text-slate-400 text-sm">Accedez au vivier de talents Jobsira et debloquez des profils qualifies.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {[
          { icon: Gift, text: '3 deblocages de profils gratuits', color: 'text-emerald-400' },
          { icon: Shield, text: 'Donnees candidats anonymisees et securisees', color: 'text-blue-400' },
          { icon: CheckCircle2, text: 'Profils verifies avec score de qualite', color: 'text-blue-400' },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <item.icon className={`w-5 h-5 ${item.color} shrink-0`} />
            <p className="text-sm text-slate-300">{item.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Nom de votre entreprise</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Ex: TechCorp Burkina"
            required
            minLength={2}
            maxLength={100}
            className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-xl text-sm !text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        <Button type="submit" disabled={isSubmitting || companyName.trim().length < 2} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Building2 className="w-4 h-4 mr-2" />}
          {isSubmitting ? 'Inscription...' : "S'inscrire comme recruteur"}
        </Button>
      </form>
    </div>
  );
}
