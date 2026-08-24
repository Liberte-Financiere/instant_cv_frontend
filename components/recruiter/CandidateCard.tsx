'use client';

import { MapPin, Briefcase, Star, Clock, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CandidateCardProps {
  profile: {
    id: string;
    anonymousName: string;
    title: string;
    sector: string | null;
    skills: string[];
    experienceYears: number;
    locationCity: string | null;
    locationCountry: string | null;
    completionScore: number;
    lastCvUpdate: string;
    projects?: {
      name: string;
      description: string;
      technologies?: string;
    }[];
  };
}

export function CandidateCard({ profile }: CandidateCardProps) {
  const scoreColor =
    profile.completionScore >= 80
      ? 'text-primary bg-primary/10 border-primary/30'
      : profile.completionScore >= 60
        ? 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20'
        : 'text-slate-400 bg-slate-400/10 border-slate-400/20';

  const location = [profile.locationCity, profile.locationCountry]
    .filter(Boolean)
    .join(', ');

  const timeAgo = getTimeAgo(profile.lastCvUpdate);

  return (
    <Link href={`/recruiter/profile/${profile.id}`}>
      <div className="group relative bg-white border border-slate-200 hover:border-blue-300 rounded-[1.5rem] p-8 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between h-full">
        
        <div>
          <div className="flex items-start justify-between mb-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center relative">
                  <span className="text-2xl font-bold text-blue-600">
                    {profile.anonymousName}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-xl group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                  {profile.title || 'Candidat'}
                </h3>
                <div className="flex items-center gap-3">
                  {profile.sector && (
                    <p className="text-base text-slate-500 font-medium">{profile.sector}</p>
                  )}
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                    <Lock className="w-3.5 h-3.5" /> Anonyme
                  </span>
                </div>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${scoreColor} flex flex-col items-center shrink-0`}>
              <span>{profile.completionScore}%</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 relative z-10">
            {profile.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-semibold rounded-lg border border-slate-200 hover:border-blue-200 transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
            {profile.skills.length > 5 && (
              <span className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-semibold rounded-lg border border-slate-200">
                +{profile.skills.length - 5}
              </span>
            )}
          </div>

          {/* Key Projects Section */}
          {profile.projects && profile.projects.length > 0 && (
            <div className="mb-6 pt-4 border-t border-slate-100 relative z-10">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Projets Clés
              </h4>
              <div className="space-y-3">
                {profile.projects.slice(0, 2).map((proj, idx) => (
                  <div key={idx} className="text-xs bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{proj.name}</span>
                      {proj.technologies && (
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                          {proj.technologies}
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-slate-500 mt-1 line-clamp-1 leading-relaxed font-medium">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100 relative z-10">
          <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
            {profile.experienceYears > 0 && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {profile.experienceYears} an{profile.experienceYears > 1 ? 's' : ''}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1.5 truncate max-w-[120px]">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="truncate">{location}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 hidden sm:flex">
              <Clock className="w-4 h-4 text-slate-400" />
              {timeAgo}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Profil <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} an(s)`;
}
