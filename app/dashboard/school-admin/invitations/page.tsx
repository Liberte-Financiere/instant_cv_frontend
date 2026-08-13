'use client';

import { useEffect, useState } from 'react';
import { FileText, Loader2, Ban, Plus, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Invitation {
  id: string;
  email: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
  acceptedByUser?: {
    name: string | null;
    email: string | null;
  } | null;
}

export default function SchoolAdminInvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [generating, setGenerating] = useState(false);
  
  // To display the generated clear code to the admin
  const [generatedCode, setGeneratedCode] = useState<{ email: string, code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/b2b/school-admin/invitations');
      if (!res.ok) throw new Error('Erreur de chargement des invitations');
      const json = await res.json();
      setInvitations(json.invitations || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string; email: string }>({ isOpen: false, id: '', email: '' });

  const handleRevoke = async () => {
    const { id, email } = confirmModal;
    setConfirmModal({ ...confirmModal, isOpen: false });
    
    try {
      const res = await fetch(`/api/b2b/school-admin/invitations/${id}/revoke`, {
        method: 'PATCH'
      });
      if (!res.ok) {
         const data = await res.json();
         throw new Error(data.error || 'Erreur lors de la révocation');
      }
      
      toast.success('Invitation révoquée avec succès');
      setInvitations(invitations.map(inv => inv.id === id ? { ...inv, status: 'REVOKED' } : inv));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setGenerating(true);
    setGeneratedCode(null);
    setCopied(false);
    try {
      const res = await fetch('/api/b2b/school-admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim() })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur de génération');

      toast.success(data.message);
      setGeneratedCode({ email: newEmail.trim(), code: data.clearCode });
      setNewEmail('');
      // Prepend the new invitation
      setInvitations([data.invitation, ...invitations]);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Code copié !');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-600" />
            Invitations
          </h1>
          <p className="text-slate-500 mt-2">
            Générez de nouveaux accès pour vos étudiants et révoquez les invitations non utilisées.
          </p>
        </div>

        {/* Generate Box */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full md:w-96 shrink-0">
          <h3 className="font-bold text-slate-900 mb-4">Nouvelle Invitation</h3>
          <form onSubmit={handleGenerate} className="space-y-3">
            <input 
              type="email" 
              placeholder="Email de l'étudiant..."
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
            <button
              type="submit"
              disabled={generating || !newEmail.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Générer le code
            </button>
          </form>

          {/* Success Code Display */}
          {generatedCode && (
             <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-xs text-emerald-800 font-medium mb-2">
                  Invitation créée pour {generatedCode.email}.
                  <br/>
                  <strong className="text-red-600">Copiez ce code maintenant, il ne sera plus affiché !</strong>
                </p>
                <div className="flex items-center gap-2">
                   <code className="flex-1 bg-white px-3 py-2 rounded border border-emerald-200 text-emerald-900 font-bold text-center">
                     {generatedCode.code}
                   </code>
                   <button 
                     onClick={copyCode}
                     className="p-2 bg-emerald-200 hover:bg-emerald-300 text-emerald-800 rounded transition-colors"
                   >
                     {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   </button>
                </div>
             </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
             <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : invitations.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
             Aucune invitation générée pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Email contact</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Généré le</th>
                  <th className="px-6 py-4">Accepté par</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invitations.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{inv.email}</td>
                    <td className="px-6 py-4">
                       {inv.status === 'PENDING' && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">En attente</span>}
                       {inv.status === 'ACCEPTED' && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Acceptée</span>}
                       {inv.status === 'REVOKED' && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Révoquée</span>}
                       {inv.status === 'EXPIRED' && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Expirée</span>}
                    </td>
                    <td className="px-6 py-4">{new Date(inv.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                       {inv.acceptedByUser ? (
                         <div>
                           <p className="font-medium text-slate-700">{inv.acceptedByUser.name}</p>
                           <p>{inv.acceptedByUser.email}</p>
                         </div>
                       ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inv.status === 'PENDING' && (
                        <button
                          onClick={() => setConfirmModal({ isOpen: true, id: inv.id, email: inv.email })}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Révoquer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleRevoke}
        title="Révoquer l'invitation"
        description={`Êtes-vous sûr de vouloir révoquer l'invitation pour ${confirmModal.email} ? Cette action annulera le code d'accès.`}
        confirmText="Oui, révoquer"
        cancelText="Annuler"
      />
    </div>
  );
}
