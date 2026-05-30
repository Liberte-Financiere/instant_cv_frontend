'use client';

import { X, MapPin, Briefcase, Code } from 'lucide-react';
import { SECTORS } from '@/lib/constants';

interface SearchFiltersProps {
  filters: {
    sector: string;
    minExp: string;
    maxExp: string;
    city: string;
    skills: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

const EXP_RANGES = [
  { label: '0-2 ans', min: '0', max: '2' },
  { label: '3-5 ans', min: '3', max: '5' },
  { label: '6-10 ans', min: '6', max: '10' },
  { label: '10+ ans', min: '10', max: '' },
];

export function SearchFilters({ filters, onFilterChange, onClear }: SearchFiltersProps) {
  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="pt-2">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Sector */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Briefcase className="w-4 h-4" />
          </div>
          <select
            value={filters.sector}
            onChange={(e) => onFilterChange('sector', e.target.value)}
            className="h-12 pl-11 pr-8 bg-white/5 border border-white/10 rounded-xl text-base !text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer hover:border-white/20 w-full sm:w-auto min-w-[200px]"
          >
            <option value="" className="bg-slate-800 text-white">Tous les secteurs</option>
            {SECTORS.map((s) => (
              <option key={s} value={s} className="bg-slate-800 text-white">{s}</option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div className="relative group">
          <select
            value={filters.minExp ? `${filters.minExp}-${filters.maxExp}` : ''}
            onChange={(e) => {
              if (!e.target.value) {
                onFilterChange('minExp', '');
                onFilterChange('maxExp', '');
                return;
              }
              const range = EXP_RANGES.find(
                (r) => `${r.min}-${r.max}` === e.target.value
              );
              if (range) {
                onFilterChange('minExp', range.min);
                onFilterChange('maxExp', range.max);
              }
            }}
            className="h-12 px-5 bg-white/5 border border-white/10 rounded-xl text-base !text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer hover:border-white/20 w-full sm:w-auto"
          >
            <option value="" className="bg-slate-800 text-white">Expérience</option>
            {EXP_RANGES.map((r) => (
              <option key={`${r.min}-${r.max}`} value={`${r.min}-${r.max}`} className="bg-slate-800 text-white">
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => onFilterChange('city', e.target.value)}
            placeholder="Ville..."
            className="h-12 pl-11 pr-4 w-full sm:w-44 bg-white/5 border border-white/10 rounded-xl text-base !text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors hover:border-white/20"
          />
        </div>

        {/* Skills */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Code className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.skills}
            onChange={(e) => onFilterChange('skills', e.target.value)}
            placeholder="Compétences (React...)"
            className="h-12 pl-11 pr-4 w-full sm:w-60 bg-white/5 border border-white/10 rounded-xl text-base !text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors hover:border-white/20"
          />
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="h-12 px-5 flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-base font-bold rounded-xl hover:bg-red-500/20 transition-colors w-full sm:w-auto"
          >
            <X className="w-4 h-4" />
            Effacer
          </button>
        )}
      </div>
    </div>
  );
}
