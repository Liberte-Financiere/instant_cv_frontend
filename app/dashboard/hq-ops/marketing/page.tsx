'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Users, Send, BarChart2, Search, Bell, Grid, Plus, Info, 
  Bold, Italic, Underline, List, Link as LinkIcon, ChevronRight, LayoutTemplate, AlertTriangle, X
} from 'lucide-react';
import { toast } from 'sonner';

type TabView = 'editor' | 'stats' | 'templates' | 'drafts' | 'scheduled' | 'sent';

export default function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState<TabView>('editor');
  const [loading, setLoading] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState<number | null>(null);

  // Campaign Form State
  const [campaignName, setCampaignName] = useState('');
  const [preheader, setPreheader] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [templateId, setTemplateId] = useState('annonce');
  const [externalEmailsRaw, setExternalEmailsRaw] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/hq-ops/marketing/send');
        if (res.ok) {
          const data = await res.json();
          setSubscribersCount(data.count);
        }
      } catch (error) {
        console.error('Erreur stats', error);
      }
    }
    fetchStats();
  }, []);

  // Read template from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tpl = params.get('template');
      if (tpl && ['annonce', 'promo', 'minimal'].includes(tpl)) {
        setTemplateId(tpl);
      }
    }
  }, []);

  const parsedExternalEmails = useMemo(() => {
    if (!externalEmailsRaw) return [];
    const rawList = externalEmailsRaw.split(/[\n,]+/);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return rawList
      .map(email => email.replace(/[<>]/g, '').trim().toLowerCase())
      .filter(email => emailRegex.test(email));
  }, [externalEmailsRaw]);
  
  const totalRecipients = (targetAudience === 'all' ? (subscribersCount || 0) : 0) + parsedExternalEmails.length;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error('Veuillez remplir le sujet et le message.');
      return;
    }

    // Open custom modal instead of window.confirm
    setShowConfirmModal(true);
  };

  const executeSend = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const res = await fetch('/api/hq-ops/marketing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject, 
          message, 
          templateId, 
          targetAudience,
          externalEmails: parsedExternalEmails
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'envoi");

      toast.success(data.message || 'Emails envoyés avec succès !');
      setSubject('');
      setMessage('');
      setExternalEmailsRaw('');
      setCampaignName('');
      setPreheader('');
    } catch (error: any) {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!campaignName && !subject) {
      toast.error('Veuillez au moins renseigner le nom de la campagne ou le sujet.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/hq-ops/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: campaignName || subject, 
          subject, 
          preheader,
          content: message, 
          type: 'Newsletter',
          status: 'draft',
          targetAudience,
          templateId, 
          externalEmails: parsedExternalEmails
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de sauvegarde");

      toast.success('Brouillon sauvegardé avec succès !');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    if (!subject || !message) {
      toast.error('Veuillez remplir le sujet et le message pour le test.');
      return;
    }
    if (parsedExternalEmails.length === 0) {
      toast.error('Veuillez ajouter au moins un email dans le champ "Emails Personnalisés" pour recevoir le test.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/hq-ops/marketing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject: `[TEST] ${subject}`, 
          message, 
          templateId, 
          targetAudience: 'test',
          externalEmails: parsedExternalEmails
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'envoi du test");

      toast.success('Test envoyé avec succès ! Vérifiez vos emails.');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // UI Variables
  const navItems = [
    { id: 'editor', label: 'Éditeur de Campagne' },
    { id: 'stats', label: 'Statistiques' },
    { id: 'templates', label: 'Templates' },
    { id: 'drafts', label: 'Brouillons' },
    { id: 'scheduled', label: 'Planifiés' },
    { id: 'sent', label: 'Envoyés' },
  ];

  const libraryCategories = ['All Templates', 'Announcements', 'Newsletters', 'Transactional', 'Custom'];
  const [activeLibraryCategory, setActiveLibraryCategory] = useState('All Templates');

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans p-8 max-w-7xl mx-auto">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-600">Marketing</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nouvelle Campagne</h1>
          <p className="text-slate-500 mt-1">Créez et envoyez votre newsletter via l'API Brevo.</p>
          {process.env.NODE_ENV === 'development' && (
            <button
              type="button"
              onClick={() => {
                setCampaignName('Test Debug Campaign');
                setPreheader('Ceci est un test rapide depuis le mode dev.');
                setSubject('Nouveautés Jobsira - Mise à jour importante');
                setMessage('Bonjour {{prenom}},\n\nNous avons le plaisir de vous annoncer de nouvelles fonctionnalités sur Jobsira.\n\n- Nouveau module de suivi des dépenses\n- Optimisation des performances IA\n- Amélioration du tableau de bord admin\n\nBonne navigation,\nL\'équipe Jobsira');
                setTemplateId('annonce');
                setExternalEmailsRaw('m9bikienga@gmail.com');
                setTargetAudience('test');
                toast.success('Champs remplis automatiquement (mode debug).');
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md border border-amber-200 hover:bg-amber-200 transition-colors"
            >
              DEBUG: Remplir tout
            </button>
          )}
        </div>

        {/* Main Form Grid */}
        <form onSubmit={handleSend} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Campaign Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Détails de la Campagne</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nom de la Campagne (Interne)</label>
                  <input 
                    type="text" 
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Ex: Mise à jour Produit Q3"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Texte d'aperçu (Preheader)</label>
                  <textarea 
                    value={preheader}
                    onChange={(e) => setPreheader(e.target.value)}
                    rows={3}
                    placeholder="Bref résumé visible depuis la boîte de réception..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800 resize-none"
                  />
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 mt-8">
                  <Info className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Ciblage d'Audience</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      Envoi à tous les utilisateurs. Les doublons seront automatiquement ignorés.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content: Email Editor */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
              
              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Sujet de l'Email</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Une excellente nouvelle pour vous..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 shadow-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-slate-700">Contenu de l'Email</label>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <button type="button" className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md">Éditeur Visuel</button>
                      <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors">HTML</button>
                    </div>
                  </div>
                  
                  <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    {/* Editor Toolbar */}
                    <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-1">
                      <button type="button" className="p-1.5 text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"><Bold className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 text-blue-400 hover:bg-slate-200 hover:text-slate-600 rounded transition-colors"><Italic className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 text-blue-400 hover:bg-slate-200 hover:text-slate-600 rounded transition-colors"><Underline className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-slate-300 mx-1"></div>
                      <button type="button" className="p-1.5 text-blue-400 hover:bg-slate-200 hover:text-slate-600 rounded transition-colors"><List className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 text-blue-400 hover:bg-slate-200 hover:text-slate-600 rounded transition-colors"><LinkIcon className="w-4 h-4" /></button>
                    </div>
                    {/* Textarea */}
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={8}
                      placeholder="Rédigez votre incroyable campagne ici..."
                      className="w-full p-4 focus:outline-none text-slate-700 text-sm resize-y"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Destinataires</label>
                    <select 
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 shadow-sm appearance-none"
                    >
                      <option value="all">Tous les abonnés actifs</option>
                      <option value="test">Segment Test Uniquement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Modèle Visuel (Template)</label>
                    <div className="relative">
                       <select 
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        className="w-full px-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 shadow-sm appearance-none cursor-pointer"
                      >
                        <option value="annonce">Annonce Standard</option>
                        <option value="promo">Alerte Promo</option>
                        <option value="minimal">Défaut Minimaliste</option>
                        <option value="artlist">Premium Sombre (Style Artlist)</option>
                        <option value="dreamforce">Premium Événement (Style Dreamforce)</option>
                      </select>
                      <LayoutTemplate className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                     <span>Ajouter des Emails Personnalisés (Optionnel)</span>
                     <span className="text-xs font-normal text-slate-400">{parsedExternalEmails.length} emails valides</span>
                   </label>
                   <textarea 
                      value={externalEmailsRaw}
                      onChange={(e) => setExternalEmailsRaw(e.target.value)}
                      rows={2}
                      placeholder="test@domaine.com, pdg@domaine.com"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-600 text-sm font-mono shadow-sm"
                    />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Sauvegarder Brouillon
                </button>
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={handleSendTest}
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Envoyer Test
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-lg transition-colors shadow-md shadow-blue-700/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Envoi...' : 'Envoyer la Campagne'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Confirmer l'envoi</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Êtes-vous sûr de vouloir envoyer cet email à <strong className="text-slate-900">{totalRecipients} utilisateur(s)</strong> au total ? Cette action est irréversible et la campagne partira immédiatement.
              </p>
              
              <div className="flex items-center gap-3 w-full">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={executeSend}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                >
                  <Send className="w-4 h-4" />
                  Oui, envoyer
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
