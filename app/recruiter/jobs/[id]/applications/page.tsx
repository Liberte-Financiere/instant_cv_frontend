'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, Search, Filter, Phone, Mail, MessageCircle, FileText, CheckCircle, XCircle, Clock, Star, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ApplicationsATSPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id: jobId } = resolvedParams;
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, NEW, REVIEWING, RETAINED, REJECTED
  
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const isRecruiter = session?.user?.role === 'RECRUITER' || session?.user?.role === 'ADMIN';
      if (!isRecruiter) {
        router.push('/dashboard');
      } else {
        fetchApplications();
      }
    }
  }, [status, session, router]);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`/api/recruiter/jobs/${jobId}/applications`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else {
        router.push('/recruiter/jobs');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (appId: string) => {
    try {
      await fetch(`/api/recruiter/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      });
      // Update local state
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, isRead: true } : a));
      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, isRead: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (appId: string, newStatus: string) => {
    try {
      await fetch(`/api/recruiter/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      // Update local state
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectApp = (app: any) => {
    setSelectedApp(app);
    if (!app.isRead) {
      markAsRead(app.id);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Chargement des candidatures...</div>;
  }

  const filteredApps = filter === 'ALL' ? applications : applications.filter(a => a.status === filter);

  const formatPhoneForWA = (phone: string) => {
    return phone.replace(/\\D/g, ''); // enlever les espaces, +, etc.
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'NEW': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-[10px] font-bold">Nouveau</span>;
      case 'REVIEWING': return <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-[10px] font-bold">En cours</span>;
      case 'RETAINED': return <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold">Retenu</span>;
      case 'REJECTED': return <span className="bg-rose-500/20 text-rose-400 px-2 py-1 rounded text-[10px] font-bold">Rejeté</span>;
      default: return null;
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Left panel: List */}
      <div className={`w-full md:w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col ${selectedApp ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-slate-200 shrink-0 bg-white">
          <Link href="/recruiter/jobs" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Retour aux annonces
          </Link>
          <h1 className="text-xl font-bold text-slate-900 mb-4">Candidats ({applications.length})</h1>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['ALL', 'NEW', 'REVIEWING', 'RETAINED', 'REJECTED'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${filter === f ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {f === 'ALL' ? 'Tous' : f === 'NEW' ? 'Nouveaux' : f === 'REVIEWING' ? 'En cours' : f === 'RETAINED' ? 'Retenus' : 'Rejetés'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredApps.length === 0 ? (
            <div className="text-center text-slate-500 mt-10 p-4 font-medium">
              Aucune candidature trouvée pour ce filtre.
            </div>
          ) : (
            filteredApps.map(app => (
              <div 
                key={app.id} 
                onClick={() => handleSelectApp(app)}
                className={`p-4 rounded-xl cursor-pointer transition-all border shadow-sm ${selectedApp?.id === app.id ? 'bg-blue-50 border-blue-200 shadow-blue-100' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    {!app.isRead && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    {app.firstName} {app.lastName}
                  </h3>
                  {getStatusBadge(app.status)}
                </div>
                <p className="text-xs text-slate-500 mb-2 truncate font-medium">{app.email}</p>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Il y a {Math.floor((new Date().getTime() - new Date(app.createdAt).getTime()) / (1000 * 3600 * 24))} jours
                  </span>
                  {app.experienceYears !== null && (
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {app.experienceYears} an{app.experienceYears > 1 ? 's' : ''} exp.
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right panel: Details */}
      <div className={`w-full md:w-2/3 bg-white flex flex-col ${!selectedApp ? 'hidden md:flex' : 'flex'}`}>
        {selectedApp ? (
          <>
            <div className="p-6 border-b border-slate-200 shrink-0 bg-white flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedApp(null)} className="md:hidden text-slate-400 hover:text-slate-900">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedApp.firstName} {selectedApp.lastName}</h2>
                  <p className="text-sm text-slate-500 font-medium">Postulé le {new Date(selectedApp.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  value={selectedApp.status}
                  onChange={(e) => updateStatus(selectedApp.id, e.target.value)}
                  className={`text-sm font-bold rounded-lg px-4 py-2 border-none outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer pr-8 shadow-sm ${
                    selectedApp.status === 'NEW' ? 'bg-blue-600 text-white' : 
                    selectedApp.status === 'REVIEWING' ? 'bg-amber-500 text-white' :
                    selectedApp.status === 'RETAINED' ? 'bg-emerald-600 text-white' :
                    'bg-rose-500 text-white'
                  }`}
                >
                  <option value="NEW">Nouveau</option>
                  <option value="REVIEWING">En cours</option>
                  <option value="RETAINED">Retenu</option>
                  <option value="REJECTED">Rejeté</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
              <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Actions Rapides */}
                <div className="grid grid-cols-3 gap-4">
                  <a href={`https://wa.me/${formatPhoneForWA(selectedApp.phone)}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 py-6 rounded-xl shadow-sm">
                      <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                    </Button>
                  </a>
                  <a href={`mailto:${selectedApp.email}`}>
                    <Button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 py-6 rounded-xl shadow-sm">
                      <Mail className="w-5 h-5 mr-2" /> Email
                    </Button>
                  </a>
                  <a href={`tel:${selectedApp.phone}`}>
                    <Button className="w-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 py-6 rounded-xl shadow-sm">
                      <Phone className="w-5 h-5 mr-2" /> Appeler
                    </Button>
                  </a>
                </div>

                {/* Détails */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Disponibilité</h4>
                    <p className="text-slate-900 font-medium">{selectedApp.availability}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Prétentions salariales</h4>
                    <p className="text-slate-900 font-medium">{selectedApp.salaryExpectation || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Expérience</h4>
                    <p className="text-slate-900 font-medium">{selectedApp.experienceYears !== null ? `${selectedApp.experienceYears} an(s)` : 'Non renseigné'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Téléphone</h4>
                    <p className="text-slate-900 font-medium">{selectedApp.phone}</p>
                  </div>
                </div>

                {/* Résumé */}
                {selectedApp.profileSummary && (
                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">En quelques mots</h4>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedApp.profileSummary}</p>
                  </div>
                )}

                {/* CV Visualizer */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col h-[600px]">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" /> Curriculum Vitae
                    </h4>
                    <a href={selectedApp.cvUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 bg-white hover:bg-slate-50">
                        <Download className="w-4 h-4 mr-2" /> Télécharger
                      </Button>
                    </a>
                  </div>
                  <div className="flex-1 bg-slate-100 relative">
                    <iframe 
                      src={selectedApp.cvUrl.endsWith('.pdf') ? `${selectedApp.cvUrl}#toolbar=0` : `https://docs.google.com/gview?url=${encodeURIComponent(selectedApp.cvUrl)}&embedded=true`} 
                      className="w-full h-full border-none bg-white"
                      title="CV"
                    />
                  </div>
                </div>

              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Sélectionnez un candidat</h3>
            <p className="text-slate-500 max-w-sm font-medium">
              Cliquez sur une candidature dans la liste de gauche pour voir les détails, le CV et effectuer des actions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
