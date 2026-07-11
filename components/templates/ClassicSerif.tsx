'use client';

import Image from "next/image";
import { CV } from '@/types/cv';
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

        {/* Summary */}
        {p.summary && (
          <section className="mb-6 text-center max-w-xl mx-auto">
            <p className="text-sm italic text-slate-600 leading-relaxed ">{p.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold uppercase tracking-[0.15em] text-center mb-4 pb-2 border-b" style={{ color: accent, borderColor: `${accent}40` }}>
              {getSectionTitle('experience', cv.settings, lang)}
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold">{exp.position}</h3>
                    <span className="text-xs italic text-slate-500">{exp.startDate} — {exp.current ? getPresentLabel(lang) : exp.endDate}</span>
                  </div>
                  <p className="text-xs font-semibold italic" style={{ color: accent }}>{exp.company}</p>
                  {exp.description && (
                    <div 
                      className="text-xs text-slate-600 mt-1 leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold uppercase tracking-[0.15em] text-center mb-4 pb-2 border-b" style={{ color: accent, borderColor: `${accent}40` }}>
              {getSectionTitle('education', cv.settings, lang)}
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline break-inside-avoid">
                  <div>
                    <p className="font-bold">{edu.degree}</p>
                    <p className="text-xs italic text-slate-500">{edu.institution} {edu.field && `— ${edu.field}`}</p>
                  </div>
                  <span className="text-xs italic text-slate-500 shrink-0">{edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' — ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills + Languages + Hobbies via Table */}
        <table className="w-full mt-4" style={{ tableLayout: 'fixed' }}>
          <tbody>
            <tr>
              <td className="align-top pr-4 w-1/3">
                {skills.length > 0 && (
                  <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-center mb-2 pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>{getSectionTitle('skills', cv.settings, lang)}</h2>
                    {skills.map((s) => <p key={s.id} className="text-xs text-center break-inside-avoid">• {s.name}</p>)}
                  </section>
                )}
              </td>
              <td className="align-top px-2 w-1/3">
                {languages.length > 0 && (
                  <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-center mb-2 pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>{getSectionTitle('languages', cv.settings, lang)}</h2>
                    {languages.map((l) => <p key={l.id} className="text-xs text-center break-inside-avoid">{l.name} — <em>{l.level}</em></p>)}
                  </section>
                )}
              </td>
              <td className="align-top pl-4 w-1/3">
                {(hobbies.length > 0 || qualities.length > 0) && (
                  <section>
                    {qualities.length > 0 && (
                      <div className="break-inside-avoid">
                        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-center mb-2 pb-1 border-b" style={{ color: accent, borderColor: `${accent}40` }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                        {qualities.map((q) => <p key={q.id} className="text-xs text-center">• {q.name}</p>)}
                      </div>
                    )}
                    {hobbies.length > 0 && (
                      <div className="break-inside-avoid">
                        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-center mb-2 pb-1 border-b mt-3" style={{ color: accent, borderColor: `${accent}40` }}>{getSectionTitle('hobbies', cv.settings, lang)}</h2>
                        {hobbies.map((h) => <p key={h.id} className="text-xs text-center">• {h.name}</p>)}
                      </div>
                    )}
                  </section>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4">
          <CVCertifications certifications={certifications} variant="executive" accentColor={accent} title={getSectionTitle('certifications', cv.settings, lang)} />
          <CVProjects projects={projects} variant="executive" accentColor={accent}  title={getSectionTitle('projects', cv.settings, lang)} />
          <CVReferences references={references} variant="executive" accentColor={accent}  title={getSectionTitle('references', cv.settings, lang)} />
          <CVDivers divers={divers} variant="executive" accentColor={accent}  title={getSectionTitle('divers', cv.settings, lang)} />
          <CVFooter footer={footer} variant="executive"  lang={lang}/>
        </div>
      </div>
    </div>
  );
}
