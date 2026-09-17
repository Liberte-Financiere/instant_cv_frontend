'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, CheckCircle2, XCircle, Clock, Globe, Phone, MapPin, 
  FileText, Search, RefreshCw, AlertCircle, ExternalLink, ShieldCheck, 
  User, Check, X, Loader2, FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

interface RecruiterDossier {
  id: string;
  name: string | null;
  email: string | null;
  companyName: string | null;
  companySector: string | null;
  companyPhone: string | null;
  companyCity: string | null;
  companyCountry: string | null;
  companyWebsite: string | null;
  companyTaxId: string | null;
  companySize: string | null;
  companyDescription: string | null;
  companyDocumentUrl: string | null;
  recruiterStatus: string;
  recruiterRejectionReason: string | null;
  recruiterVerifiedAt: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminRecruitersPage() {
  const [recruiters, setRecruiters] = useState<RecruiterDossier[]>([]);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Rejection modal state
  const [rejectingUser, setRejectingUser] = useState<RecruiterDossier | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchRecruiters = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/recruiters?status=${activeTab}`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setRecruiters(data.recruiters || []);
    } catch {
      toast.error('Impossible de charger les dossiers recruteurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, [activeTab]);

  const handleApprove = async (user: RecruiterDossier) => {
    setProcessingId(user.id);
    try {
      const res = await fetch('/api/admin/recruiters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action: 'APPROVE' }),
      });

      if (!res.ok) throw new Error('Erreur lors de la validation');

      toast.success(`Entreprise ${user.companyName || ''} validée avec succès !`);
      fetchRecruiters();
    } catch {
      toast.error("Échec de l'approbation.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingUser) return;
    setProcessingId(rejectingUser.id);
    try {
      const res = await fetch('/api/admin/recruiters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: rejectingUser.id,
          action: 'REJECT',
          reason: rejectionReason.trim(),
        }),
      });

      if (!res.ok) throw new Error('Erreur lors du rejet');

      toast.success(`Dossier de ${rejectingUser.companyName || ''} rejeté.`);
      setRejectingUser(null);
      setRejectionReason('');
      fetchRecruiters();
    } catch {
      toast.error('Échec du rejet du dossier.');
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = recruiters.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.companyName && r.companyName.toLowerCase().includes(q)) ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.companyCity && r.companyCity.toLowerCase().includes(q)) ||
      (r.companyTaxId && r.companyTaxId.toLowerCase().includes(q)) ||
      (r.companyDescription && r.companyDescription.toLowerCase().includes(q))
    );
  });

  const pendingCount = recruiters.filter(r => r.recruiterStatus === 'PENDING').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            Validation des Recruteurs
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Examinez et validez les entreprises candidates avant de leur ouvrir l'accès au portail et aux contacts candidats.
          </p>
        </div>

        <Button
          onClick={fetchRecruiters}
          variant="outline"
          className="border-slate-200 text-slate-700 hover:bg-slate-100 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          {[
            { key: 'PENDING', label: 'En attente', count: activeTab === 'PENDING' ? filtered.length : undefined },
            { key: 'APPROVED', label: 'Approuvés' },
            { key: 'REJECTED', label: 'Rejetés' },
            { key: 'ALL', label: 'Tous' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.key === 'PENDING' && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === 'PENDING' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  {tab.count !== undefined ? tab.count : recruiters.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher entreprise, contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm">Chargement des dossiers...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-16 text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700 text-lg">Aucun dossier trouvé</p>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            {activeTab === 'PENDING'
              ? 'Toutes les demandes de recruteurs ont été traitées !'
              : 'Aucun profil recruteur ne correspond aux filtres sélectionnés.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((r) => {
            const isPending = r.recruiterStatus === 'PENDING';
            const isApproved = r.recruiterStatus === 'APPROVED';
            const isRejected = r.recruiterStatus === 'REJECTED';
            const isProcessing = processingId === r.id;

            return (
              <div
                key={r.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-black text-slate-900 text-lg">{r.companyName || 'Sans nom'}</h3>
                        {isPending && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            En attente
                          </span>
                        )}
                        {isApproved && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Validé
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <X className="w-3 h-3" /> Refusé
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        {r.companySector && <span>Secteur : <strong>{r.companySector}</strong></span>}
                        {(r.companyCity || r.companyCountry) && (
                          <span>Localisation : <strong>{[r.companyCity, r.companyCountry].filter(Boolean).join(', ')}</strong></span>
                        )}
                        {r.companySize && <span>Taille : <strong>{r.companySize} sal.</strong></span>}
                        <span>Soumis le : {new Date(r.updatedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    {isPending && (
                      <>
                        <Button
                          onClick={() => handleApprove(r)}
                          disabled={isProcessing}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          Approuver
                        </Button>
                        <Button
                          onClick={() => {
                            setRejectingUser(r);
                            setRejectionReason('');
                          }}
                          disabled={isProcessing}
                          variant="outline"
                          className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs rounded-xl"
                        >
                          <XCircle className="w-4 h-4 mr-1.5" />
                          Refuser
                        </Button>
                      </>
                    )}
                    {isApproved && (
                      <Button
                        onClick={() => {
                          setRejectingUser(r);
                          setRejectionReason('Révocation administrative des accès.');
                        }}
                        disabled={isProcessing}
                        variant="ghost"
                        className="text-slate-400 hover:text-rose-600 text-xs"
                      >
                        Révoquer
                      </Button>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Demandeur
                    </p>
                    <p className="font-bold text-slate-800 truncate">{r.name || 'Anonyme'}</p>
                    <p className="text-slate-500 truncate">{r.email}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Contact téléphonique
                    </p>
                    <p className="font-bold text-slate-800">{r.companyPhone || 'Non renseigné'}</p>
                    {r.companyPhone && (
                      <a href={`tel:${r.companyPhone}`} className="text-blue-600 hover:underline">
                        Appeler
                      </a>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Justificatif RCCM / IFU
                    </p>
                    <p className="font-bold text-slate-800">
                      {r.companyTaxId || <span className="text-slate-400 font-normal">Sans N°</span>}
                    </p>
                    {r.companyDocumentUrl ? (
                      <a
                        href={r.companyDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 mt-1.5 hover:underline"
                      >
                        <FileCheck className="w-3.5 h-3.5 shrink-0" />
                        Voir le document officiel
                        <ExternalLink className="w-3 h-3 shrink-0 ml-0.5" />
                      </a>
                    ) : (
                      <span className="text-slate-400 font-normal block mt-1">Aucun document joint</span>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> Site Web / Lien
                    </p>
                    {r.companyWebsite ? (
                      <a
                        href={r.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 truncate font-medium"
                      >
                        <span className="truncate">{r.companyWebsite}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-400">Non renseigné</span>
                    )}
                  </div>
                </div>

                {r.companyDescription && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs space-y-1">
                    <p className="text-slate-400 font-semibold">Présentation de l'entreprise :</p>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{r.companyDescription}</p>
                  </div>
                )}

                {isRejected && r.recruiterRejectionReason && (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Motif de refus : </strong>
                      {r.recruiterRejectionReason}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              Refuser le dossier : {rejectingUser.companyName}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Indiquez le motif du refus. Ce message sera affiché au demandeur et lui sera envoyé par email pour lui permettre de corriger son dossier.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Motif du refus
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ex: Entreprise non joignable par téléphone, veuillez préciser votre structure..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setRejectingUser(null)}
                className="border-slate-200 text-slate-700"
              >
                Annuler
              </Button>
              <Button
                onClick={handleConfirmReject}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Confirmer le refus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
