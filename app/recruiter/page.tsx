'use client';

import { useState, useCallback } from 'react';
import { SearchBar } from '@/components/recruiter/SearchBar';
import { SearchFilters } from '@/components/recruiter/SearchFilters';
import { CandidateCard } from '@/components/recruiter/CandidateCard';
import { Pagination } from '@/components/ui/Pagination';
import { Users, Search, SlidersHorizontal } from 'lucide-react';

interface SearchResult {
  id: string;
  anonymousName: string;
  title: string;
  sector: string | null;
  skills: string[];
  experienceYears: number;
  locationCity: string | null;
  locationCountry: string | null;
  completionScore: number;
  lastCvUpdate: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const DEFAULT_FILTERS = {
  sector: '',
  minExp: '',
  maxExp: '',
  city: '',
  skills: '',
};

export default function RecruiterSearchPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const executeSearch = useCallback(async (searchQuery: string, currentFilters: typeof DEFAULT_FILTERS, page: number = 1) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (currentFilters.sector) params.set('sector', currentFilters.sector);
      if (currentFilters.minExp) params.set('minExp', currentFilters.minExp);
      if (currentFilters.maxExp) params.set('maxExp', currentFilters.maxExp);
      if (currentFilters.city) params.set('city', currentFilters.city);
      if (currentFilters.skills) params.set('skills', currentFilters.skills);
      params.set('page', String(page));
      params.set('limit', '20');

      const res = await fetch(`/api/recruiter/search?${params.toString()}`);
      if (!res.ok) throw new Error('Erreur de recherche');

      const data = await res.json();
      setResults(data.profiles);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    executeSearch(searchQuery, filters, 1);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (hasSearched) {
      executeSearch(query, newFilters, 1);
    }
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    if (hasSearched) {
      executeSearch(query, DEFAULT_FILTERS, 1);
    }
  };

  const handlePageChange = (page: number) => {
    executeSearch(query, filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-8">
      {/* Hero */}
      <div className="text-center space-y-4 pt-12 pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-600 text-sm font-bold mb-4">
          <Users className="w-4 h-4" />
          Talent Pool
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Trouvez les meilleurs talents
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
          Recherchez parmi des profils vérifiés et qualifiés.
          Débloquez leurs coordonnées en un clic.
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col items-center gap-4">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-slate-500 font-medium hover:text-blue-600 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? 'Masquer les filtres' : 'Filtres avances'}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-slate-100 rounded-lg w-16" />
                <div className="h-6 bg-slate-100 rounded-lg w-20" />
                <div className="h-6 bg-slate-100 rounded-lg w-14" />
              </div>
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : hasSearched ? (
        <>
          {/* Count */}
          {pagination && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="text-slate-900 font-bold">{pagination.total}</span>{' '}
                profil{pagination.total !== 1 ? 's' : ''} trouves
              </p>
            </div>
          )}

          {results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((profile) => (
                  <CandidateCard key={profile.id} profile={profile} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Aucun profil trouve
              </h3>
              <p className="text-slate-500 text-sm">
                Essayez d&apos;elargir vos criteres de recherche ou de modifier vos filtres.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 rounded-3xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Lancez votre première recherche
          </h3>
          <p className="text-slate-500 text-base max-w-md mx-auto leading-relaxed">
            Utilisez la barre de recherche ci-dessus pour trouver des candidats
            par poste, compétence, secteur ou localisation.
          </p>
        </div>
      )}
    </div>
  );
}
