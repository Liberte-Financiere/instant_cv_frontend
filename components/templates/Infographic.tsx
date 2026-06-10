'use client';

import Image from "next/image";
import { CV } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';

interface TemplateProps { cv: CV; }

export function Infographic({ cv }: TemplateProps) {
  const lang = cv.settings?.language || 'fr';
  const p = cv.personalInfo || {} as CV['personalInfo'];
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const qualities = cv.qualities || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };
  const accent = cv.settings?.accentColor || '#0d9488';

  // Progress circle SVG
  const Circle = ({ level }: { level: number }) => {
    const pct = (level / 5) * 100;
    const r = 14; const c = 2 * Math.PI * r;
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" className="shrink-0">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#e2e8f0" strokeWidth="3" />
        <circle cx="18" cy="18" r={r} fill="none" stroke={accent} strokeWidth="3" strokeDasharray={`${(pct/100)*c} ${c}`} strokeLinecap="round" transform="rotate(-90 18 18)" />
        <text x="18" y="18" textAnchor="middle" dy="0.35em" fontSize="10" fill={accent} fontWeight="bold">{level}</text>
      </svg>
    );
  };

  return (
    <div className="cv-template w-full h-full bg-white text-slate-900 min-h-[297mm] font-sans">
      <div className="flex min-h-[297mm]">
        {/* Left sidebar */}
        <div className="w-[200px] shrink-0 p-6 text-white" style={{ backgroundColor: accent }}>
          {p.photoUrl && (
            <Image src={p.photoUrl} alt={`${p.firstName} ${p.lastName}`} width={160} height={160} className="w-full h-auto rounded-xl object-cover mb-4 border-2 border-white/20" />
          )}
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2 pb-1 border-b border-white/20">{getSectionTitle('contact', cv.settings, lang)}</h2>
          <div className="space-y-1.5 text-xs text-white/85 mb-5">
            {p.email && <p className="break-all">{p.email}</p>}
            {p.phone && <p>{p.phone}</p>}
            {p.address && <p>{p.address}</p>}
          </div>

          {/* Skills with circles */}
          {skills.length > 0 && (
            <>
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3 pb-1 border-b border-white/20">{getSectionTitle('skills', cv.settings, lang)}</h2>
              <div className="space-y-2 mb-5">
                {skills.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <svg width="28" height="28" viewBox="0 0 36 36" className="shrink-0">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="white" strokeWidth="3" strokeDasharray={`${(s.level/5)*87.96} 87.96`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                    </svg>
                    <span className="text-[11px] text-white/90">{s.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {languages.length > 0 && (
            <>
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2 pb-1 border-b border-white/20">{getSectionTitle('languages', cv.settings, lang)}</h2>
              {languages.map((l) => <p key={l.id} className="text-[11px] text-white/80 mb-1">{l.name} — {l.level}</p>)}
            </>
          )}

          {hobbies.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2 pb-1 border-b border-white/20">{getSectionTitle('hobbies', cv.settings, lang)}</h2>
              {hobbies.map((h) => <p key={h.id} className="text-[11px] text-white/80 mb-1">• {h.name}</p>)}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 p-8 space-y-5">
          <header>
            <h1 className="text-3xl font-black" style={{ color: accent }}>{p.firstName} {p.lastName}</h1>
            <p className="text-base text-slate-500 font-light mt-1">{p.title}</p>
          </header>

          {p.summary && <p className="text-sm text-slate-600 leading-relaxed  border-l-3 pl-4" style={{ borderLeftWidth: '3px', borderColor: accent }}>{p.summary}</p>}

          {experiences.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('experience', cv.settings, lang)}</h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accent }} />
                    <div>
                      <h3 className="font-bold text-sm">{exp.position} — {exp.company}</h3>
                      <p className="text-xs" style={{ color: accent }}>{exp.startDate} — {exp.current ? getPresentLabel(lang) : exp.endDate}</p>
                      {exp.description && <p className="text-xs text-slate-600 mt-1 ">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('education', cv.settings, lang)}</h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-sm">{edu.degree}</p>
                    <p className="text-xs text-slate-500">{edu.institution} • {edu.startDate}–{edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {qualities.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
              <div className="flex flex-wrap gap-2">
                {qualities.map((q) => <span key={q.id} className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: `${accent}15`, color: accent }}>{q.name}</span>)}
              </div>
            </section>
          )}

          <CVCertifications certifications={certifications} variant="modern" accentColor={accent} title={getSectionTitle('certifications', cv.settings, lang)} />
          <CVProjects projects={projects} variant="modern" accentColor={accent}  title={getSectionTitle('projects', cv.settings, lang)} />
          <CVReferences references={references} variant="modern" accentColor={accent}  title={getSectionTitle('references', cv.settings, lang)} />
          <CVDivers divers={divers} variant="modern" accentColor={accent}  title={getSectionTitle('divers', cv.settings, lang)} />
          <CVFooter footer={footer} variant="modern"  lang={lang}/>
        </div>
      </div>
    </div>
  );
}
