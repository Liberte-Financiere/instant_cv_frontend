'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, defaultValue = '', isLoading }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <div className="relative group mx-auto">
        <div className="relative flex items-center bg-white/5 rounded-2xl border border-white/10 overflow-hidden focus-within:border-blue-500 transition-colors">
          <div className="absolute left-5 text-slate-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par poste, compétence, secteur..."
            className="w-full h-20 pl-16 pr-44 bg-transparent !text-white placeholder:text-slate-400 focus:outline-none text-lg"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>
      </div>
    </form>
  );
}
