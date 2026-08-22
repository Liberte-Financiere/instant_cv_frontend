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

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (type) params.append('type', type);
      if (location) params.append('location', location);

      const res = await fetch(`/api/jobs?${params.toString()}`);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
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

          <form onSubmit={handleSearch} className="mt-8 max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-xl">
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
              className="bg-slate-100 rounded-xl px-4 py-3 text-slate-900 border border-transparent focus:outline-none focus:border-blue-500/50 focus:bg-white transition-colors md:max-w-[200px]"
            >
              <option value="">Tous les types</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Alternance">Alternance</option>
              <option value="Freelance">Freelance</option>
            </select>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-8 h-auto font-bold shrink-0">
              Rechercher
            </Button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-12">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin" /> Recherche en cours...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-slate-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1.5 text-slate-700"><Briefcase className="w-4 h-4" /> {job.company}</span>
                      {job.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>}
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs">{job.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-semibold text-slate-700">{job.salary || 'Salaire non spécifié'}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Il y a {Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 3600 * 24))} jours
                      </p>
                      {job.expiresAt && (
                        <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-wider">
                          Expire le {new Date(job.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <ChevronRight className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
