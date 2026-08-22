'use client';

import { CVDescription } from '../cv-sections/CVDescription';
import Image from "next/image";
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';
import { groupSkillsByCategory } from '@/lib/utils';

interface TemplateProps { cv: CV; }

export function Nordic({ cv }: TemplateProps) {
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
  const accent = cv.settings?.accentColor || '#64748b';
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];
  const headingClass = "text-xs font-semibold uppercase tracking-[0.2em] mb-4";

  return (
    <div className="cv-template w-full h-full min-h-[297mm] font-sans text-sm" style={{ backgroundColor: '#f5f0eb' }}>
      <div className="max-w-2xl mx-auto p-10">
        {/* Minimal header */}
        <header className="mb-10 flex items-start gap-6">
          {p.photoUrl && (
            <Image src={p.photoUrl} alt={`${p.firstName} ${p.lastName}`} width={70} height={70} className="w-[70px] h-[70px] rounded-full object-cover" />
          )}
          <div>
            <h1 className="text-2xl font-light text-slate-800 tracking-wide">{p.firstName} <span className="font-bold">{p.lastName}</span></h1>
            <p className="text-sm mt-0.5" style={{ color: accent }}>{p.title}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {p.address && <span>{p.address}</span>}
              {p.nationality && <span>{lang === 'fr' ? 'Nationalité' : 'Nationality'}: {p.nationality}</span>}
              {p.dateOfBirth && <span>{p.dateOfBirth}</span>}
            </div>
          </div>
        </header>

        {/* Dynamic sections based on user-defined order */}
        {sectionOrder.map((sectionId) => {
          switch (sectionId) {
            case 'summary':
              return p.summary ? (
                <section key={sectionId} className="mb-8">
                  <p className="text-sm text-slate-500 leading-relaxed ">{p.summary}</p>
                </section>
              ) : null;

            case 'experience':
              return experiences.length > 0 ? (
                <section key={sectionId} className="mb-8">
                  <h2 className={headingClass} style={{ color: accent }}>{getSectionTitle('experience', cv.settings, lang)}</h2>
                  <div className="space-y-5">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="grid grid-cols-[100px_1fr] gap-4">
                        <div className="text-xs text-slate-400 pt-0.5">
                          {exp.startDate}<br/>{exp.current ? getPresentLabel(lang) : exp.endDate}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{exp.position}</h3>
                          <p className="text-xs" style={{ color: accent }}>{exp.company}</p>
                          {exp.description && <CVDescription description={exp.description} className="text-xs text-slate-500 mt-1.5 leading-relaxed whitespace-pre-line" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'education':
              return education.length > 0 ? (
                <section key={sectionId} className="mb-8">
                  <h2 className={headingClass} style={{ color: accent }}>{getSectionTitle('education', cv.settings, lang)}</h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="grid grid-cols-[100px_1fr] gap-4">
                        <span className="text-xs text-slate-400">{edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' \u2013 ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}</span>
                        <div>
                          <p className="font-semibold text-slate-800">{edu.degree}</p>
                          <p className="text-xs text-slate-500">{edu.institution} {edu.field && `\u2014 ${edu.field}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'skills': {
              if (skills.length === 0) return null;
              const groupedSkills = groupSkillsByCategory(skills);
              return (
                <section key={sectionId} className="mb-6">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: accent }}>{getSectionTitle('skills', cv.settings, lang)}</h2>
                  <div className="space-y-4">
                    {groupedSkills.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-2">
                        {group.category && (
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">{group.category}</h3>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((s) => (
                            <span key={s.id} className="px-3 py-1 text-xs rounded-full text-slate-600 bg-white border border-slate-200">{s.name}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            case 'languages':
              return languages.length > 0 ? (
                <section key={sectionId} className="mb-6">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>{getSectionTitle('languages', cv.settings, lang)}</h2>
                  {languages.map((l) => <p key={l.id} className="text-xs text-slate-500">{l.name} \u2014 {l.level}</p>)}
                </section>
              ) : null;

            case 'qualities':
              return qualities.length > 0 ? (
                <section key={sectionId} className="mb-6">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                  {qualities.map((q) => <p key={q.id} className="text-xs text-slate-500">{q.name}</p>)}
                </section>
              ) : null;

            case 'hobbies':
              return hobbies.length > 0 ? (
                <section key={sectionId} className="mb-6">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>{getSectionTitle('hobbies', cv.settings, lang)}</h2>
                  {hobbies.map((h) => <p key={h.id} className="text-xs text-slate-500">{h.name}</p>)}
                </section>
              ) : null;

            case 'certifications':
              return <CVCertifications key={sectionId} certifications={certifications} variant="professional" accentColor={accent} title={getSectionTitle('certifications', cv.settings, lang)} />;
            case 'projects':
              return <CVProjects key={sectionId} projects={projects} variant="professional" accentColor={accent} title={getSectionTitle('projects', cv.settings, lang)} />;
            case 'references':
              return <CVReferences key={sectionId} references={references} variant="professional" accentColor={accent} title={getSectionTitle('references', cv.settings, lang)} />;
            case 'divers':
              return <CVDivers key={sectionId} divers={divers} variant="professional" accentColor={accent} title={getSectionTitle('divers', cv.settings, lang)} />;

            default:
              return null;
          }
        })}
        <CVFooter footer={footer} variant="professional" lang={lang} />
      </div>
    </div>
  );
}
