'use client';

import Image from "next/image";
import { CV } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';

interface TemplateProps { cv: CV; }

export function TimelinePro({ cv }: TemplateProps) {
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
  const accent = cv.settings?.accentColor || '#2563eb';
  const getSkillLabel = (level: number, lang: string) => {
    if (lang === 'en') {
      if (level <= 1) return 'Basics';
      if (level === 2) return 'Beginner';
      if (level === 3) return 'Intermediate';
      if (level === 4) return 'Advanced';
      return 'Expert';
    }
    if (level <= 1) return 'Notions';
    if (level === 2) return 'Débutant';
    if (level === 3) return 'Intermédiaire';
    if (level === 4) return 'Avancé';
    return 'Expert';
  };

  return (
    <div className="cv-template w-full h-full bg-white text-slate-900 min-h-[297mm] font-sans p-10">
      {/* Header */}
      <header className="flex items-start justify-between mb-8 pb-6 border-b-2" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{p.firstName} {p.lastName}</h1>
          <p className="text-base mt-1 font-light" style={{ color: accent }}>{p.title}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-slate-500">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.address && <span>{p.address}</span>}
          </div>
        </div>
        {p.photoUrl && (
          <Image src={p.photoUrl} alt={`${p.firstName} ${p.lastName}`} width={80} height={80} className="w-20 h-20 rounded-full object-cover border-2" style={{ borderColor: accent }} />
        )}
      </header>

      {/* Summary */}
      {p.summary && <p className="text-sm text-slate-600 leading-relaxed mb-6 ">{p.summary}</p>}

      {/* Timeline: Experiences */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>{getSectionTitle('experience', cv.settings, lang)}</h2>
          <div className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-1 bottom-1 w-0.5" style={{ backgroundColor: `${accent}30` }} />
            <div className="space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative break-inside-avoid">
                  {/* Dot */}
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white" style={{ borderColor: accent }} />
                  <p className="text-xs font-semibold" style={{ color: accent }}>{exp.startDate} — {exp.current ? getPresentLabel(lang) : exp.endDate}</p>
                  <h3 className="font-bold text-sm mt-0.5">{exp.position}</h3>
                  <p className="text-xs text-slate-500 font-medium">{exp.company}</p>
                  {exp.description && (
                    <div 
                      className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline: Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>{getSectionTitle('education', cv.settings, lang)}</h2>
          <div className="relative pl-6">
            <div className="absolute left-[7px] top-1 bottom-1 w-0.5" style={{ backgroundColor: `${accent}30` }} />
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="relative break-inside-avoid">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white" style={{ borderColor: accent }} />
                  <p className="text-xs font-semibold" style={{ color: accent }}>{edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' — ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}</p>
                  <p className="font-bold text-sm">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.institution} {edu.field && `— ${edu.field}`}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Layout via Table to prevent Chromium pagination bugs */}
      <table className="w-full mt-4" style={{ tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            {/* Column 1: Skills */}
            <td className="align-top pr-4 w-1/3">
              {skills.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('skills', cv.settings, lang)}</h2>
                  <div className="space-y-1.5">
                    {skills.map((s) => (
                      <div key={s.id} className="flex justify-between items-start gap-2 text-xs mb-1 break-inside-avoid">
                        <span className="font-medium text-slate-800 leading-snug">{s.name}</span>
                        {s.level ? <span className="text-slate-500 whitespace-nowrap">{getSkillLabel(s.level, lang)}</span> : null}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </td>

            {/* Column 2: Languages & Qualities */}
            <td className="align-top px-2 w-1/3">
              {languages.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('languages', cv.settings, lang)}</h2>
                  {languages.map((l) => <p key={l.id} className="text-xs text-slate-600 mb-1 break-inside-avoid"><strong>{l.name}</strong> — {l.level}</p>)}
                  {qualities.length > 0 && (
                    <div className="break-inside-avoid">
                      <h2 className="text-xs font-bold uppercase tracking-widest mb-2 mt-3" style={{ color: accent }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                      {qualities.map((q) => <p key={q.id} className="text-xs text-slate-600">• {q.name}</p>)}
                    </div>
                  )}
                </section>
              )}
            </td>

            {/* Column 3: Hobbies */}
            <td className="align-top pl-4 w-1/3">
              {hobbies.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('hobbies', cv.settings, lang)}</h2>
                  {hobbies.map((h) => <p key={h.id} className="text-xs text-slate-600 break-inside-avoid">• {h.name}</p>)}
                </section>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <CVCertifications certifications={certifications} variant="modern" accentColor={accent} title={getSectionTitle('certifications', cv.settings, lang)} />
      <CVProjects projects={projects} variant="modern" accentColor={accent}  title={getSectionTitle('projects', cv.settings, lang)} />
      <CVReferences references={references} variant="modern" accentColor={accent}  title={getSectionTitle('references', cv.settings, lang)} />
      <CVDivers divers={divers} variant="modern" accentColor={accent}  title={getSectionTitle('divers', cv.settings, lang)} />
      <CVFooter footer={footer} variant="modern"  lang={lang}/>
    </div>
  );
}
