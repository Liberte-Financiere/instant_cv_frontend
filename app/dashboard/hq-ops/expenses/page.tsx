'use client';

import { useState, useEffect } from 'react';
import {
  Wallet, PlusCircle, Search, Loader2, Pencil, Trash2,
  Server, Globe, Key, Package, MoreHorizontal, CheckCircle2,
  X, Pause, Play, TrendingDown
} from 'lucide-react';
import { toast } from 'sonner';

interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  currency: string;
  frequency: string;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  notes: string | null;
  createdAt: string;
}

interface KPIs {
  burnMonthly: Record<string, number>;
  activeCount: number;
  totalCount: number;
  byCategory: Record<string, number>;
}

type ModalMode = 'create' | 'edit';

const CATEGORIES = [
  { value: 'SERVER', label: 'Serveur', icon: Server, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'SUBSCRIPTION', label: 'Abonnement', icon: Package, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'DOMAIN', label: 'Domaine', icon: Globe, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'API', label: 'API / Service', icon: Key, color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { value: 'OTHER', label: 'Autre', icon: MoreHorizontal, color: 'bg-slate-50 text-slate-700 border-slate-200' }
];

const CURRENCIES = ['FCFA', 'EUR', 'USD'];

const FREQUENCIES = [
  { value: 'MONTHLY', label: 'Mensuel' },
  { value: 'YEARLY', label: 'Annuel' },
  { value: 'ONE_TIME', label: 'Ponctuel' }
];

const CURRENCY_SYMBOLS: Record<string, string> = { FCFA: 'F', EUR: '\u20ac', USD: '$' };

function getCategoryMeta(cat: string) {
  return CATEGORIES.find(c => c.value === cat) || CATEGORIES[4];
}

function getFrequencyLabel(freq: string) {
  return FREQUENCIES.find(f => f.value === freq)?.label || freq;
}

export default function ExpensesPanel() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('SERVER');
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formCurrency, setFormCurrency] = useState('FCFA');
  const [formFrequency, setFormFrequency] = useState('MONTHLY');
  const [formStartDate, setFormStartDate] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/admin/expenses');
      if (!res.ok) throw new Error('Erreur');
      const data = await res.json();
      setExpenses(data.expenses || []);
      setKpis(data.kpis || null);
    } catch {
      toast.error('Impossible de charger les dépenses.');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingExpense(null);
    setFormName('');
    setFormCategory('SERVER');
    setFormAmount(0);
    setFormCurrency('FCFA');
    setFormFrequency('MONTHLY');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setModalMode('edit');
    setEditingExpense(expense);
    setFormName(expense.name);
    setFormCategory(expense.category);
    setFormAmount(expense.amount);
    setFormCurrency(expense.currency);
    setFormFrequency(expense.frequency);
    setFormStartDate(new Date(expense.startDate).toISOString().split('T')[0]);
    setFormNotes(expense.notes || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formAmount <= 0) {
      toast.error('Nom et montant sont requis.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formName,
        category: formCategory,
        amount: formAmount,
        currency: formCurrency,
        frequency: formFrequency,
        startDate: formStartDate,
        notes: formNotes
      };

      let res: Response;
      if (modalMode === 'create') {
        res = await fetch('/api/admin/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/admin/expenses/${editingExpense!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur');
      }

      toast.success(modalMode === 'create' ? 'Dépense ajoutée.' : 'Dépense modifiée.');
      setModalOpen(false);
      fetchExpenses();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (expense: Expense) => {
    try {
      const res = await fetch(`/api/admin/expenses/${expense.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !expense.isActive })
      });
      if (!res.ok) throw new Error('Erreur');
      toast.success(expense.isActive ? 'Dépense désactivée.' : 'Dépense réactivée.');
      fetchExpenses();
    } catch {
      toast.error('Erreur lors de la mise à jour.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/expenses/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur');
      toast.success('Dépense supprimée.');
      setDeleteTarget(null);
      fetchExpenses();
    } catch {
      toast.error('Erreur lors de la suppression.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtrage côté client (données déjà chargées et légères)
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = !searchQuery ||
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Suivi des Dépenses</h1>
            <p className="text-slate-500 text-sm">Serveurs, abonnements, domaines et services.</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> Nouvelle dépense
        </button>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CURRENCIES.map(cur => {
            const burn = kpis.burnMonthly[cur] || 0;
            if (burn === 0 && cur !== 'FCFA') return null;
            return (
              <div key={cur} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Burn Mensuel ({cur})</span>
                  <span className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <TrendingDown className="w-5 h-5" />
                  </span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {burn.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                  <span className="text-sm font-bold text-slate-500 ml-1">{CURRENCY_SYMBOLS[cur]}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-2">/mois (charges récurrentes)</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters + Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl py-2 px-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 w-full sm:w-auto cursor-pointer"
          >
            <option value="ALL">Toutes catégories</option>
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-white border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-4 font-semibold">Nom</th>
                <th className="p-4 font-semibold">Catégorie</th>
                <th className="p-4 font-semibold">Montant</th>
                <th className="p-4 font-semibold">Fréquence</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500" />
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <Wallet className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                    <p className="font-medium">Aucune dépense enregistrée.</p>
                    <p className="text-xs mt-1">Utilisez le bouton ci-dessus pour en ajouter une.</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const catMeta = getCategoryMeta(exp.category);
                  const CatIcon = catMeta.icon;
                  return (
                    <tr key={exp.id} className={`hover:bg-slate-50/50 transition-colors ${!exp.isActive ? 'opacity-50' : ''}`}>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{exp.name}</div>
                        {exp.notes && <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{exp.notes}</div>}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${catMeta.color}`}>
                          <CatIcon className="w-3 h-3" />
                          {catMeta.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-black text-slate-900">
                          {exp.amount.toLocaleString('fr-FR')}
                        </span>
                        <span className="text-slate-500 ml-1 text-xs font-semibold">{CURRENCY_SYMBOLS[exp.currency]}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          {getFrequencyLabel(exp.frequency)}
                        </span>
                      </td>
                      <td className="p-4">
                        {exp.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">
                            <Pause className="w-3 h-3" /> Arrêté
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleActive(exp)}
                            title={exp.isActive ? 'Désactiver' : 'Réactiver'}
                            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                          >
                            {exp.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openEditModal(exp)}
                            title="Modifier"
                            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-slate-500 hover:text-blue-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(exp)}
                            title="Supprimer"
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-slate-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {modalMode === 'create' ? 'Nouvelle dépense' : 'Modifier la dépense'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {modalMode === 'create' ? 'Enregistrer un nouveau coût opérationnel.' : `Modification de "${editingExpense?.name}".`}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="VPS Hostinger 4CPU/8GB"
                  required
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm"
                />
              </div>

              {/* Catégorie + Devise */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Devise</label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm cursor-pointer"
                  >
                    {CURRENCIES.map(cur => (
                      <option key={cur} value={cur}>{cur}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Montant + Fréquence */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Montant</label>
                  <input
                    type="number"
                    value={formAmount || ''}
                    onChange={(e) => setFormAmount(parseFloat(e.target.value) || 0)}
                    placeholder="5000"
                    min={0.01}
                    step="0.01"
                    required
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fréquence</label>
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm cursor-pointer"
                  >
                    {FREQUENCIES.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date de début */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date de début</label>
                <input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optionnel)</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Renouvellement automatique, payé via carte Visa..."
                  rows={2}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex justify-center items-center py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-colors gap-2"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  {modalMode === 'create' ? 'Enregistrer' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Supprimer cette dépense ?</h3>
            <p className="text-sm text-slate-500 mb-6">
              <strong>{deleteTarget.name}</strong> sera supprimé définitivement.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 flex justify-center items-center py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors gap-2"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
