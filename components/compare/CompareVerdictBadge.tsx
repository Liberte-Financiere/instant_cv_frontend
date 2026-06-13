import { Check, AlertCircle, HelpCircle } from 'lucide-react';

interface CompareVerdictBadgeProps {
  winner: 'jobsira' | 'competitor' | 'draw';
  competitorName: string;
}

export function CompareVerdictBadge({ winner, competitorName }: CompareVerdictBadgeProps) {
  if (winner === 'jobsira') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold rounded-lg uppercase tracking-wider">
        <Check className="w-3.5 h-3.5" /> Avantage Jobsira
      </span>
    );
  }
  if (winner === 'competitor') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100/60 text-slate-700 border border-slate-200/50 text-[10px] font-bold rounded-lg uppercase tracking-wider">
        <AlertCircle className="w-3.5 h-3.5" /> Avantage {competitorName}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary border border-primary/20 text-[10px] font-bold rounded-lg uppercase tracking-wider">
      <HelpCircle className="w-3.5 h-3.5" /> Égalité
    </span>
  );
}
