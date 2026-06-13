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
                <div key={exp.id} className="pl-4 border-l-3 break-inside-avoid" style={{ borderLeftWidth: '3px', borderColor: `${accent}30` }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-sm">{exp.position}</h3>
                    <span className="text-xs text-slate-400">{exp.startDate} — {exp.current ? getPresentLabel(lang) : exp.endDate}</span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: accent }}>{exp.company}</p>
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
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accent }}>
              <span className="w-8 h-0.5" style={{ backgroundColor: accent }} />
              {getSectionTitle('education', cv.settings, lang)}
            </h2>
            <div className="flex flex-wrap gap-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="w-1/2 pr-2 break-inside-avoid">
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

        {/* 3 col: Qualities, Languages, Hobbies via Table */}
        <table className="w-full" style={{ tableLayout: 'fixed' }}>
          <tbody>
            <tr>
              <td className="align-top pr-4 w-1/3">
                {qualities.length > 0 && (
                  <section>
                    <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                    {qualities.map((q) => <p key={q.id} className="text-xs text-slate-600 mb-0.5 break-inside-avoid">▸ {q.name}</p>)}
                  </section>
                )}
              </td>
              <td className="align-top px-2 w-1/3">
                {languages.length > 0 && (
                  <section>
                    <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('languages', cv.settings, lang)}</h2>
                    {languages.map((l) => <p key={l.id} className="text-xs text-slate-600 mb-0.5 break-inside-avoid">▸ {l.name} — {l.level}</p>)}
                  </section>
                )}
              </td>
              <td className="align-top pl-4 w-1/3">
                {hobbies.length > 0 && (
                  <section>
                    <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('hobbies', cv.settings, lang)}</h2>
                    {hobbies.map((h) => <p key={h.id} className="text-xs text-slate-600 mb-0.5 break-inside-avoid">▸ {h.name}</p>)}
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
    </div>
  );
}
