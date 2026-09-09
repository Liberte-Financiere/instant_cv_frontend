'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Clock, Building2, ShieldCheck, Mail, Phone, MapPin, ArrowRight, RefreshCw, CheckCircle2, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface StatusResponse {
  status: string;
  role: string;
  rejectionReason?: string | null;
  company?: {
    name?: string | null;
    sector?: string | null;
    city?: string | null;
    country?: string | null;
    phone?: string | null;
    website?: string | null;
    taxId?: string | null;
  };
}

export default function RecruiterPendingPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/recruiter/status');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.status === 'APPROVED' || json.role === 'RECRUITER') {
          await signOut({ callbackUrl: '/login?callbackUrl=/recruiter&message=recruiter_approved' });
          return;
        } else if (json.status === 'REJECTED') {
          router.push('/recruiter/rejected');
        } else if (json.status === 'NONE') {
          router.push('/recruiter/register');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
    } else if (authStatus === 'authenticated') {
      fetchStatus();
    }
  }, [authStatus]);

  const handleRefresh = () => {
    setChecking(true);
    fetchStatus();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-sm">Vérification de votre dossier...</p>
      </div>
    );
  }

  const company = data?.company;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      {/* Status Hero Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center space-y-5">
        <div className="w-20 h-20 bg-amber-50 border border-amber-200 rounded-3xl flex items-center justify-center mx-auto text-amber-600 shadow-inner">
          <Clock className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full uppercase tracking-wider">
            En attente de validation
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Votre dossier recruteur est en cours d'examen
          </h1>
          <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
            Afin de protéger nos candidats et de garantir des opportunités fiables, notre équipe valide manuellement chaque entreprise sous <strong>24h ouvrées</strong>.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-center justify-center gap-2">
          <Mail className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Dès validation, vous recevrez un email de confirmation pour activer vos <strong>3 déblocages de profils offerts</strong>.</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={handleRefresh}
            disabled={checking}
            variant="outline"
            className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
            Vérifier le statut
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <User className="w-4 h-4 mr-2" />
              Retourner à mon espace
            </Button>
          </Link>
        </div>
      </div>

      {/* Recap of Submitted Info */}
      {company?.name && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-base">Récapitulatif de votre dossier</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Entreprise</p>
              <p className="font-bold text-slate-800">{company.name}</p>
            </div>
            {company.sector && (
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Secteur</p>
                <p className="font-medium text-slate-700">{company.sector}</p>
              </div>
            )}
            {company.phone && (
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Téléphone pro</p>
                <p className="font-medium text-slate-700">{company.phone}</p>
              </div>
            )}
            {(company.city || company.country) && (
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Localisation</p>
                <p className="font-medium text-slate-700">{[company.city, company.country].filter(Boolean).join(', ')}</p>
              </div>
            )}
            {company.taxId && (
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Identifiant fiscal / RCCM</p>
                <p className="font-medium text-slate-700">{company.taxId}</p>
              </div>
            )}
            {company.website && (
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Site web / Lien</p>
                <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium truncate block">
                  {company.website}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
