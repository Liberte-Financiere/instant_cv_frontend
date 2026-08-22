import Link from 'next/link';
import { Competitor } from '@/data/compare';
import {ArrowRight, Wand2} from 'lucide-react';

interface CompareHubCardProps {
  competitor: Competitor;
}

export function CompareHubCard({ competitor }: CompareHubCardProps) {
  return (
    <div className="group relative overflow-hidden bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 flex flex-col h-full justify-between">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/20 via-primary to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">
            {competitor.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-primary font-bold">
            <Wand2 className="w-3 h-3" /> Vs Jobsira
          </span>
        </div>
        <h3 className="font-extrabold text-xl text-slate-900 mb-2 group-hover:text-primary transition-colors duration-200">
          Jobsira vs {competitor.name}
        </h3>
        <p className="text-xs font-semibold text-slate-500 italic mb-4">
          &ldquo;{competitor.tagline}&rdquo;
        </p>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
          {competitor.description}
        </p>
      </div>
      <div className="border-t border-slate-100 pt-4 mt-auto">
        <Link 
          href={`/compare/${competitor.slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
        >
          Voir le comparatif complet
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-350" />
        </Link>
      </div>
    </div>
  );
}
