'use client';

import { Calendar, Clock, CheckCircle2, Edit3, MoreVertical, Plus, Search, Filter, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type CampaignStatus = 'all' | 'draft' | 'scheduled' | 'sent';

export default function MarketingCampaignsPage() {
  const [activeTab, setActiveTab] = useState<CampaignStatus>('all');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch('/api/hq-ops/marketing/campaigns');
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.campaigns || []);
        }
      } catch (err) {
        console.error('Erreur chargement campagnes', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  const filteredCampaigns = activeTab === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'sent':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100"><CheckCircle2 className="w-3 h-3" /> Envoyé</span>;
      case 'scheduled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100"><Clock className="w-3 h-3" /> Planifié</span>;
      case 'draft':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200"><Edit3 className="w-3 h-3" /> Brouillon</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Campagnes</h1>
            <p className="text-slate-500">Gérez vos brouillons, planifications et consultez l'historique.</p>
          </div>
          <Link 
            href="/dashboard/hq-ops/marketing"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm shadow-blue-600/20 flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Campagne
          </Link>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Toutes
            </button>
            <button 
              onClick={() => setActiveTab('draft')}
              className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'draft' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Brouillons
            </button>
            <button 
              onClick={() => setActiveTab('scheduled')}
              className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'scheduled' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Planifiées
            </button>
            <button 
              onClick={() => setActiveTab('sent')}
              className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'sent' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Envoyées
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <button className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table / List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nom de la Campagne</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ouverture</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Clics</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p>Chargement des campagnes...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 mb-1">{campaign.name || campaign.subject}</div>
                      <div className="text-xs font-medium text-slate-500">{campaign.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        {campaign.status === 'scheduled' ? <Calendar className="w-4 h-4 text-slate-400" /> : null}
                        {campaign.sentAt 
                          ? new Date(campaign.sentAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                          : new Date(campaign.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${campaign.openRate ? 'text-slate-900' : 'text-slate-300'}`}>
                        {campaign.openRate ? `${campaign.openRate}%` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${campaign.clickRate ? 'text-slate-900' : 'text-slate-300'}`}>
                        {campaign.clickRate ? `${campaign.clickRate}%` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && filteredCampaigns.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Aucune campagne trouvée pour ce filtre.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
