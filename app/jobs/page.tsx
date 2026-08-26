'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PublicJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [sector, setSector] = useState('');
  const [sectorsList, setSectorsList] = useState<string[]>([]);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchJobs(1);
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const res = await fetch('/api/jobs/filters');
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.sectors) {
          setSectorsList(data.data.sectors);
        }
      }
    } catch (error) {
      console.error('Failed to fetch filters', error);
    }
  };

  const fetchJobs = async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (type) params.append('type', type);
      if (location) params.append('location', location);
      if (sector) params.append('sector', sector);
      params.append('page', pageNum.toString());

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        if (pageNum === 1) {
          setJobs(result.data || []);
        } else {
          setJobs(prev => [...prev, ...(result.data || [])]);
        }
        setHasMore(result.hasMore);
        setPage(pageNum);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const loadMore = () => {
    fetchJobs(page + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Trouvez le job idéal sur <span className="text-blue-600">Jobsira</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explorez des centaines d'opportunités professionnelles. Des startups aux grands groupes, votre prochaine aventure commence ici.
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-xl">
            <div className="flex-1 flex items-center bg-slate-100 rounded-xl px-4 py-3 gap-3 border border-transparent focus-within:border-blue-500/50 focus-within:bg-white transition-colors">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Intitulé, mots-clés, entreprise..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <div className="flex-1 flex items-center bg-slate-100 rounded-xl px-4 py-3 gap-3 border border-transparent focus-within:border-blue-500/50 focus-within:bg-white transition-colors">
              <MapPin className="w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Ville, pays ou Télétravail"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-slate-100 rounded-xl px-4 py-3 text-slate-900 border border-transparent focus:outline-none focus:border-blue-500/50 focus:bg-white transition-colors md:max-w-[160px]"
            >
              <option value="">Tous les types</option>
              <option value="JOB_LOCAL">Emploi Local</option>
              <option value="JOB_INTERNATIONAL">Emploi International</option>
              <option value="INTERNSHIP">Stage</option>
              <option value="SCHOLARSHIP">Bourse d'études</option>
              <option value="CALL_FOR_TENDERS">Appel d'offres</option>
              <option value="OTHER">Autre</option>
            </select>
            <select 
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="bg-slate-100 rounded-xl px-4 py-3 text-slate-900 border border-transparent focus:outline-none focus:border-blue-500/50 focus:bg-white transition-colors md:max-w-[160px]"
            >
              <option value="">Tous secteurs</option>
              {sectorsList.map(s => (
                <option key={s} value={s}>{s.length > 20 ? s.substring(0, 20) + '...' : s}</option>
              ))}
            </select>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-8 h-auto font-bold shrink-0">
              Rechercher
            </Button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 animate-pulse h-full">
                <div className="flex justify-between items-start gap-4">
                  <div className="h-6 bg-slate-200 rounded-lg w-3/4"></div>
                </div>
                
                <div className="flex flex-wrap gap-3 flex-1 mt-2">
                  <div className="h-5 bg-slate-100 rounded-md w-24"></div>
                  <div className="h-5 bg-slate-100 rounded-md w-32"></div>
                  <div className="h-5 bg-slate-100 rounded-md w-20"></div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded-md w-28"></div>
                    <div className="h-3 bg-slate-100 rounded-md w-40"></div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0"></div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-slate-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group h-full">
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{job.title}</h2>
                    {job.source === 'NATIVE' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-md shrink-0">
                        Nouveau
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500 flex-1">
                    <span className="flex items-center gap-1.5 text-slate-700"><Briefcase className="w-4 h-4" /> {job.company}</span>
                    {job.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>}
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs">{job.type}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{job.salary || 'Salaire non spécifié'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-slate-500">
                          Il y a {Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 3600 * 24))} jours
                        </p>
                        {job.expiresAt && (
                          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                            • Expire le {new Date(job.expiresAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors shrink-0">
                      <ChevronRight className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={loadMore} 
                  disabled={loadingMore}
                  className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-xl py-3 px-8 font-bold"
                >
                  {loadingMore ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Chargement...</> : "Charger plus d'offres"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
