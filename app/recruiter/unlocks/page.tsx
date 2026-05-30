'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Unlock, Mail, Phone, User, Briefcase, MapPin, Loader2, Clock, CreditCard } from 'lucide-react';

interface UnlockEntry {
  id: string;
  creditsCost: number;
  unlockedAt: string;
  profile: {
    id: string;
    anonymousName: string;
    title: string;
    sector: string | null;
    skills: string[];
    locationCity: string | null;
    isActive: boolean;
  };
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface RecruiterStatus {
  recruiterCredits: number;
  freeUnlocksUsed: number;
  freeUnlocksRemaining: number;
  totalUnlocks: number;
}

export default function RecruiterUnlocksPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const isRecruiter = session?.user?.role === 'RECRUITER' || session?.user?.role === 'ADMIN';

  const [unlocks, setUnlocks] = useState<UnlockEntry[]>([]);
  const [stats, setStats] = useState<RecruiterStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authStatus === 'loading') return;
    if (!session || !isRecruiter) { router.push('/recruiter'); return; }

    async function fetchData() {
      try {
        const [uRes, sRes] = await Promise.all([
          fetch('/api/recruiter/unlocks'),
          fetch('/api/recruiter/me'),
        ]);
        if (uRes.ok) { const d = await uRes.json(); setUnlocks(d.unlocks); }
        if (sRes.ok) { const d = await sRes.json(); setStats(d); }
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    }
    fetchData();
  }, [session, authStatus, isRecruiter, router]);

  if (authStatus === 'loading' || isLoading) {
    return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-blue-400 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Mes Profils Debloques</h1>
        <p className="text-slate-400 text-sm mt-1">Consultez les coordonnees des candidats debloques.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: stats.totalUnlocks, label: 'Profils debloques', color: 'text-white' },
            { val: stats.recruiterCredits, label: 'Credits restants', color: 'text-blue-400' },
            { val: stats.freeUnlocksRemaining, label: 'Gratuits restants', color: 'text-emerald-400' },
            { val: stats.freeUnlocksUsed, label: 'Gratuits utilises', color: 'text-blue-400' },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {unlocks.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <Unlock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Aucun profil debloque</h3>
          <p className="text-slate-500 text-sm mb-6">Recherchez des candidats et debloquez leurs coordonnees.</p>
          <button onClick={() => router.push('/recruiter')} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl">Rechercher des talents</button>
        </div>
      ) : (
        <div className="space-y-4">
          {unlocks.map((u) => (
            <div key={u.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-colors">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-blue-300">{u.profile.anonymousName}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{u.profile.title}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        {u.profile.sector && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{u.profile.sector}</span>}
                        {u.profile.locationCity && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{u.profile.locationCity}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {u.profile.skills.slice(0, 4).map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-xs rounded border border-blue-500/20">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3 space-y-1.5 md:min-w-[220px]">
                  {u.contactInfo.firstName && <div className="flex items-center gap-2 text-sm text-slate-300"><User className="w-3.5 h-3.5 text-slate-500" />{u.contactInfo.firstName} {u.contactInfo.lastName}</div>}
                  {u.contactInfo.email && <a href={`mailto:${u.contactInfo.email}`} className="flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200"><Mail className="w-3.5 h-3.5 text-slate-500" /><span className="truncate">{u.contactInfo.email}</span></a>}
                  {u.contactInfo.phone && <a href={`tel:${u.contactInfo.phone}`} className="flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200"><Phone className="w-3.5 h-3.5 text-slate-500" />{u.contactInfo.phone}</a>}
                </div>
                <div className="flex md:flex-col items-center md:items-end gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(u.unlockedAt).toLocaleDateString('fr-FR')}</span>
                  <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" />{u.creditsCost === 0 ? 'Gratuit' : `${u.creditsCost} cr.`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
