'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus, Briefcase, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Chargement...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mes Annonces</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez vos offres d'emploi publiées.</p>
        </div>
        <Link href="/recruiter/jobs/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="w-4 h-4" /> Nouvelle offre
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Aucune offre publiée</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Vous n'avez pas encore publié d'offres d'emploi. Publiez gratuitement votre première annonce pour attirer des talents.
          </p>
          <Link href="/recruiter/jobs/create">
            <Button className="bg-white text-black hover:bg-slate-200">
              Créer une annonce gratuite
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:border-white/20">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{job.title}</h3>
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                    job.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {job.status === 'ACTIVE' ? 'Actif' : 'Fermé'}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.company} ({job.type})</span>
                  {job.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>}
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Créé le {new Date(job.createdAt).toLocaleDateString()}</span>
                  {job.expiresAt && (
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <Calendar className="w-4 h-4" /> Expire le {new Date(job.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/jobs/${job.id}`} target="_blank">
                   <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" title="Voir l'annonce">
                     <ExternalLink className="w-4 h-4" />
                   </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleStatus(job.id, job.status)}
                  className="text-slate-300 hover:text-white bg-white/5 border border-white/10"
                >
                  {job.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => deleteJob(job.id)}
                  className="text-rose-400 hover:bg-rose-500/10"
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
