'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Receipt, Wallet, Search, Loader2, ArrowUpRight, 
  CheckCircle2, XCircle, Clock, Gift, ChevronLeft, ChevronRight,
  Download, Calendar, Package, Info, X
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  name: string | null;
  email: string;
}

interface PaymentTransaction {
  id: string;
  amount: number;
  credits: number;
  phone: string;
  status: string;
  packId: string;
  transactionId: string | null;
  operatorName: string | null;
  createdAt: string;
  user: User;
}

interface ManualRecharge {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
  user: User;
}

type DateFilter = 'all' | 'today' | 'week' | 'month';

export default function TransactionsPanel() {
  const [activeTab, setActiveTab] = useState<'real' | 'manual'>('real');
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [recharges, setRecharges] = useState<ManualRecharge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, dateFilter]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/hq-ops/transactions');
      if (!res.ok) throw new Error('Erreur de récupération des données');
      const data = await res.json();
      setPayments(data.realPayments || []);
      setRecharges(data.manualRecharges || []);
    } catch (error) {
      toast.error('Impossible de charger les transactions.');
    } finally {
      setIsLoading(false);
    }
  };

  // Date Filtering Logic
  const isDateInRange = (dateString: string, filter: DateFilter) => {
    if (filter === 'all') return true;
    const date = new Date(dateString);
    const now = new Date();
    
    // Set to start of day for accurate comparison
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (filter === 'today') {
      return date >= startOfToday;
    }
    if (filter === 'week') {
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      return date >= startOfWeek;
    }
    if (filter === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return date >= startOfMonth;
    }
    return true;
  };

  // Apply Filters
  const dateFilteredPayments = payments.filter(p => isDateInRange(p.createdAt, dateFilter));
  const dateFilteredRecharges = recharges.filter(r => isDateInRange(r.createdAt, dateFilter));

  const filteredPayments = dateFilteredPayments.filter(p => 
    p.user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.phone.includes(searchQuery) ||
    (p.user.name && p.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredRecharges = dateFilteredRecharges.filter(r => 
    r.user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.user.name && r.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // KPIs
  const completedPayments = dateFilteredPayments.filter(p => p.status === 'completed');
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaidCredits = completedPayments.reduce((sum, p) => sum + p.credits, 0);
  const totalGiftedCredits = dateFilteredRecharges.reduce((sum, r) => sum + r.amount, 0);

  // Pagination
  const currentData = activeTab === 'real' ? filteredPayments : filteredRecharges;
  const totalPages = Math.ceil(currentData.length / itemsPerPage) || 1;
  const paginatedPayments = activeTab === 'real' ? filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];
  const paginatedRecharges = activeTab === 'manual' ? filteredRecharges.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  // Chart Data (Revenue per day over the filtered period)
  const chartData = useMemo(() => {
    if (completedPayments.length === 0) return [];
    
    const daily: Record<string, number> = {};
    completedPayments.forEach(p => {
      const date = new Date(p.createdAt).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
      daily[date] = (daily[date] || 0) + p.amount;
    });

    // Sort chronologically (rough sort based on how data comes in, usually desc from API)
    // Actually API is desc, so reversing gives chronological
    const rawDates = Object.keys(daily);
    // Let's just use the order of discovery reversed
    return rawDates.reverse().map(date => ({
      date,
      revenue: daily[date]
    }));
  }, [completedPayments]);

  const maxDailyRevenue = chartData.length > 0 ? Math.max(...chartData.map(d => d.revenue)) : 0;

  // CSV Export Function
  const handleExportCSV = () => {
    const dataToExport = activeTab === 'real' ? filteredPayments : filteredRecharges;
    if (dataToExport.length === 0) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === 'real') {
      csvContent += "Date,Heure,Client Nom,Client Email,Téléphone,Opérateur,Pack,Montant (FCFA),Crédits,Statut,ID Transaction\n";
      (dataToExport as PaymentTransaction[]).forEach(row => {
        const d = new Date(row.createdAt);
        csvContent += `${d.toLocaleDateString('fr-FR')},${d.toLocaleTimeString('fr-FR')},"${row.user.name || ''}","${row.user.email}","${row.phone}","${row.operatorName || ''}","${row.packId}",${row.amount},${row.credits},${row.status},"${row.transactionId || ''}"\n`;
      });
    } else {
      csvContent += "Date,Heure,Client Nom,Client Email,Description,Crédits Offerts\n";
      (dataToExport as ManualRecharge[]).forEach(row => {
        const d = new Date(row.createdAt);
        csvContent += `${d.toLocaleDateString('fr-FR')},${d.toLocaleTimeString('fr-FR')},"${row.user.name || ''}","${row.user.email}","${row.description}",${row.amount}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jobsira_export_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Fichier CSV généré avec succès !');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> RÉUSSI</span>;
      case 'failed': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-200"><XCircle className="w-3 h-3" /> ÉCHOUÉ</span>;
      case 'pending': default: return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-200"><Clock className="w-3 h-3" /> ATTENTE</span>;
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Global Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Receipt className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Suivi Financier</h1>
            <p className="text-slate-500 text-sm">Monitoring des revenus et de la distribution.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button 
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter CSV</span>
          </button>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none shadow-sm cursor-pointer"
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">7 derniers jours</option>
              <option value="month">Ce mois-ci</option>
              <option value="all">Depuis le début</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Wallet className="w-24 h-24" /></div>
            <p className="text-sm font-medium text-slate-500 mb-1">Chiffre d'Affaires</p>
            <p className="text-4xl font-black text-slate-900 mb-2">{totalRevenue.toLocaleString('fr-FR')} <span className="text-xl text-slate-500">FCFA</span></p>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium bg-emerald-50 w-fit px-2 py-1 rounded-md">
              <CheckCircle2 className="w-4 h-4" /> {completedPayments.length} paiements réussis
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <p className="text-sm font-medium text-slate-500 mb-1">Crédits Vendus</p>
            <p className="text-3xl font-black text-slate-900">{totalPaidCredits}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <p className="text-sm font-medium text-slate-500 mb-1">Crédits Offerts (Cadeaux)</p>
            <p className="text-3xl font-black text-purple-600">+{totalGiftedCredits}</p>
          </div>
        </div>

        {/* Custom CSS Bar Chart (Fallback since Recharts was denied) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            Évolution des Revenus
          </h3>
          <div className="flex-1 flex items-end gap-2 sm:gap-4 h-48 relative">
            {chartData.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">Aucune donnée sur cette période</div>
            ) : (
              chartData.slice(-14).map((data, index) => ( // Show max 14 columns
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                    {data.revenue.toLocaleString('fr-FR')} FCFA
                  </div>
                  {/* Bar */}
                  <div 
                    className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-md transition-all duration-500 relative overflow-hidden"
                    style={{ height: `${Math.max((data.revenue / maxDailyRevenue) * 100, 5)}%` }}
                  >
                    <div className="absolute bottom-0 w-full h-1 bg-blue-500"></div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 truncate w-full text-center">{data.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs & Search */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex bg-slate-200/50 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('real')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'real' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">LigdiCash</span>
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'manual' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">Cadeaux</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher (Email, Nom)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-white border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-4 font-semibold">Date & Heure</th>
                <th className="p-4 font-semibold">Client</th>
                {activeTab === 'real' ? (
                  <>
                    <th className="p-4 font-semibold">Pack</th>
                    <th className="p-4 font-semibold">Paiement</th>
                    <th className="p-4 font-semibold text-right">Statut</th>
                  </>
                ) : (
                  <>
                    <th className="p-4 font-semibold">Description</th>
                    <th className="p-4 font-semibold text-right">Crédits</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
                  </td>
                </tr>
              ) : activeTab === 'real' ? (
                paginatedPayments.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">Aucun résultat.</td></tr>
                ) : (
                  paginatedPayments.map((p) => (
                    <tr 
                      key={p.id} 
                      onClick={() => setSelectedTx(p)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{new Date(p.createdAt).toLocaleDateString('fr-FR')}</div>
                        <div className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute:'2-digit' })}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.user.name || '---'}</div>
                        <div className="text-xs text-slate-500">{p.user.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                          <Package className="w-3 h-3" /> {p.packId}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-black text-slate-900">{p.amount.toLocaleString('fr-FR')} F</div>
                        <div className="text-xs text-slate-500">{p.operatorName || p.phone}</div>
                      </td>
                      <td className="p-4 text-right">
                        {getStatusBadge(p.status)}
                      </td>
                    </tr>
                  ))
                )
              ) : (
                paginatedRecharges.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500">Aucun résultat.</td></tr>
                ) : (
                  paginatedRecharges.map((r) => (
                    <tr key={r.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</div>
                        <div className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute:'2-digit' })}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{r.user.name || '---'}</div>
                        <div className="text-xs text-slate-500">{r.user.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                          {r.description}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-black text-purple-700">+{r.amount} cr.</span>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white">
            <span className="text-sm text-slate-500 font-medium">
              Page <span className="text-slate-900">{currentPage}</span> sur <span className="text-slate-900">{totalPages}</span>
            </span>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
              >Début</button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className={`p-6 text-white ${selectedTx.status === 'completed' ? 'bg-emerald-600' : selectedTx.status === 'failed' ? 'bg-red-600' : 'bg-orange-500'}`}>
              <button onClick={() => setSelectedTx(null)} className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                {selectedTx.status === 'completed' ? <CheckCircle2 className="w-8 h-8" /> : <Info className="w-8 h-8" />}
                <h3 className="text-xl font-bold">Détails Transaction</h3>
              </div>
              <p className="text-white/80 font-medium">{new Date(selectedTx.createdAt).toLocaleString('fr-FR')}</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">Montant</p>
                  <p className="text-lg font-black text-slate-900">{selectedTx.amount} F</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">Pack</p>
                  <p className="text-lg font-bold text-slate-900 capitalize">{selectedTx.packId}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Client</span>
                  <span className="text-sm font-bold text-slate-900">{selectedTx.user.email}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Téléphone</span>
                  <span className="text-sm font-bold text-slate-900">{selectedTx.phone}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Opérateur</span>
                  <span className="text-sm font-bold text-slate-900">{selectedTx.operatorName || 'Non spécifié'}</span>
                </div>
                <div className="flex flex-col gap-1 pb-1">
                  <span className="text-xs text-slate-500">ID LigdiCash</span>
                  <code className="text-xs font-mono bg-slate-100 p-2 rounded text-slate-700 break-all">
                    {selectedTx.transactionId || selectedTx.id}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
