import { ComparisonFeature } from '@/data/compare';
import { CompareVerdictBadge } from './CompareVerdictBadge';

interface CompareTableProps {
  features: ComparisonFeature[];
  competitorName: string;
}

export function CompareTable({ features, competitorName }: CompareTableProps) {
  return (
    <div className="w-full overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50/75 border-b border-slate-200">
            <th className="py-4.5 px-6 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 w-1/4">Fonctionnalité</th>
            <th className="py-4.5 px-6 text-[10px] font-extrabold uppercase tracking-wider text-primary w-1/3">Jobsira</th>
            <th className="py-4.5 px-6 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 w-1/3">{competitorName}</th>
            <th className="py-4.5 px-6 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 w-1/6 text-center">Verdict</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {features.map((item, index) => (
            <tr key={index} className="hover:bg-slate-50/50 transition-colors duration-150">
              <td className="py-5 px-6 text-sm font-extrabold text-slate-900">{item.feature}</td>
              <td className="py-5 px-6 text-sm font-semibold text-slate-800 leading-relaxed bg-primary/[0.01]">{item.jobsira}</td>
              <td className="py-5 px-6 text-sm text-slate-500 leading-relaxed">{item.competitor}</td>
              <td className="py-5 px-6 text-center whitespace-nowrap">
                <CompareVerdictBadge winner={item.winner} competitorName={competitorName} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
