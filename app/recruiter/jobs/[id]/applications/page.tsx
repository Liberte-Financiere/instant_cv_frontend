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
  
  // Nouveaux filtres avancés
  const [searchQuery, setSearchQuery] = useState('');
  const [expFilter, setExpFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [activeDoc, setActiveDoc] = useState<'CV' | 'COVER_LETTER' | 'PORTFOLIO' | 'DIPLOMA' | 'NOTES'>('CV');
  
  const [noteSavedStatus, setNoteSavedStatus] = useState<'idle'|'saving'|'saved'>('idle');

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
      setSelectedApp((prev: any) => prev?.id === appId ? { ...prev, isRead: true } : prev);
    } catch (error) {
      console.error(error);
    }
  };

  const updateNotes = async (appId: string, notes: string) => {
    setNoteSavedStatus('saving');
    try {
      await fetch(`/api/recruiter/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      // Update local state
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, notes } : a));
      setSelectedApp((prev: any) => prev?.id === appId ? { ...prev, notes } : prev);
      setNoteSavedStatus('saved');
      setTimeout(() => setNoteSavedStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setNoteSavedStatus('idle');
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
    setActiveDoc('CV'); // Reset document view to CV
    if (!app.isRead) {
      markAsRead(app.id);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Chargement des candidatures...</div>;
  }

  const filteredApps = applications.filter(app => {
    // 1. Statut
    if (filter !== 'ALL' && app.status !== filter) return false;
    
    // 2. Recherche textuelle
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = `${app.firstName} ${app.lastName}`.toLowerCase().includes(q);
      const matchEmail = app.email?.toLowerCase().includes(q);
      if (!matchName && !matchEmail) return false;
    }
    
    // 3. Expérience
    if (expFilter !== 'ALL') {
      const exp = app.experienceYears || 0;
      if (expFilter === 'JUNIOR' && exp > 2) return false;
      if (expFilter === 'MED' && (exp < 3 || exp > 5)) return false;
      if (expFilter === 'SENIOR' && exp <= 5) return false;
    }
    
    // 4. Date de candidature
    if (dateFilter !== 'ALL' && app.createdAt) {
      const appDate = new Date(app.createdAt).getTime();
      const now = new Date().getTime();
      const diffHours = (now - appDate) / (1000 * 3600);
      
      if (dateFilter === 'TODAY' && diffHours > 24) return false;
      if (dateFilter === 'WEEK' && diffHours > 24 * 7) return false;
      if (dateFilter === 'MONTH' && diffHours > 24 * 30) return false;
    }
    
    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setExpFilter('ALL');
    setDateFilter('ALL');
  };

  const formatPhoneForWA = (phone: string) => {
    return phone.replace(/\\D/g, ''); // enlever les espaces, +, etc.
  };

  const formatTimeAgo = (dateString: string | Date) => {
    const diffInSeconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    if (diffInSeconds < 60) return "À l'instant";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours} h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return `Hier`;
    return `Il y a ${diffInDays} jours`;
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'NEW': return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded text-[10px] font-bold">Nouveau</span>;
      case 'REVIEWING': return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded text-[10px] font-bold">En cours</span>;
      case 'RETAINED': return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded text-[10px] font-bold">Retenu</span>;
      case 'REJECTED': return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-1 rounded text-[10px] font-bold">Rejeté</span>;
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
          
          {/* Barre de recherche et Toggle Filtres */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Chercher par nom, email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${showFilters || expFilter !== 'ALL' || dateFilter !== 'ALL' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              title="Filtres avancés"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Panneau de filtres avancés */}
          {showFilters && (
            <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <select 
                  value={expFilter}
                  onChange={(e) => setExpFilter(e.target.value)}
                  className="text-xs p-2 rounded border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ALL">Expérience : Tous</option>
                  <option value="JUNIOR">Junior (0-2 ans)</option>
                  <option value="MED">Inter. (3-5 ans)</option>
                  <option value="SENIOR">Senior (5+ ans)</option>
                </select>
                
                <select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="text-xs p-2 rounded border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ALL">Date : Toutes</option>
                  <option value="TODAY">Aujourd'hui</option>
                  <option value="WEEK">Cette semaine</option>
                  <option value="MONTH">Ce mois</option>
                </select>
              </div>
              
              {(searchQuery || expFilter !== 'ALL' || dateFilter !== 'ALL') && (
                <button 
                  onClick={clearFilters}
                  className="w-full text-xs text-slate-500 hover:text-slate-900 font-medium py-1"
                >
                  Réinitialiser les filtres avancés
                </button>
              )}
            </div>
          )}

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
            <div className="text-center mt-10 p-4">
              <p className="text-slate-500 font-medium mb-3">Aucune candidature trouvée pour ces critères.</p>
              {(searchQuery || expFilter !== 'ALL' || dateFilter !== 'ALL' || filter !== 'ALL') && (
                <button 
                  onClick={() => { clearFilters(); setFilter('ALL'); }}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg"
                >
                  Effacer tous les filtres
                </button>
              )}
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
                    {formatTimeAgo(app.createdAt)}
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
                  className={`text-sm font-bold rounded-lg px-4 py-2 border outline-none focus:ring-2 focus:ring-slate-500/20 appearance-none cursor-pointer pr-8 shadow-sm transition-colors ${
                    selectedApp.status === 'NEW' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : 
                    selectedApp.status === 'REVIEWING' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' :
                    selectedApp.status === 'RETAINED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                    'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
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

                {/* Document Viewer */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col h-[600px] mt-6">
                  <div className="border-b border-slate-200 bg-slate-50 flex items-center px-4 pt-2 gap-4 overflow-x-auto scrollbar-hide">
                    {selectedApp.cvUrl && (
                      <button 
                        onClick={() => setActiveDoc('CV')} 
                        className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeDoc === 'CV' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                      >
                        CV
                      </button>
                    )}
                    {selectedApp.coverLetterUrl && (
                      <button 
                        onClick={() => setActiveDoc('COVER_LETTER')} 
                        className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeDoc === 'COVER_LETTER' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                      >
                        Lettre de motiv.
                      </button>
                    )}
                    {selectedApp.portfolioUrl && (
                      <button 
                        onClick={() => setActiveDoc('PORTFOLIO')} 
                        className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeDoc === 'PORTFOLIO' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                      >
                        Portfolio
                      </button>
                    )}
                    {selectedApp.diplomaUrl && (
                      <button 
                        onClick={() => setActiveDoc('DIPLOMA')} 
                        className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeDoc === 'DIPLOMA' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                      >
                        Diplôme
                      </button>
                    )}
                    <button 
                      onClick={() => setActiveDoc('NOTES')} 
                      className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeDoc === 'NOTES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                    >
                      Notes
                    </button>
                  </div>
                  
                  {/* Action Bar for Active Document */}
                  {(() => {
                    if (activeDoc === 'NOTES') {
                      return (
                        <div className="flex-1 flex flex-col bg-white p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-bold text-slate-900">Notes Internes</h4>
                            <span className={`text-xs font-bold transition-opacity duration-300 ${noteSavedStatus === 'saved' ? 'text-emerald-600 opacity-100' : noteSavedStatus === 'saving' ? 'text-slate-400 opacity-100' : 'opacity-0'}`}>
                              {noteSavedStatus === 'saved' ? '✓ Enregistré' : 'Enregistrement...'}
                            </span>
                          </div>
                          <textarea 
                            className="flex-1 w-full p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 text-slate-700 placeholder-slate-400"
                            placeholder="Écrivez vos notes privées ici (forces, faiblesses, points d'attention). Elles seront sauvegardées automatiquement..."
                            defaultValue={selectedApp.notes || ''}
                            onBlur={(e) => {
                              if (e.target.value !== (selectedApp.notes || '')) {
                                updateNotes(selectedApp.id, e.target.value);
                              }
                            }}
                          ></textarea>
                          <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1">
                            Ces notes sont privées et ne seront jamais visibles par le candidat. Sauvegarde automatique.
                          </p>
                        </div>
                      );
                    }

                    let docUrl = '';
                    let docLabel = '';
                    if (activeDoc === 'CV' && selectedApp.cvUrl) { docUrl = `/api/documents/${selectedApp.id}/cv`; docLabel = 'Curriculum Vitae'; }
                    else if (activeDoc === 'COVER_LETTER' && selectedApp.coverLetterUrl) { docUrl = `/api/documents/${selectedApp.id}/cover-letter`; docLabel = 'Lettre de motivation'; }
                    else if (activeDoc === 'PORTFOLIO' && selectedApp.portfolioUrl) { docUrl = `/api/documents/${selectedApp.id}/portfolio`; docLabel = 'Portfolio'; }
                    else if (activeDoc === 'DIPLOMA' && selectedApp.diplomaUrl) { docUrl = `/api/documents/${selectedApp.id}/diploma`; docLabel = 'Diplôme'; }
                    
                    if (!docUrl) return <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50"><FileText className="w-10 h-10 mb-2 opacity-50" /><p>Document non fourni</p></div>;

                    // For the MVP, we just offer a clean download/open link instead of an iframe
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-sm w-full">
                          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                            <FileText className="w-8 h-8" />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 mb-2">{docLabel}</h4>
                          <p className="text-slate-500 text-sm mb-6">
                            Pour des raisons de sécurité et de confort de lecture, ce document s'ouvre dans un nouvel onglet.
                          </p>
                          <a href={docUrl} target="_blank" rel="noopener noreferrer" className="block">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 shadow-sm rounded-xl transition-all">
                              <Download className="w-4 h-4 mr-2" /> Ouvrir le document
                            </Button>
                          </a>
                        </div>
                      </div>
                    )
                  })()}
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
