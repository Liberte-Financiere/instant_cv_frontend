"use client";

import { CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { SectionAudit } from "@/store/useCVStore";

interface SectionAuditCardProps {
  title: string;
  audit: SectionAudit;
}

export const SectionAuditCard = ({ title, audit }: SectionAuditCardProps) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "bg-green-100 text-green-700";
    if (s >= 60) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(audit.score)}`}>
          {audit.score}/100
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-green-600 font-medium">
            <CheckCircle className="w-4 h-4" />
            <span>Points Forts</span>
          </div>
          <ul className="space-y-2">
            {audit.strengths.map((str, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-green-500 shrink-0" />
                {str}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-amber-600 font-medium">
            <AlertTriangle className="w-4 h-4" />
            <span>À Améliorer</span>
          </div>
          <ul className="space-y-2">
            {audit.improvements.map((imp, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                {imp}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-blue-600 font-medium">
            <Lightbulb className="w-4 h-4" />
            <span>Conseils</span>
          </div>
          <ul className="space-y-2">
            {audit.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
