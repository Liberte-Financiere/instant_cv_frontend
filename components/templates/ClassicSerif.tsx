'use client';

import { CVDescription } from '../cv-sections/CVDescription';
import Image from "next/image";
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';

interface TemplateProps { cv: CV; }

export function ClassicSerif({ cv }: TemplateProps) {
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
  const accent = cv.settings?.accentColor || '#78350f';
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];

  return (
    <div className="cv-template w-full h-full min-h-[297mm] font-serif text-sm leading-relaxed" style={{ backgroundColor: '#faf8f5', color: '#3d2b1f' }}>
      <div className="p-10">
        {/* Elegant header */}
        <header className="text-center mb-8 pb-6 border-b-2 border-double" style={{ borderColor: accent }}>
          {p.photoUrl && (
            <Image src={p.photoUrl} alt={`${p.firstName} ${p.lastName}`} width={80} height={80} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2" style={{ borderColor: accent }} />
          )}
          <h1 className="text-3xl font-bold tracking-wide" style={{ color: accent }}>
            {p.firstName} {p.lastName}
          </h1>
          <p className="text-base mt-1 italic text-slate-600">{p.title}</p>
          <div className="flex justify-center gap-6 mt-3 text-xs text-slate-500">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.address && <span>{p.address}</span>}
          </div>
        </header>

        {sectionOrder.map((sectionId) => {
          switch (sectionId) {
            case 'summary':
              return p.summary ? (
                <section key={sectionId} className="mb-6 text-center max-w-xl mx-auto">
                  <p className="text-sm italic text-slate-600 leading-relaxed ">{p.summary}</p>
                </section>
              ) : null;

            case 'experience':
              return experiences.length > 0 ? (
                <section key={sectionId} className="mb-6">
                  <h2 className="text-base font-bold uppercase tracking-[0.15em] text-center mb-4 pb-2 border-b" style={{ color: accent, borderColor: `${accent}40` }}>
                    {getSectionTitle('experience', cv.settings, lang)}
                  </h2>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold">{exp.position}</h3>
                          <span className="text-xs italic text-slate-500">{exp.startDate} \u2014 {exp.current ? getPresentLabel(lang) : exp.endDate}</span>
                        </div>
                        <p className="text-xs font-semibold italic" style={{ color: accent }}>{exp.company}</p>
                        {exp.description && <CVDescription description={exp.description} className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0" />}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'education':
              return education.length > 0 ? (
                <section key={sectionId} className="mb-6">
                  <h2 className="text-base font-bold uppercase tracking-[0.15em] text-center mb-4 pb-2 border-b" style={{ color: accent, borderColor: `${accent}40` }}>
                    {getSectionTitle('education', cv.settings, lang)}
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-baseline break-inside-avoid">
                        <div>
                          <p className="font-bold">{edu.degree}</p>
                          <p className="text-xs italic text-slate-500">{edu.institution} {edu.field && `\u2014 ${edu.field}`}</p>
                        </div>
                        <span className="text-xs italic text-slate-500 shrink-0">{edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' \u2014 ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'skills':
              return skills.length > 0 ? (
                <section key={sectionId} className="mb-6">
                  <h2 className="text-base font-bold uppercase tracking-[0.15em] text-center mb-4 pb-2 border-b" style={{ color: accent, borderColor: `${accent}40` }}>{getSectionTitle('skills', cv.settings, lang)}</h2>
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                    {skills.map((s) => <p key={s.id} className="text-sm text-center break-inside-avoid">• {s.name}</p>)}
                  </div>
                </section>
              ) : null;

            case 'languages':
              return languages.length > 0 ? (
                <section key={sectionId} className="mb-6">
                  <h2 className="text-base font-bold uppercase tracking-[0.15em] text-center mb-4 pb-2 border-b" style={{ color: accent, borderColor: `${accent}40` }}>{getSectionTitle('languages', cv.settings, lang)}</h2>
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                    {languages.map((l) => <p key={l.id} className="text-sm text-center break-inside-avoid">{l.name} \u2014 <em>{l.level}</em></p>)}
                  </div>
                </section>
              ) : null;

            case 'qualities':
              return qualities.length > 0 ? (
                <section key={sectionId} className="mb-6">
                  <h2 className="text-base font-bold uppercase tracking-[0.15em] text-center mb-4 pb-2 border-b" style={{ color: accent, borderColor: `${accent}40` }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                    {qualities.map((q) => <p key={q.id} className="text-sm text-center break-inside-avoid">• {q.name}</p>)}
                  </div>
                </section>
              ) : null;

            case 'hobbies':
              return hobbies.length > 0 ? (
                <section key={sectionId} className="mb-6">
                  <h2 className="text-base font-bold uppercase tracking-[0.15em] text-center mb-4 pb-2 border-b" style={{ color: accent, borderColor: `${accent}40` }}>{getSectionTitle('hobbies', cv.settings, lang)}</h2>
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                    {hobbies.map((h) => <p key={h.id} className="text-sm text-center break-inside-avoid">• {h.name}</p>)}
                  </div>
                </section>
              ) : null;

            case 'certifications':
              return <div key={sectionId} className="mb-6"><CVCertifications certifications={certifications} variant="executive" accentColor={accent} title={getSectionTitle('certifications', cv.settings, lang)} /></div>;
            case 'projects':
              return <div key={sectionId} className="mb-6"><CVProjects projects={projects} variant="executive" accentColor={accent} title={getSectionTitle('projects', cv.settings, lang)} /></div>;
            case 'references':
              return <div key={sectionId} className="mb-6"><CVReferences references={references} variant="executive" accentColor={accent} title={getSectionTitle('references', cv.settings, lang)} /></div>;
            case 'divers':
              return <div key={sectionId} className="mb-6"><CVDivers divers={divers} variant="executive" accentColor={accent} title={getSectionTitle('divers', cv.settings, lang)} /></div>;
            
            default:
              return null;
          }
        })}

        <CVFooter footer={footer} variant="executive" lang={lang}/>
      </div>
    </div>
  );
}
