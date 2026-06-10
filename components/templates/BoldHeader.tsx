'use client';

import Image from "next/image";
import { CV } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';

interface TemplateProps { cv: CV; }

export function BoldHeader({ cv }: TemplateProps) {
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
  const accent = cv.settings?.accentColor || '#047857';

  return (
    <div className="cv-template w-full h-full bg-white text-slate-900 min-h-[297mm] font-sans">
      {/* Bold oversized header */}
      <header className="px-10 py-12 text-white relative" style={{ backgroundColor: accent }}>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-black tracking-tight leading-none">
              {p.firstName}<br/><span className="text-white/70">{p.lastName}</span>
            </h1>
            <p className="text-lg mt-3 text-white/80 font-light tracking-wide uppercase">{p.title}</p>
          </div>
          {p.photoUrl && (
            <Image src={p.photoUrl} alt={`${p.firstName} ${p.lastName}`} width={100} height={100} className="w-24 h-24 rounded-full object-cover border-4 border-white/20" />
          )}
        </div>
        {/* Contact bar */}
        <div className="flex flex-wrap gap-x-6 mt-5 text-xs text-white/60">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.address && <span>{p.address}</span>}
        </div>
      </header>

      <div className="p-10 space-y-6">
        {/* Summary */}
        {p.summary && (
          <section className="text-sm text-slate-600 leading-relaxed ">{p.summary}</section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accent }}>
              <span className="w-8 h-0.5" style={{ backgroundColor: accent }} />
              {getSectionTitle('experience', cv.settings, lang)}
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="pl-4 border-l-3" style={{ borderLeftWidth: '3px', borderColor: `${accent}30` }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-sm">{exp.position}</h3>
                    <span className="text-xs text-slate-400">{exp.startDate} — {exp.current ? getPresentLabel(lang) : exp.endDate}</span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: accent }}>{exp.company}</p>
                  {exp.description && <p className="text-xs text-slate-600 mt-1 ">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accent }}>
              <span className="w-8 h-0.5" style={{ backgroundColor: accent }} />
              {getSectionTitle('education', cv.settings, lang)}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-sm">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.institution}</p>
                  <p className="text-xs" style={{ color: accent }}>{edu.startDate} — {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills as big tags */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accent }}>
              <span className="w-8 h-0.5" style={{ backgroundColor: accent }} />
              {getSectionTitle('skills', cv.settings, lang)}
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="px-4 py-2 text-xs font-semibold rounded-lg border-2" style={{ borderColor: accent, color: accent }}>{s.name}</span>
              ))}
            </div>
          </section>
        )}

        {/* 3 col: Qualities, Languages, Hobbies */}
        <div className="grid grid-cols-3 gap-6">
          {qualities.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
              {qualities.map((q) => <p key={q.id} className="text-xs text-slate-600 mb-0.5">▸ {q.name}</p>)}
            </section>
          )}
          {languages.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('languages', cv.settings, lang)}</h2>
              {languages.map((l) => <p key={l.id} className="text-xs text-slate-600 mb-0.5">▸ {l.name} — {l.level}</p>)}
            </section>
          )}
          {hobbies.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('hobbies', cv.settings, lang)}</h2>
              {hobbies.map((h) => <p key={h.id} className="text-xs text-slate-600 mb-0.5">▸ {h.name}</p>)}
            </section>
          )}
        </div>

        <CVCertifications certifications={certifications} variant="modern" accentColor={accent} title={getSectionTitle('certifications', cv.settings, lang)} />
        <CVProjects projects={projects} variant="modern" accentColor={accent}  title={getSectionTitle('projects', cv.settings, lang)} />
        <CVReferences references={references} variant="modern" accentColor={accent}  title={getSectionTitle('references', cv.settings, lang)} />
        <CVDivers divers={divers} variant="modern" accentColor={accent}  title={getSectionTitle('divers', cv.settings, lang)} />
        <CVFooter footer={footer} variant="modern"  lang={lang}/>
      </div>
    </div>
  );
}
