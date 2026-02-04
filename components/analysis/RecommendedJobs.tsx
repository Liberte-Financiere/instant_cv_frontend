"use client";

import { Briefcase } from "lucide-react";

interface RecommendedJobsProps {
  jobs: {
    title: string;
    match: number;
    reason: string;
  }[];
}

export const RecommendedJobs = ({ jobs }: RecommendedJobsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-purple-600" />
        Postes Recommandés
      </h3>
      
      <div className="space-y-5">
        {jobs.map((job, idx) => (
          <div key={idx} className="group">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-slate-700 group-hover:text-purple-600 transition-colors">
                {job.title}
              </span>
              <span className="text-sm font-bold text-purple-600">{job.match}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${job.match}%` }}
              />
            </div>
            
            <p className="text-xs text-slate-500 leading-snug">
              {job.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
