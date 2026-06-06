import { Check, AlertCircle, HelpCircle } from 'lucide-react';

interface CompareVerdictBadgeProps {
  winner: 'jobsira' | 'competitor' | 'draw';
  competitorName: string;
}

export function CompareVerdictBadge({ winner, competitorName }: CompareVerdictBadgeProps) {
  if (winner === 'jobsira') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-xs font-bold rounded-lg uppercase tracking-wider">
        <Check className="w-3.5 h-3.5" /> Avantage Jobsira
      </span>
    );
  }
  if (winner === 'competitor') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold rounded-lg uppercase tracking-wider">
        <AlertCircle className="w-3.5 h-3.5" /> Avantage {competitorName}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-lg uppercase tracking-wider">
      <HelpCircle className="w-3.5 h-3.5" /> Égalité
    </span>
  );
}
