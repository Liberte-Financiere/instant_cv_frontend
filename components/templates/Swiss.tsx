'use client';

import { CVDescription } from '../cv-sections/CVDescription';
import Image from "next/image";
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';

interface TemplateProps { cv: CV; }

export function Swiss({ cv }: TemplateProps) {
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
  const accent = '#dc2626';

  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];
  const sidebarSections: CVSectionId[] = ['skills', 'languages', 'qualities', 'hobbies'];
  const topSections: CVSectionId[] = ['summary'];
  const bottomSections: CVSectionId[] = ['divers'];

  const topOrder = sectionOrder.filter(id => topSections.includes(id));
  const bottomOrder = sectionOrder.filter(id => bottomSections.includes(id));
  const mainOrder = sectionOrder.filter(id => !sidebarSections.includes(id) && !topSections.includes(id) && !bottomSections.includes(id));
  const sideOrder = sectionOrder.filter(id => sidebarSections.includes(id));

  return (
    <div className="cv-template w-full h-full bg-white text-slate-900 min-h-[297mm] font-sans">
      {/* Red top bar */}
      <div className="h-2" style={{ backgroundColor: accent }} />
      
      <div className="p-10">
        {/* Header - Swiss grid */}
        <header className="grid grid-cols-3 gap-8 mb-8 pb-6 border-b border-slate-200">
          <div className="col-span-2">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
              {p.firstName}<br/>{p.lastName}
            </h1>
            <p className="text-lg mt-2 font-light tracking-wide" style={{ color: accent }}>{p.title}</p>
          </div>
          <div className="text-right text-xs text-slate-500 space-y-1 pt-2">
            {p.email && <p>{p.email}</p>}
            {p.phone && <p>{p.phone}</p>}
            {p.address && <p>{p.address}</p>}
            {p.nationality && <p>{lang === 'fr' ? 'Nationalité' : 'Nationality'}: {p.nationality}</p>}
            {p.dateOfBirth && <p>{p.dateOfBirth}</p>}
            {p.photoUrl && (
              <Image src={p.photoUrl} alt={`${p.firstName} ${p.lastName}`} width={60} height={60} className="w-14 h-14 rounded-full object-cover ml-auto mt-2 border" style={{ borderColor: accent }} />
            )}
          </div>
        </header>

        {/* Top Full Width */}
        {topOrder.map((sectionId) => {
          switch (sectionId) {
            case 'summary':
              return p.summary ? (
                <section key={sectionId} className="mb-6">
                  <p className="text-sm text-slate-600 leading-relaxed max-w-2xl ">{p.summary}</p>
                </section>
              ) : null;
            default:
              return null;
          }
        })}

        {/* Grid layout: Experience + Education side by side */}
        <div className="grid grid-cols-3 gap-8">
          {/* Main column */}
          <div className="col-span-2 space-y-6">
            {mainOrder.map((sectionId) => {
              switch (sectionId) {
                case 'experience':
                  return experiences.length > 0 ? (
                    <section key={sectionId}>
                      <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-3 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('experience', cv.settings, lang)}</h2>
                      <div className="space-y-4">
                        {experiences.map((exp) => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-bold text-sm">{exp.position}</h3>
                              <span className="text-xs text-slate-400">{exp.startDate} \u2014 {exp.current ? getPresentLabel(lang) : exp.endDate}</span>
                            </div>
                            <p className="text-xs font-semibold" style={{ color: accent }}>{exp.company}</p>
                            {exp.description && <CVDescription description={exp.description} className="text-xs text-slate-600 mt-1 whitespace-pre-line" />}
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : null;
                case 'education':
                  return education.length > 0 ? (
                    <section key={sectionId}>
                      <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-3 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('education', cv.settings, lang)}</h2>
                      <div className="space-y-3">
                        {education.map((edu) => (
                          <div key={edu.id} className="flex justify-between items-baseline">
                            <div>
                              <p className="font-bold text-sm">{edu.degree}</p>
                              <p className="text-xs text-slate-500">{edu.institution} {edu.field && `\u2014 ${edu.field}`}</p>
                            </div>
                            <span className="text-xs text-slate-400 shrink-0">{edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' \u2014 ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : null;
                case 'certifications':
                  return <CVCertifications key={sectionId} certifications={certifications} variant="professional" accentColor={accent} title={getSectionTitle('certifications', cv.settings, lang)} />;
                case 'projects':
                  return <CVProjects key={sectionId} projects={projects} variant="professional" accentColor={accent} title={getSectionTitle('projects', cv.settings, lang)} />;
                case 'references':
                  return <CVReferences key={sectionId} references={references} variant="professional" accentColor={accent} title={getSectionTitle('references', cv.settings, lang)} />;
                default:
                  return null;
              }
            })}
          </div>

          {/* Side column */}
          <div className="space-y-5">
            {sideOrder.map((sectionId) => {
              switch (sectionId) {
                case 'skills':
                  return skills.length > 0 ? (
                    <section key={sectionId}>
                      <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-2 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('skills', cv.settings, lang)}</h2>
                      <div className="space-y-1.5">
                        {skills.map((s) => (
                          <div key={s.id} className="flex items-center gap-2">
                            <span className="text-xs text-slate-700 flex-1">{s.name}</span>
                            <div className="flex gap-0.5">{[1,2,3,4,5].map(d => <span key={d} className={`w-2 h-2 rounded-full ${d <= s.level ? '' : 'bg-slate-200'}`} style={d <= s.level ? { backgroundColor: accent } : {}} />)}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : null;
                case 'languages':
                  return languages.length > 0 ? (
                    <section key={sectionId}>
                      <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-2 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('languages', cv.settings, lang)}</h2>
                      {languages.map((l) => <p key={l.id} className="text-xs text-slate-700"><strong>{l.name}</strong> \u2014 {l.level}</p>)}
                    </section>
                  ) : null;
                case 'qualities':
                  return qualities.length > 0 ? (
                    <section key={sectionId}>
                      <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-2 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                      {qualities.map((q) => <p key={q.id} className="text-xs text-slate-700">• {q.name}</p>)}
                    </section>
                  ) : null;
                case 'hobbies':
                  return hobbies.length > 0 ? (
                    <section key={sectionId}>
                      <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-2 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('hobbies', cv.settings, lang)}</h2>
                      {hobbies.map((h) => <p key={h.id} className="text-xs text-slate-700">• {h.name}</p>)}
                    </section>
                  ) : null;
                default:
                  return null;
              }
            })}
          </div>
        </div>

        {/* Bottom Full Width */}
        {bottomOrder.map((sectionId) => {
          switch (sectionId) {
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
