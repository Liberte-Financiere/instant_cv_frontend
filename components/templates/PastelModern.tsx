'use client';

import Image from "next/image";
import { CV } from '@/types/cv';
import { SECTION_TITLES } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';

interface TemplateProps { cv: CV; }

export function PastelModern({ cv }: TemplateProps) {
  const p = cv.personalInfo || {} as CV['personalInfo'];
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const qualities = cv.qualities || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };
  const accent = cv.settings?.accentColor || '#be185d';

  const pastelBg = `${accent}08`;
  const lightAccent = `${accent}20`;

  return (
    <div className="cv-template w-full h-full bg-white text-slate-800 min-h-[297mm] font-sans">
      {/* Pastel header */}
      <header className="px-10 pt-10 pb-8 relative" style={{ backgroundColor: pastelBg }}>
        <div className="flex items-center gap-6">
          {p.photoUrl && (
            <div className="p-1 rounded-full" style={{ backgroundColor: lightAccent }}>
              <Image src={p.photoUrl} alt={`${p.firstName} ${p.lastName}`} width={90} height={90} className="w-[90px] h-[90px] rounded-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold" style={{ color: accent }}>{p.firstName} {p.lastName}</h1>
            <p className="text-base mt-1 text-slate-500">{p.title}</p>
            <div className="flex flex-wrap gap-x-4 mt-2 text-xs text-slate-400">
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {p.address && <span>{p.address}</span>}
            </div>
          </div>
        </div>
        {/* Decorative shape */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: accent }} />
      </header>

      <div className="p-10 space-y-6">
        {/* Summary in pastel card */}
        {p.summary && (
          <section className="p-4 rounded-xl" style={{ backgroundColor: pastelBg }}>
            <p className="text-sm text-slate-600 leading-relaxed ">{p.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accent }}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
              {SECTION_TITLES.experience}
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="pl-5 border-l-2" style={{ borderColor: lightAccent }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-sm">{exp.position}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: pastelBg, color: accent }}>{exp.startDate} — {exp.current ? "Présent" : exp.endDate}</span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: accent }}>{exp.company}</p>
                  {exp.description && <p className="text-xs text-slate-500 mt-1 ">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accent }}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
              {SECTION_TITLES.education}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {education.map((edu) => (
                <div key={edu.id} className="p-3 rounded-lg" style={{ backgroundColor: pastelBg }}>
                  <p className="font-bold text-sm">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.institution}</p>
                  <p className="text-xs mt-1" style={{ color: accent }}>{edu.startDate} — {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills as soft pills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accent }}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
              {SECTION_TITLES.skills}
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="px-3 py-1.5 text-xs rounded-full font-medium" style={{ backgroundColor: lightAccent, color: accent }}>{s.name}</span>
              ))}
            </div>
          </section>
        )}

        {/* Grid: Qualities, Languages, Hobbies */}
        <div className="grid grid-cols-3 gap-6">
          {qualities.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{SECTION_TITLES.qualities}</h2>
              {qualities.map((q) => <p key={q.id} className="text-xs text-slate-500 mb-0.5">♡ {q.name}</p>)}
            </section>
          )}
          {languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{SECTION_TITLES.languages}</h2>
              {languages.map((l) => <p key={l.id} className="text-xs text-slate-500 mb-0.5">{l.name} — {l.level}</p>)}
            </section>
          )}
          {hobbies.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{SECTION_TITLES.hobbies}</h2>
              {hobbies.map((h) => <p key={h.id} className="text-xs text-slate-500 mb-0.5">♡ {h.name}</p>)}
            </section>
          )}
        </div>

        <CVCertifications certifications={certifications} variant="creative" accentColor={accent} title={SECTION_TITLES.certifications} />
        <CVProjects projects={projects} variant="creative" accentColor={accent} />
        <CVReferences references={references} variant="creative" accentColor={accent} />
        <CVDivers divers={divers} variant="creative" accentColor={accent} />
        <CVFooter footer={footer} variant="creative" />
      </div>
    </div>
  );
}
