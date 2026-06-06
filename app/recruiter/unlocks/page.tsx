'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Unlock, Mail, Phone, User, Briefcase, MapPin, Loader2, Clock, CreditCard, Sparkles, ArrowRight, Zap, Gift, Award, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copié dans le presse-papiers !');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (authStatus === 'loading' || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400 text-sm animate-pulse">Chargement de votre espace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Mes Profils Débloqués</h1>
          <p className="text-slate-400 text-sm mt-2">Consultez et gérez les coordonnées complètes des candidats que vous avez débloqués.</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { val: stats.totalUnlocks, label: 'Profils débloqués', Icon: Unlock },
            { val: stats.recruiterCredits, label: 'Crédits restants', Icon: Zap },
            { val: stats.freeUnlocksRemaining, label: 'Gratuits restants', Icon: Gift },
            { val: stats.freeUnlocksUsed, label: 'Gratuits utilisés', Icon: Award },
          ].map((s) => (
            <div 
              key={s.label} 
              className="relative overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 group shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{s.label}</p>
                  <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{s.val}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                  <s.Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main List Area */}
      {unlocks.length === 0 ? (
        <div className="relative text-center py-16 px-8 bg-slate-900/40 rounded-3xl max-w-2xl mx-auto mt-6">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Unlock className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-extrabold text-white mb-3">Aucun profil débloqué</h3>
          <p className="text-slate-400 text-base max-w-md mx-auto mb-8 leading-relaxed">
            Découvrez notre vivier de talents, recherchez des candidats par compétences et débloquez leurs coordonnées complètes.
          </p>
          <button 
            onClick={() => router.push('/recruiter')} 
            className="inline-flex items-center justify-center px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Rechercher des talents
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {unlocks.map((u) => (
            <div 
              key={u.id} 
              className="group relative overflow-hidden bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:bg-slate-900/60 hover:border-primary/20 transition-all duration-300 shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left block: Profile Intro */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary/5 border border-primary/25 rounded-2xl flex items-center justify-center font-extrabold text-primary shadow-md shrink-0">
                      {u.profile.anonymousName}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors duration-300 truncate">
                        {u.profile.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                        {u.profile.sector && (
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-slate-500" />
                            {u.profile.sector}
                          </span>
                        )}
                        {u.profile.locationCity && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-500" />
                            {u.profile.locationCity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {u.profile.skills.slice(0, 5).map((s) => (
                      <span 
                        key={s} 
                        className="px-3 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded-lg border border-white/5"
                      >
                        {s}
                      </span>
                    ))}
                    {u.profile.skills.length > 5 && (
                      <span className="px-3 py-1 bg-white/5 text-slate-500 text-xs font-semibold rounded-lg">
                        +{u.profile.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle block: Contact details box */}
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 space-y-3 min-w-full lg:min-w-[340px] max-w-md shadow-inner relative overflow-hidden group/box">
                  <div className="absolute right-3 top-3 w-8 h-8 rounded-full bg-primary/5 blur-md" />
                  
                  {/* Name */}
                  {u.contactInfo.firstName && (
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-2.5 text-slate-200 font-medium">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{u.contactInfo.firstName} {u.contactInfo.lastName}</span>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {u.contactInfo.email && (
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <a 
                        href={`mailto:${u.contactInfo.email}`} 
                        className="flex items-center gap-2.5 text-primary hover:text-primary-dark hover:underline truncate group/link"
                      >
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{u.contactInfo.email}</span>
                      </a>
                      <button 
                        onClick={() => handleCopy(u.contactInfo.email, `${u.id}-email`)}
                        className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                        title="Copier l'email"
                      >
                        {copiedId === `${u.id}-email` ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  {/* Phone */}
                  {u.contactInfo.phone && (
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <a 
                        href={`tel:${u.contactInfo.phone}`} 
                        className="flex items-center gap-2.5 text-primary hover:text-primary-dark hover:underline group/link"
                      >
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{u.contactInfo.phone}</span>
                      </a>
                      <button 
                        onClick={() => handleCopy(u.contactInfo.phone, `${u.id}-phone`)}
                        className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                        title="Copier le téléphone"
                      >
                        {copiedId === `${u.id}-phone` ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Right block: Cost/Time Metas */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 py-4 lg:py-0 border-t lg:border-t-0 lg:border-l border-white/5 lg:pl-6 shrink-0 text-slate-500 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Débloqué le {new Date(u.unlockedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span>{u.creditsCost === 0 ? 'Gratuit' : `${u.creditsCost} crédits`}</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
