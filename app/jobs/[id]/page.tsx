'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, Calendar, Clock, DollarSign, AlertTriangle, ExternalLink, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        Chargement de l'offre...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <AlertTriangle className="w-16 h-16 text-rose-500" />
        <h1 className="text-2xl font-bold text-slate-900">Offre introuvable</h1>
        <p className="text-slate-500 max-w-md">Cette offre a peut-être été pourvue, supprimée ou n'a jamais existé.</p>
        <Link href="/jobs">
          <Button className="bg-slate-900 text-white hover:bg-slate-800">Retour aux annonces</Button>
        </Link>
      </div>
    );
  }

  const isEmail = job.applyMethod === 'EMAIL';
  const applyHref = isEmail ? `mailto:${job.applyUrlOrMail}?subject=Candidature: ${job.title}` : job.applyUrlOrMail;
  const isExpired = job.expiresAt ? new Date(job.expiresAt) < new Date() : false;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Retour aux offres
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                  <Briefcase className="w-4 h-4 text-blue-600" /> {job.company}
                </span>
                {job.location && (
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                    <MapPin className="w-4 h-4 text-emerald-600" /> {job.location}
                  </span>
                )}
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                  <Clock className="w-4 h-4 text-purple-600" /> {job.type}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                    <DollarSign className="w-4 h-4 text-amber-600" /> {job.salary}
                  </span>
                )}
                {job.expiresAt && (
                  <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isExpired ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
                    <Calendar className="w-4 h-4" /> {isExpired ? 'Expirée le' : 'Expire le'} {new Date(job.expiresAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
              {isExpired ? (
                <Button disabled className="w-full bg-slate-100 text-slate-500 font-bold py-6 px-8 rounded-xl text-lg shadow-sm border border-slate-200 cursor-not-allowed">
                  <AlertTriangle className="w-5 h-5 mr-2" /> Offre expirée
                </Button>
              ) : (
                <>
                  {job.applyMethod === 'NATIVE' ? (
                    job.maxApplicationsReached ? (
                      <Button disabled className="w-full bg-slate-100 text-slate-500 font-bold py-6 px-8 rounded-xl text-lg shadow-sm border border-slate-200 cursor-not-allowed">
                        <AlertTriangle className="w-5 h-5 mr-2" /> Quota de candidatures atteint
                      </Button>
                    ) : (
                      <Link href={`/jobs/${job.id}/apply`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                          <Briefcase className="w-5 h-5 mr-2" /> Postuler maintenant
                        </Button>
                      </Link>
                    )
                  ) : (
                    <>
                      {job.applicationEmail && (
                        <a 
                          href={`mailto:${job.applicationEmail}?subject=Candidature: ${job.title}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => {
                            fetch(`/api/jobs/${resolvedParams.id}`, { method: 'POST' }).catch(() => {});
                          }}
                        >
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                            <Send className="w-5 h-5 mr-2" /> Postuler par Email
                          </Button>
                        </a>
                      )}
                      
                      {job.applicationUrl && (
                        <a 
                          href={job.applicationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => {
                            fetch(`/api/jobs/${resolvedParams.id}`, { method: 'POST' }).catch(() => {});
                          }}
                        >
                          <Button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-6 px-8 rounded-xl text-lg shadow-sm border border-blue-200/50">
                            <ExternalLink className="w-5 h-5 mr-2" /> Postuler sur le site
                          </Button>
                        </a>
                      )}

                      {/* Fallback pour les offres natives ou si aucun des deux n'est défini explicitement */}
                      {!job.applicationEmail && !job.applicationUrl && (
                        <a 
                          href={applyHref} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => {
                            fetch(`/api/jobs/${resolvedParams.id}`, { method: 'POST' }).catch(() => {});
                          }}
                        >
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                            {isEmail ? (
                              <><Send className="w-5 h-5 mr-2" /> Postuler par Email</>
                            ) : (
                              <><ExternalLink className="w-5 h-5 mr-2" /> Postuler sur le site</>
                            )}
                          </Button>
                        </a>
                      )}
                    </>
                  )}
                </>
              )}
              <p className="text-xs text-center text-slate-500 font-medium">
                Publié le {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* Description */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4">Description du poste</h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </section>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4">Profil recherché & Compétences</h2>
              <ul className="grid gap-3">
                {job.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle className="w-24 h-24 text-amber-500" />
             </div>
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-amber-500 font-bold">
                   <AlertTriangle className="w-5 h-5" /> 
                   Alerte Sécurité
                </div>
                <p className="text-sm text-amber-500/80 leading-relaxed">
                   <strong>Aucun recruteur sérieux ne vous demandera de l'argent</strong> (frais de dossier, formation, matériel) avant d'être officiellement recruté.
                </p>
                <p className="text-xs text-amber-500/60 leading-relaxed">
                   Afin d'éviter les arnaques, ne transférez jamais d'argent. Jobsira met à disposition cet espace publicitaire gratuitement et ne saurait être tenu responsable des agissements des entreprises.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
