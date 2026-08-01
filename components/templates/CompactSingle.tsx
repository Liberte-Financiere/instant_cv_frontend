'use client';

import Image from "next/image";
import { CV } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';

interface TemplateProps { cv: CV; }

export function CompactSingle({ cv }: TemplateProps) {
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
  const accent = cv.settings?.accentColor || '#334155';

  return (
    <div className="cv-template w-full h-full bg-white text-slate-800 min-h-[297mm] font-sans text-[13px] leading-snug">
      {/* Compact header */}
      <header className="px-8 pt-6 pb-4 flex items-center gap-4 border-b" style={{ borderColor: accent }}>
        {p.photoUrl && (
          <Image src={p.photoUrl} alt={`${p.firstName} ${p.lastName}`} width={50} height={50} className="w-12 h-12 rounded-full object-cover" />
        )}
        <div className="flex-1">
          <h1 className="text-xl font-bold" style={{ color: accent }}>{p.firstName} {p.lastName}</h1>
          <p className="text-xs text-slate-500">{p.title}</p>
        </div>
        <div className="text-right text-[11px] text-slate-500 space-y-0.5">
          {p.email && <p>{p.email}</p>}
          {p.phone && <p>{p.phone}</p>}
          {p.address && <p>{p.address}</p>}
        </div>
      </header>

      <div className="px-8 py-4 space-y-3">
        {/* Summary - compact */}
        {p.summary && <p className="text-xs text-slate-500 leading-relaxed  border-l-2 pl-3" style={{ borderColor: accent }}>{p.summary}</p>}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('experience', cv.settings, lang)}</h2>
            <div className="space-y-2">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex gap-3">
                  <span className="text-[10px] text-slate-400 w-[65px] shrink-0 pt-0.5">{exp.startDate}<br/>{exp.current ? getPresentLabel(lang) : exp.endDate}</span>
                  <div className="flex-1 border-l pl-3" style={{ borderColor: `${accent}30` }}>
                    <p className="font-semibold text-xs">{exp.position} — {exp.company}</p>
                    {exp.description && <p className="text-[11px] text-slate-500 mt-0.5 whitespace-pre-line">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('education', cv.settings, lang)}</h2>
            <div className="grid grid-cols-2 gap-2">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-[10px] text-slate-500">{edu.institution} • {edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' – ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills + Languages + Hobbies inline */}
        <div className="grid grid-cols-3 gap-4">
          {skills.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>{getSectionTitle('skills', cv.settings, lang)}</h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => <span key={s.id} className="px-2 py-0.5 text-[10px] rounded" style={{ backgroundColor: `${accent}10`, color: accent }}>{s.name}</span>)}
              </div>
            </section>
          )}
          {languages.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>{getSectionTitle('languages', cv.settings, lang)}</h2>
              {languages.map((l) => <p key={l.id} className="text-[11px] text-slate-600">{l.name} — {l.level}</p>)}
            </section>
          )}
          {(hobbies.length > 0 || qualities.length > 0) && (
            <section>
              {hobbies.length > 0 && <>
                <h2 className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>{getSectionTitle('hobbies', cv.settings, lang)}</h2>
                <p className="text-[11px] text-slate-600">{hobbies.map(h => h.name).join(' • ')}</p>
              </>}
              {qualities.length > 0 && <>
                <h2 className="text-[11px] font-bold uppercase tracking-widest mb-1 mt-2" style={{ color: accent }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                <p className="text-[11px] text-slate-600">{qualities.map(q => q.name).join(' • ')}</p>
              </>}
            </section>
          )}
        </div>

        <CVCertifications certifications={certifications} variant="professional" accentColor={accent} title={getSectionTitle('certifications', cv.settings, lang)} />
        <CVProjects projects={projects} variant="professional" accentColor={accent}  title={getSectionTitle('projects', cv.settings, lang)} />
        <CVReferences references={references} variant="professional" accentColor={accent}  title={getSectionTitle('references', cv.settings, lang)} />
        <CVDivers divers={divers} variant="professional" accentColor={accent}  title={getSectionTitle('divers', cv.settings, lang)} />
        <CVFooter footer={footer} variant="professional"  lang={lang}/>
      </div>
    </div>
  );
}
