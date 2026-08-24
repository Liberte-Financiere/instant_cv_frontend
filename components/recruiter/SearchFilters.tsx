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
            className="h-12 pl-11 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all appearance-none cursor-pointer hover:border-slate-300 w-full sm:w-auto min-w-[200px] shadow-sm font-medium"
          >
            <option value="" className="bg-white text-slate-900">Tous les secteurs</option>
            {SECTORS.map((s) => (
              <option key={s} value={s} className="bg-white text-slate-900">{s}</option>
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
            className="h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all appearance-none cursor-pointer hover:border-slate-300 w-full sm:w-auto shadow-sm font-medium"
          >
            <option value="" className="bg-white text-slate-900">Expérience</option>
            {EXP_RANGES.map((r) => (
              <option key={`${r.min}-${r.max}`} value={`${r.min}-${r.max}`} className="bg-white text-slate-900">
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
            className="h-12 pl-11 pr-4 w-full sm:w-44 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all hover:border-slate-300 shadow-sm font-medium"
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
            className="h-12 pl-11 pr-4 w-full sm:w-60 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all hover:border-slate-300 shadow-sm font-medium"
          />
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="h-12 px-5 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 text-base font-bold rounded-xl hover:bg-rose-100 transition-colors w-full sm:w-auto shadow-sm"
          >
            <X className="w-4 h-4" />
            Effacer
          </button>
        )}
      </div>
    </div>
  );
}
