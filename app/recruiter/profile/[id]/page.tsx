'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Star,
  GraduationCap,
  Languages,
  Award,
  Lock,
  Unlock,
  Mail,
  Phone,
  User,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface ProfileDetail {
  id: string;
  anonymousName: string;
  title: string;
  summary: string | null;
  sector: string | null;
  skills: string[];
  experienceYears: number;
  locationCity: string | null;
  locationCountry: string | null;
  completionScore: number;
  lastCvUpdate: string;
  experiences: {
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }[];
  languages: { name: string; level?: string }[];
  certifications: { name: string; organization: string; date: string }[];
  projects: {
    name: string;
    description: string;
    url?: string;
    github?: string;
    technologies?: string;
  }[];
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export default function CandidateProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const isRecruiter = session?.user?.role === 'RECRUITER' || session?.user?.role === 'ADMIN';

  const [profile, setProfile] = useState<ProfileDetail | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [unlockMessage, setUnlockMessage] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/recruiter/profiles/${id}`);
        if (!res.ok) throw new Error('Profil introuvable');
        const data = await res.json();
        setProfile(data);
      } catch {
        router.push('/recruiter');
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchProfile();
  }, [id, router]);

  const handleUnlock = async () => {
    if (!isRecruiter) {
      router.push('/recruiter/register');
      return;
    }

    setIsUnlocking(true);
    setUnlockError('');
    setUnlockMessage('');

    try {
      const res = await fetch(`/api/recruiter/profiles/${id}/unlock`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        setUnlockError(data.error || 'Erreur lors du deblocage');
        return;
      }

      setContactInfo(data.contactInfo);
      if (data.refunded) {
        setUnlockMessage(data.refundReason);
      } else if (data.status === 'already_unlocked') {
        setUnlockMessage('Profil deja debloque.');
      } else {
        setUnlockMessage(data.wasFree ? 'Deblocage gratuit reussi.' : `Deblocage reussi (${data.creditsCost} credits).`);
      }
    } catch {
      setUnlockError('Erreur de connexion. Reessayez.');
    } finally {
      setIsUnlocking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const location = [profile.locationCity, profile.locationCountry].filter(Boolean).join(', ');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux resultats
      </button>

      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/20 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-primary">{profile.anonymousName}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile.title || 'Candidat'}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">
                {profile.sector && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {profile.sector}
                  </span>
                )}
                {profile.experienceYears > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {profile.experienceYears} an{profile.experienceYears > 1 ? 's' : ''} exp.
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Unlock CTA */}
          <div className="shrink-0">
            {contactInfo ? (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 space-y-2 min-w-[240px]">
                <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  Coordonnees debloquees
                </div>
                {contactInfo.firstName && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <User className="w-4 h-4 text-slate-500" />
                    {contactInfo.firstName} {contactInfo.lastName}
                  </div>
                )}
                {contactInfo.email && (
                  <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors">
                    <Mail className="w-4 h-4 text-slate-500" />
                    {contactInfo.email}
                  </a>
                )}
                {contactInfo.phone && (
                  <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors">
                    <Phone className="w-4 h-4 text-slate-500" />
                    {contactInfo.phone}
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={handleUnlock}
                  disabled={isUnlocking}
                  className="w-full bg-primary hover:bg-primary-dark shadow-lg shadow-primary/25"
                >
                  {isUnlocking ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Unlock className="w-4 h-4 mr-2" />
                  )}
                  {isRecruiter ? 'Debloquer le profil' : 'Devenir recruteur'}
                </Button>
                {!isRecruiter && (
                  <p className="text-xs text-slate-500 text-center">
                    3 deblocages gratuits a l&apos;inscription
                  </p>
                )}
              </div>
            )}
            {unlockError && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {unlockError}
              </div>
            )}
            {unlockMessage && !unlockError && (
              <p className="mt-2 text-xs text-primary text-center">{unlockMessage}</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {profile.summary && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Profil</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{profile.summary}</p>
        </div>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Competences</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-lg border border-primary/20">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-2.5 1.55v12.42a1.78 1.78 0 0 0 2.5 1.55l8.95-5.17a1.78 1.78 0 0 0 0-3.1Z"/></svg>
            Projets Réalisés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.projects.map((proj, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-5 hover:border-primary/20 transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-white font-bold text-sm">{proj.name}</h3>
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.technologies.split(/, |,/).map((tech, idx) => (
                          <span key={idx} className="text-[9px] font-bold text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/5 px-2 py-1 rounded">
                        GitHub
                      </a>
                    )}
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:text-primary-dark transition-colors bg-primary/5 border border-primary/10 px-2 py-1 rounded">
                        Démo
                      </a>
                    )}
                  </div>
                </div>
                {proj.description && (
                  <p className="text-slate-400 text-xs mt-3 leading-relaxed whitespace-pre-line">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Experiences */}
        {profile.experiences.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Experiences
            </h2>
            <div className="space-y-4">
              {profile.experiences.map((exp, i) => (
                <div key={i} className="border-l-2 border-primary/30 pl-4">
                  <p className="text-white font-semibold text-sm">{exp.position}</p>
                  <p className="text-slate-400 text-xs">{exp.company}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {exp.startDate} - {exp.current ? 'Actuel' : exp.endDate}
                  </p>
                  {exp.description && (
                    <p className="text-slate-400 text-xs mt-2 line-clamp-3">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.education.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Formation
            </h2>
            <div className="space-y-4">
              {profile.education.map((edu, i) => (
                <div key={i} className="border-l-2 border-primary/30 pl-4">
                  <p className="text-white font-semibold text-sm">{edu.degree}</p>
                  <p className="text-slate-400 text-xs">{edu.institution}</p>
                  {edu.field && <p className="text-slate-500 text-xs">{edu.field}</p>}
                  <p className="text-slate-500 text-xs mt-0.5">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Languages & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile.languages.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Langues
            </h2>
            <div className="space-y-2">
              {profile.languages.map((lang, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{lang.name}</span>
                  {lang.level && (
                    <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">{lang.level}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.certifications.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certifications
            </h2>
            <div className="space-y-2">
              {profile.certifications.map((cert, i) => (
                <div key={i}>
                  <p className="text-sm text-slate-300 font-medium">{cert.name}</p>
                  <p className="text-xs text-slate-500">{cert.organization} {cert.date && `- ${cert.date}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lock overlay hint */}
      {!contactInfo && (
        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <Lock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">
            Les coordonnees de ce candidat sont masquees
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Debloquez le profil pour acceder au nom complet, email et telephone.
          </p>
        </div>
      )}
    </div>
  );
}
