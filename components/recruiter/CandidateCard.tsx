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
  };
}

export function CandidateCard({ profile }: CandidateCardProps) {
  const scoreColor =
    profile.completionScore >= 80
      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      : profile.completionScore >= 60
        ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
        : 'text-slate-400 bg-slate-400/10 border-slate-400/20';

  const location = [profile.locationCity, profile.locationCountry]
    .filter(Boolean)
    .join(', ');

  const timeAgo = getTimeAgo(profile.lastCvUpdate);

  return (
    <Link href={`/recruiter/profile/${profile.id}`}>
      <div className="group relative bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 rounded-[1.5rem] p-8 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
        
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center relative">
                <span className="text-2xl font-bold text-blue-300">
                  {profile.anonymousName}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl group-hover:text-blue-300 transition-colors line-clamp-1 mb-2">
                {profile.title || 'Candidat'}
              </h3>
              <div className="flex items-center gap-3">
                {profile.sector && (
                  <p className="text-base text-slate-400">{profile.sector}</p>
                )}
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-800/50 px-2.5 py-1 rounded border border-slate-700">
                  <Lock className="w-3.5 h-3.5" /> Anonyme
                </span>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${scoreColor} flex flex-col items-center`}>
            <span>{profile.completionScore}%</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {profile.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-blue-500/10 text-slate-300 hover:text-blue-300 text-sm font-medium rounded-lg border border-white/10 hover:border-blue-500/30 transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
          {profile.skills.length > 5 && (
            <span className="px-3.5 py-1.5 bg-white/5 text-slate-400 text-sm font-medium rounded-lg border border-white/5">
              +{profile.skills.length - 5}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5 relative z-10">
          <div className="flex items-center gap-5 text-sm font-medium text-slate-400">
            {profile.experienceYears > 0 && (
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-500" />
                {profile.experienceYears} an{profile.experienceYears > 1 ? 's' : ''}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-2 truncate max-w-[150px]">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="truncate">{location}</span>
              </span>
            )}
            <span className="flex items-center gap-2 hidden sm:flex">
              <Clock className="w-4 h-4 text-slate-500" />
              {timeAgo}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-base font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Voir le profil <ArrowRight className="w-5 h-5" />
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
