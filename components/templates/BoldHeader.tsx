'use client';

import { CVDescription } from '../cv-sections/CVDescription';
import Image from "next/image";
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { groupSkillsByCategory } from '@/lib/utils';
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
  
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];

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
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-xs text-white/60">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.address && <span>{p.address}</span>}
          {p.nationality && <span>{lang === 'fr' ? 'Nationalité' : 'Nationality'}: {p.nationality}</span>}
          {p.dateOfBirth && <span>{p.dateOfBirth}</span>}
        </div>
      </header>

      <div className="p-10 space-y-6">
        {sectionOrder.map((sectionId) => {
          switch (sectionId) {
            case 'summary':
              return p.summary ? (
                <section key={sectionId} className="text-sm text-slate-600 leading-relaxed ">{p.summary}</section>
              ) : null;
            
            case 'experience':
              return experiences.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accent }}>
                    <span className="w-8 h-0.5" style={{ backgroundColor: accent }} />
                    {getSectionTitle('experience', cv.settings, lang)}
                  </h2>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="pl-4 border-l-3 break-inside-avoid" style={{ borderLeftWidth: '3px', borderColor: `${accent}30` }}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-sm">{exp.position}</h3>
                          <span className="text-xs text-slate-400">{exp.startDate} \u2014 {exp.current ? getPresentLabel(lang) : exp.endDate}</span>
                        </div>
                        <p className="text-xs font-semibold" style={{ color: accent }}>{exp.company}</p>
                        {exp.description && <CVDescription description={exp.description} className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0" />}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'education':
              return education.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accent }}>
                    <span className="w-8 h-0.5" style={{ backgroundColor: accent }} />
                    {getSectionTitle('education', cv.settings, lang)}
                  </h2>
                  <div className="flex flex-wrap gap-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="w-1/2 pr-2 break-inside-avoid">
                        <p className="font-bold text-sm">{edu.degree}</p>
                        <p className="text-xs text-slate-500">{edu.institution}</p>
                        <p className="text-xs" style={{ color: accent }}>{edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' \u2014 ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'skills': {
              if (skills.length === 0) return null;
              const groupedSkills = groupSkillsByCategory(skills);
              return (
                <section key={sectionId} className="mb-8">
                  <h2 className="text-xl font-black uppercase tracking-widest mb-4" style={{ color: accent }}>
                    {getSectionTitle('skills', cv.settings, lang)}
                  </h2>
                  <div className="space-y-4">
                    {groupedSkills.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-2">
                        {group.category && (
                          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{group.category}</h3>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((s) => (
                            <span key={s.id} className="px-3 py-1 text-sm font-bold bg-slate-100 text-slate-800 rounded uppercase tracking-wider">{s.name}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            case 'qualities':
              return qualities.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accent }}>
                    <span className="w-8 h-0.5" style={{ backgroundColor: accent }} />
                    {getSectionTitle('qualities', cv.settings, lang)}
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {qualities.map((q) => <p key={q.id} className="text-sm text-slate-600 break-inside-avoid">\u25b8 {q.name}</p>)}
                  </div>
                </section>
              ) : null;

            case 'languages':
              return languages.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accent }}>
                    <span className="w-8 h-0.5" style={{ backgroundColor: accent }} />
                    {getSectionTitle('languages', cv.settings, lang)}
                  </h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {languages.map((l) => <p key={l.id} className="text-sm text-slate-600 break-inside-avoid">\u25b8 {l.name} \u2014 {l.level}</p>)}
                  </div>
                </section>
              ) : null;

            case 'hobbies':
              return hobbies.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accent }}>
                    <span className="w-8 h-0.5" style={{ backgroundColor: accent }} />
                    {getSectionTitle('hobbies', cv.settings, lang)}
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {hobbies.map((h) => <p key={h.id} className="text-sm text-slate-600 break-inside-avoid">\u25b8 {h.name}</p>)}
                  </div>
                </section>
              ) : null;

            case 'certifications':
              return <CVCertifications key={sectionId} certifications={certifications} variant="modern" accentColor={accent} title={getSectionTitle('certifications', cv.settings, lang)} />;
            case 'projects':
              return <CVProjects key={sectionId} projects={projects} variant="modern" accentColor={accent} title={getSectionTitle('projects', cv.settings, lang)} />;
            case 'references':
              return <CVReferences key={sectionId} references={references} variant="modern" accentColor={accent} title={getSectionTitle('references', cv.settings, lang)} />;
            case 'divers':
              return <CVDivers key={sectionId} divers={divers} variant="modern" accentColor={accent} title={getSectionTitle('divers', cv.settings, lang)} />;
            
            default:
              return null;
          }
        })}

        <CVFooter footer={footer} variant="modern" lang={lang} />
      </div>
    </div>
  );
}
