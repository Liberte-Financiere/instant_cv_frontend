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
        <div className="relative flex items-center bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(36,99,235,0.15)] transition-all duration-300 overflow-hidden">
          <div className="absolute left-5 text-slate-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par poste, projet, compétence..."
            className="w-full h-20 pl-16 pr-44 bg-transparent !text-white placeholder:text-slate-400 focus:outline-none text-lg"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-3 px-8 py-4 bg-primary hover:bg-primary-dark text-white text-base font-bold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            {isLoading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>
      </div>
    </form>
  );
}
