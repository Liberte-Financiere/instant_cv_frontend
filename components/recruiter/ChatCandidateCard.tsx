import Link from 'next/link';
import { MapPin, Briefcase, Star, ArrowRight } from 'lucide-react';
import { ScoredCandidate } from '@/lib/talent-assistant';

interface ChatCandidateCardProps {
  candidate: ScoredCandidate;
}

export function ChatCandidateCard({ candidate }: ChatCandidateCardProps) {
  const scoreColor =
    candidate.compatibilityScore >= 80
      ? 'text-primary bg-primary/10 border-primary/30'
      : candidate.compatibilityScore >= 60
        ? 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20'
        : 'text-slate-400 bg-slate-400/10 border-slate-400/20';

  const location = [candidate.locationCity, candidate.locationCountry]
    .filter(Boolean)
    .join(', ');

  return (
    <Link href={`/recruiter/profile/${candidate.id}`} target="_blank">
      <div className="group relative bg-slate-900/80 border border-slate-800 hover:bg-slate-900 hover:border-primary/50 rounded-2xl p-4 transition-all duration-300 cursor-pointer overflow-hidden my-2 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">
                {candidate.anonymousName}
              </span>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">
                {candidate.title || 'Candidat'}
              </h4>
              {candidate.sector && (
                <p className="text-xs text-slate-400 line-clamp-1">{candidate.sector}</p>
              )}
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded-lg text-xs font-bold border ${scoreColor} shrink-0`} title="Score de compatibilite">
            {candidate.compatibilityScore}/100
          </div>
        </div>

        {candidate.skills && candidate.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-white/5 text-slate-300 text-[10px] font-semibold rounded border border-white/5"
              >
                {skill}
              </span>
            ))}
            {candidate.skills.length > 3 && (
              <span className="px-2 py-0.5 bg-white/5 text-slate-400 text-[10px] font-semibold rounded border border-white/5">
                +{candidate.skills.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
            {candidate.experienceYears > 0 && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-500" />
                {candidate.experienceYears} an{candidate.experienceYears > 1 ? 's' : ''}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1 truncate max-w-[100px]">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span className="truncate">{location}</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-[11px] font-bold text-primary opacity-50 group-hover:opacity-100 transition-opacity">
            Voir <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
