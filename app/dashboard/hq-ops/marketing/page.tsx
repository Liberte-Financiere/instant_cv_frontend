'use client';

import { useState, useEffect, useMemo } from 'react';
import { Send, Users, AlertCircle, Loader2, ArrowLeft, LayoutTemplate, Link as LinkIcon, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MarketingPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [templateId, setTemplateId] = useState('annonce');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [externalEmailsRaw, setExternalEmailsRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState<number | null>(null);

  // Calcule en temps réel la liste des e-mails externes valides
  const parsedExternalEmails = useMemo(() => {
    if (!externalEmailsRaw) return [];
    // Sépare par les retours à la ligne ou les virgules
    const rawList = externalEmailsRaw.split(/[\n,]+/);
    // Regex simple d'e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return rawList
      .map(email => email.replace(/[<>]/g, '').trim().toLowerCase())
      .filter(email => emailRegex.test(email));
  }, [externalEmailsRaw]);
  
  const totalRecipients = (subscribersCount || 0) + parsedExternalEmails.length;

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error('Veuillez remplir le sujet et le message.');
      return;
    }

      const confirmSend = window.confirm(`Êtes-vous sûr de vouloir envoyer cet email à ${totalRecipients} utilisateur(s) au total ?`);
      if (!confirmSend) return;

      setLoading(true);
      try {
        const res = await fetch('/api/hq-ops/marketing/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            subject, 
            message, 
            templateId, 
            buttonText, 
            buttonUrl,
            externalEmails: parsedExternalEmails
          }),
        });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'envoi");

      toast.success(data.message || 'Emails envoyés avec succès !');
      setSubject('');
      setMessage('');
      setButtonText('');
      setButtonUrl('');
      setExternalEmailsRaw('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <Link href="/dashboard/hq-ops" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Retour au QG
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Campagne Emailing</h1>
        <p className="text-slate-500">Envoyez des mises à jour aux utilisateurs ayant consenti (Opt-in).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonne Stats */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Abonnés Jobsira</p>
                <h2 className="text-3xl font-black text-slate-900">
                  {subscribersCount === null ? '...' : subscribersCount}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6 pt-4 border-t border-slate-100">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Emails externes valides</p>
                <h2 className="text-3xl font-black text-indigo-900">
                  {parsedExternalEmails.length}
                </h2>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Total envois prévus : <strong>{totalRecipients}</strong>.<br/> Les doublons éventuels seront ignorés.
              </p>
            </div>
          </div>
        </div>

        {/* Colonne Formulaire */}
        <div className="md:col-span-2">
          <form onSubmit={handleSend} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Sujet de l'email</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="ex: Nouvelle fonctionnalité IA sur Jobsira !"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Contenu du message (Texte ou HTML)</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                placeholder="Bonjour à tous, nous venons de lancer..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 resize-y"
              />
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                <span>Destinataires supplémentaires (Copier/Coller)</span>
                <span className="text-xs font-normal text-slate-500">{parsedExternalEmails.length} valide(s)</span>
              </label>
              <p className="text-xs text-slate-500 pb-1">Collez une liste d'e-mails (séparés par des virgules ou retours à la ligne).</p>
              <textarea 
                value={externalEmailsRaw}
                onChange={(e) => setExternalEmailsRaw(e.target.value)}
                rows={4}
                placeholder="jean.dupont@gmail.com&#10;marie@societe.com, prospect@test.fr"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 resize-y text-sm font-mono"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-slate-400" />
                  Template Visuel
                </label>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                >
                  <option value="annonce">L'Annonce (Classique & Pro)</option>
                  <option value="promo">La Promo (Flashy & Urgent)</option>
                  <option value="minimal">Le Minimaliste (Épuré)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Texte du Bouton d'Action (Optionnel)</label>
                <input 
                  type="text" 
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="ex: Découvrir maintenant"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-slate-400" />
                  Lien du Bouton (URL)
                </label>
                <input 
                  type="url" 
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  placeholder="ex: https://jobsira.com/features"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                type="submit"
                disabled={loading || totalRecipients === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? 'Envoi en cours...' : 'Envoyer la campagne'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
