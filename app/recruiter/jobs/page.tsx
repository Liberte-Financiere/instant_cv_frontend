'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus, Briefcase, MapPin, Calendar, ExternalLink, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const isRecruiter = session?.user?.role === 'RECRUITER' || session?.user?.role === 'ADMIN';
      if (!isRecruiter) {
        router.push('/dashboard');
      } else {
        fetchJobs();
      }
    }
  }, [status, session, router]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/recruiter/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await fetch(`/api/recruiter/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette offre ?')) return;
    try {
      await fetch(`/api/recruiter/jobs/${id}`, {
        method: 'DELETE',
      });
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Chargement...</div>;
  }

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes Annonces</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez vos offres d'emploi publiées.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher (titre, entreprise)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
          <Link href="/recruiter/jobs/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm rounded-xl px-5">
              <Plus className="w-4 h-4" /> Nouvelle offre
            </Button>
          </Link>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune offre publiée</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Vous n'avez pas encore publié d'offres d'emploi. Publiez gratuitement votre première annonce pour attirer des talents.
          </p>
          <Link href="/recruiter/jobs/create">
            <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm rounded-xl">
              Créer une annonce gratuite
            </Button>
          </Link>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun résultat</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Aucune offre ne correspond à votre recherche "{searchTerm}".
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:border-blue-300 hover:shadow-md group">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                    job.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {job.status === 'ACTIVE' ? 'Actif' : 'Fermé'}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700"><Briefcase className="w-4 h-4 text-slate-400" /> {job.company}</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-medium">{job.type}</span>
                  {job.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</span>}
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Créé le {new Date(job.createdAt).toLocaleDateString()}</span>
                  {job.expiresAt && (
                    <span className="flex items-center gap-1.5 text-rose-500 font-medium">
                      <Calendar className="w-4 h-4 text-rose-400" /> Expire le {new Date(job.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                  <div className="flex items-center gap-3 ml-2 border-l border-slate-200 pl-4">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium" title="Vues de l'annonce">
                      <Eye className="w-4 h-4 text-slate-400" /> {job.viewsCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {job.applyMethod === 'NATIVE' && (
                  <Link href={`/recruiter/jobs/${job.id}/applications`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white relative rounded-lg px-4 shadow-sm h-10">
                      Candidats
                      {job.totalApplications > 0 && (
                        <span className="ml-2 bg-blue-800/40 px-2 py-0.5 rounded-md text-xs font-medium" title={job.maxApplications ? `Quota : ${job.maxApplications}` : undefined}>
                          {job.totalApplications}{job.maxApplications ? ` / ${job.maxApplications}` : ''}
                        </span>
                      )}
                      {job.unreadApplications > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 border-2 border-white text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
                          {job.unreadApplications}
                        </span>
                      )}
                    </Button>
                  </Link>
                )}
                
                <Link href={`/jobs/${job.id}`} target="_blank">
                   <Button variant="ghost" className="h-10 w-10 p-0 text-slate-400 hover:text-slate-900 hover:bg-slate-100" title="Voir l'annonce">
                     <ExternalLink className="w-4 h-4" />
                   </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => toggleStatus(job.id, job.status)}
                  className="h-10 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-medium"
                >
                  {job.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => deleteJob(job.id)}
                  className="h-10 text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-medium px-4"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
