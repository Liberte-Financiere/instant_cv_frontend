'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  GraduationCap, Plus, Users, Wallet, ArrowLeft,
  Building2, Loader2, AlertCircle
} from 'lucide-react';

interface SchoolData {
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

export default function SchoolsListPage() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', contactEmail: '' });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/hq-ops/schools');
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setSchools(data.schools);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  function handleSlugGeneration(name: string) {
    // Supprime les accents et caractères spéciaux
    const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Découpe par espaces, tirets ou autres caractères non-alphanumériques
    const words = normalized.split(/[^a-zA-Z0-9]+/).filter(Boolean);

    let slug = '';
    if (words.length === 1) {
      // S'il n'y a qu'un mot, on le prend en entier (ex: "Sorbonne" -> "sorbonne")
      slug = words[0].toLowerCase();
    } else {
      // Sinon, on prend la première lettre de chaque mot (ex: "Université Joseph Ki-Zerbo" -> "ujkz")
      // On exclut les tout petits mots de liaison (optionnel, ex: "de", "la", "des", "l", "d")
      const stopWords = ['de', 'des', 'la', 'le', 'les', 'l', 'd', 'et'];
      slug = words
        .filter(w => !stopWords.includes(w.toLowerCase()))
        .map(w => w[0].toLowerCase())
        .join('');
      
      // Fallback si tout a été filtré (très rare)
      if (!slug) slug = words.map(w => w[0].toLowerCase()).join('');
    }

    setFormData((prev) => ({ ...prev, name, slug }));
  }

  async function handleCreateSchool(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setCreating(true);

    try {
      const res = await fetch('/api/hq-ops/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Erreur lors de la création');
        return;
      }

      setShowCreateForm(false);
      setFormData({ name: '', slug: '', contactEmail: '' });
      fetchSchools();
    } catch {
      setFormError('Erreur réseau. Réessayez.');
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={fetchSchools}
          className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/hq-ops"
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestion B2B (Ecoles)
          </h1>
          <p className="text-sm text-slate-500">
            Partenariats institutionnels, portefeuilles de crédits et accès administrateurs.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Ecole
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            Nouvelle Institution Partenaire
          </h2>
          <form onSubmit={handleCreateSchool} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Nom de l&apos;institution
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleSlugGeneration(e.target.value)}
                  placeholder="Universit&eacute; Joseph Ki-Zerbo"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Slug (identifiant unique)
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="ujkz"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Email de contact (optionnel)
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="partenariat@ujkz.bf"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs text-red-700 font-semibold">{formError}</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                Créer l&apos;école
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormError(null);
                }}
                className="px-5 py-2.5 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {schools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <GraduationCap className="w-16 h-16 text-slate-200" />
          <p className="text-slate-500 font-semibold">Aucune institution partenaire</p>
          <p className="text-slate-400 text-sm">
            Créez votre première école pour commencer le programme B2B.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <Link
              key={school.id}
              href={`/dashboard/hq-ops/schools/${school.id}`}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-teal-50 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-teal-600" />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    school.isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {school.isActive ? 'ACTIF' : 'INACTIF'}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">
                {school.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-4">{school.slug}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <Wallet className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-700">
                    {school.creditWallet
                      ? Number(school.creditWallet.balance).toLocaleString('fr-FR')
                      : '0'}{' '}
                    cr.
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-700">
                    {school._count.users} étudiants
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
