'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Wallet, Users, Plus, Loader2, AlertCircle,
  GraduationCap, UserPlus, ArrowDownLeft, ArrowUpRight,
  ShieldCheck, Clock, RefreshCw
} from 'lucide-react';

interface SchoolDetail {
  id: string;
  name: string;
  slug: string;
  contactEmail: string | null;
  isActive: boolean;
  createdAt: string;
  creditWallet: {
    balance: string;
    totalBought: string;
    totalUsed: string;
  } | null;
  _count: {
    users: number;
    invitations: number;
    memberships: number;
  };
}

interface LedgerEntry {
  id: string;
  amount: string;
  type: string;
  balanceBefore: string;
  balanceAfter: string;
  description: string | null;
  reference: string | null;
  idempotencyKey: string | null;
  createdAt: string;
  performedBy: { name: string | null; email: string | null } | null;
  user: { name: string | null; email: string | null } | null;
}

interface MembershipEntry {
  id: string;
  role: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string | null };
}

export default function SchoolDetailPage() {
  const params = useParams();
  const schoolId = params.id as string;

  const [school, setSchool] = useState<SchoolDetail | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [memberships, setMemberships] = useState<MembershipEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [topupAmount, setTopupAmount] = useState('');
  const [topupReference, setTopupReference] = useState('');
  const [topupDescription, setTopupDescription] = useState('');
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupError, setTopupError] = useState<string | null>(null);
  const [topupSuccess, setTopupSuccess] = useState<string | null>(null);

  const [adminEmail, setAdminEmail] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);

  const fetchSchoolData = useCallback(async () => {
    try {
      setLoading(true);
      const [schoolRes, ledgerRes, membershipsRes] = await Promise.all([
        fetch(`/api/hq-ops/schools/${schoolId}`),
        fetch(`/api/hq-ops/schools/${schoolId}/ledger`),
        fetch(`/api/hq-ops/schools/${schoolId}/memberships`),
      ]);

      if (schoolRes.ok) {
        const schoolData = await schoolRes.json();
        setSchool(schoolData.school);
      }

      if (ledgerRes.ok) {
        const ledgerData = await ledgerRes.json();
        setLedger(ledgerData.transactions || []);
      }

      if (membershipsRes.ok) {
        const memberData = await membershipsRes.json();
        setMemberships(memberData.memberships || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) fetchSchoolData();
  }, [schoolId, fetchSchoolData]);

  async function handleTopup(e: React.FormEvent) {
    e.preventDefault();
    setTopupError(null);
    setTopupSuccess(null);
    setTopupLoading(true);

    const amount = parseInt(topupAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      setTopupError('Le montant doit être un entier strictement positif.');
      setTopupLoading(false);
      return;
    }

    const idempotencyKey = `TOPUP-${schoolId}-${Date.now()}-${crypto.randomUUID()}`;

    try {
      const res = await fetch(`/api/hq-ops/schools/${schoolId}/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          idempotencyKey,
          reference: topupReference || null,
          description: topupDescription || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setTopupError(data.error || 'Erreur lors de la recharge');
        return;
      }

      const label = data.deduplicated ? '(doublon ignoré)' : '';
      setTopupSuccess(
        `Recharge de ${amount} crédits effectuée ${label}. Nouveau solde : ${data.balanceAfter}`
      );
      setTopupAmount('');
      setTopupReference('');
      setTopupDescription('');
      fetchSchoolData();
    } catch {
      setTopupError('Erreur réseau. Réessayez.');
    } finally {
      setTopupLoading(false);
    }
  }

  async function handleAssignAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAssignError(null);
    setAssignSuccess(null);
    setAssignLoading(true);

    try {
      const res = await fetch(`/api/hq-ops/schools/${schoolId}/assign-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAssignError(data.error || 'Erreur lors de l\'attribution');
        return;
      }

      setAssignSuccess(
        `${data.membership.user.email} est maintenant administrateur de ${data.membership.school.name}.`
      );
      setAdminEmail('');
      fetchSchoolData();
    } catch {
      setAssignError('Erreur réseau. Réessayez.');
    } finally {
      setAssignLoading(false);
    }
  }

  function getTransactionBadge(type: string) {
    const map: Record<string, { label: string; color: string }> = {
      PURCHASE: { label: 'Recharge', color: 'bg-emerald-50 text-emerald-700' },
      CONSUMPTION: { label: 'Utilisation', color: 'bg-blue-50 text-blue-700' },
      REFUND: { label: 'Remboursement', color: 'bg-amber-50 text-amber-700' },
      ADJUSTMENT: { label: 'Ajustement', color: 'bg-purple-50 text-purple-700' },
      REVERSAL: { label: 'Annulation', color: 'bg-red-50 text-red-700' },
      EXPIRATION: { label: 'Expiration', color: 'bg-slate-50 text-slate-700' },
    };
    return map[type] || { label: type, color: 'bg-slate-50 text-slate-700' };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-600 font-semibold">{error || 'École introuvable'}</p>
        <Link
          href="/dashboard/hq-ops/schools"
          className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  const balance = school.creditWallet ? Number(school.creditWallet.balance) : 0;
  const totalBought = school.creditWallet ? Number(school.creditWallet.totalBought) : 0;
  const totalUsed = school.creditWallet ? Number(school.creditWallet.totalUsed) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/hq-ops/schools"
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-teal-600" />
            {school.name}
          </h1>
          <p className="text-sm text-slate-400 font-mono">{school.slug}</p>
        </div>
        <button
          onClick={fetchSchoolData}
          className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          title="Rafraîchir"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-full ${
            school.isActive
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {school.isActive ? 'ACTIF' : 'INACTIF'}
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Solde Actuel</span>
            <Wallet className="w-5 h-5 text-teal-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">{balance.toLocaleString('fr-FR')}</h2>
          <p className="text-xs text-slate-400 mt-1">crédits disponibles</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Acheté</span>
            <ArrowDownLeft className="w-5 h-5 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">{totalBought.toLocaleString('fr-FR')}</h2>
          <p className="text-xs text-slate-400 mt-1">crédits achetés</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Consommé</span>
            <ArrowUpRight className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">{totalUsed.toLocaleString('fr-FR')}</h2>
          <p className="text-xs text-slate-400 mt-1">crédits utilisés</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Étudiants</span>
            <Users className="w-5 h-5 text-amber-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">{school._count.users}</h2>
          <p className="text-xs text-slate-400 mt-1">rattachés</p>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Top-Up + Admin Assignment */}
        <div className="space-y-6">
          {/* Top-Up Form */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              Recharger les Crédits
            </h3>
            <form onSubmit={handleTopup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Montant (crédits)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="2000"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Référence (N° facture)
                </label>
                <input
                  type="text"
                  value={topupReference}
                  onChange={(e) => setTopupReference(e.target.value)}
                  placeholder="B2B-2026-00123"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Commentaire (optionnel)
                </label>
                <input
                  type="text"
                  value={topupDescription}
                  onChange={(e) => setTopupDescription(e.target.value)}
                  placeholder="Paiement facture B2B #INV-2026-034"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {topupError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-xs text-red-700 font-semibold">{topupError}</p>
                </div>
              )}
              {topupSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p className="text-xs text-emerald-700 font-semibold">{topupSuccess}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={topupLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {topupLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Recharger
              </button>
            </form>
          </div>

          {/* Assign Admin Form */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Assigner un Administrateur
            </h3>
            <form onSubmit={handleAssignAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Adresse email de l&apos;administrateur
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="directeur@uvbf.bf"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  L&apos;utilisateur doit avoir un compte Jobsira existant.
                </p>
              </div>

              {assignError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-xs text-red-700 font-semibold">{assignError}</p>
                </div>
              )}
              {assignSuccess && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                  <p className="text-xs text-blue-700 font-semibold">{assignSuccess}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={assignLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {assignLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Assigner
              </button>
            </form>

            {memberships.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Administrateurs actuels
                </h4>
                {memberships.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {m.user.name || m.user.email}
                      </p>
                      <p className="text-xs text-slate-400">{m.user.email}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Ledger */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
          <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-500" />
            Journal Financier (Ledger)
          </h3>

          {ledger.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Wallet className="w-10 h-10 text-slate-200" />
              <p className="text-sm text-slate-400">Aucune transaction enregistrée</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {ledger.map((entry) => {
                const badge = getTransactionBadge(entry.type);
                const isPositive = Number(entry.amount) > 0;
                return (
                  <div
                    key={entry.id}
                    className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                      <span
                        className={`text-sm font-black ${
                          isPositive ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {Number(entry.amount).toLocaleString('fr-FR')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-500">
                      <div>
                        <span className="text-slate-400">Avant : </span>
                        <span className="font-semibold text-slate-700">
                          {Number(entry.balanceBefore).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Après : </span>
                        <span className="font-semibold text-slate-700">
                          {Number(entry.balanceAfter).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    {entry.description && (
                      <p className="text-xs text-slate-500 mt-2">{entry.description}</p>
                    )}

                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span>
                        {new Date(entry.createdAt).toLocaleDateString('fr-FR')}{' '}
                        {new Date(entry.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {entry.reference && (
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                          {entry.reference}
                        </span>
                      )}
                    </div>
                    {entry.performedBy && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        Par : {entry.performedBy.name || entry.performedBy.email}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
