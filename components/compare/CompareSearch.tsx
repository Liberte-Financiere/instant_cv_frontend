'use client';

import { useState } from 'react';
import { Competitor } from '@/data/compare';
import { CompareHubCard } from './CompareHubCard';
import { Search } from 'lucide-react';

const CATEGORIES = [
  'Tous',
  'Design CV',
  'Réseau professionnel',
  'Plateforme emploi',
  'Outil CV',
  'Plateforme locale Afrique'
];

interface CompareSearchProps {
  competitors: Competitor[];
}

export function CompareSearch({ competitors }: CompareSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('Tous');

  const filtered = competitors.filter((c) => {
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCat === 'Tous' || c.category === selectedCat;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un outil (ex: Canva, LinkedIn...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCat === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <CompareHubCard key={c.slug} competitor={c} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-slate-500 font-medium">Aucun comparatif trouvé pour votre recherche.</p>
        </div>
      )}
    </div>
  );
}
