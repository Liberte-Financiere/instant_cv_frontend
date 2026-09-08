'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { XCircle, Edit3, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RecruiterRejectedPage() {
  const { data: session, status: authStatus, update } = useSession();
  const router = useRouter();
  const [reason, setReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
    } else if (authStatus === 'authenticated') {
      fetch('/api/recruiter/status')
        .then(res => res.json())
        .then(async (data) => {
          if (data.status === 'APPROVED' || data.role === 'RECRUITER') {
            if (update) {
              await update({ recruiterStatus: 'APPROVED', role: 'RECRUITER' });
            }
            router.push('/recruiter');
          } else if (data.status === 'PENDING') {
            if (update) {
              await update({ recruiterStatus: 'PENDING', role: 'USER' });
            }
            router.push('/recruiter/pending');
          } else if (data.status === 'NONE') {
            if (update) {
              await update({ recruiterStatus: 'NONE', role: 'USER' });
            }
            router.push('/recruiter/register');
          } else {
            setReason(data.rejectionReason);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [authStatus, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-4 space-y-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 border border-rose-200 rounded-3xl flex items-center justify-center mx-auto text-rose-600 shadow-inner">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-full uppercase tracking-wider">
            Dossier non retenu
          </span>
          <h1 className="text-2xl font-black text-slate-900">
            Votre demande de compte recruteur n'a pas été validée
          </h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
            Notre équipe de conformité n'a pas pu valider votre structure avec les informations fournies.
          </p>
        </div>

        {reason && (
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 text-left space-y-2">
            <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              Motif de la décision :
            </div>
            <p className="text-slate-800 text-sm font-medium leading-relaxed">
              {reason}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/recruiter/register" className="w-full sm:w-auto">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-bold">
              <Edit3 className="w-4 h-4 mr-2" />
              Corriger et renvoyer mon dossier
            </Button>
          </Link>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
