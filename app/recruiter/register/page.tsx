'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Building2, Gift, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RecruiterRegisterPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role === 'RECRUITER') {
      router.push('/recruiter/unlocks');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session.user?.role === 'RECRUITER') {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
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
      
      // Force user to sign out and log back in to get their new role
      await signOut({ callbackUrl: '/login?message=recruiter_success' });
    } catch {
      setError('Erreur de connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto pt-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Devenir Recruteur</h1>
        <p className="text-slate-600 text-sm">Accedez au vivier de talents Jobsira et debloquez des profils qualifies.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {[
          { icon: Gift, text: '3 deblocages de profils gratuits', color: 'text-emerald-500' },
          { icon: Shield, text: 'Donnees candidats anonymisees et securisees', color: 'text-blue-500' },
          { icon: CheckCircle2, text: 'Profils verifies avec score de qualite', color: 'text-blue-500' },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <item.icon className={`w-5 h-5 ${item.color} shrink-0`} />
            <p className="text-sm text-slate-700">{item.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom de votre entreprise</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Ex: TechCorp Burkina"
            required
            minLength={2}
            maxLength={100}
            className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-sm !text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        <Button type="submit" disabled={isSubmitting || companyName.trim().length < 2} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Building2 className="w-4 h-4 mr-2" />}
          {isSubmitting ? 'Inscription...' : "S'inscrire comme recruteur"}
        </Button>
      </form>
    </div>
  );
}
