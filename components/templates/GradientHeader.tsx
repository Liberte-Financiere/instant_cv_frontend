'use client';

import { CVDescription } from '../cv-sections/CVDescription';
import Image from "next/image";
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';

interface TemplateProps { cv: CV; }

export function GradientHeader({ cv }: TemplateProps) {
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
  const accent = cv.settings?.accentColor || '#6366f1';
  
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];

  return (
    <div className="cv-template w-full h-full bg-white text-slate-900 min-h-[297mm] font-sans">
      {/* Gradient Header */}
      <header className="px-10 py-10 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}88, #7c3aed)` }}>
        <div className="relative z-10 flex items-center gap-6">
          {p.photoUrl && (
            <Image src={p.photoUrl} alt={`${p.firstName} ${p.lastName}`} width={100} height={100} className="w-24 h-24 rounded-2xl object-cover border-2 border-white/30 shadow-lg" />
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{p.firstName} {p.lastName}</h1>
            <p className="text-lg mt-1 text-white/80 font-light">{p.title}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-white/70">
              {p.email && <span>✉ {p.email}</span>}
              {p.phone && <span>📞 {p.phone}</span>}
              {p.address && <span>📍 {p.address}</span>}
              {p.nationality && <span>{lang === 'fr' ? 'Nationalité' : 'Nationality'}: {p.nationality}</span>}
              {p.dateOfBirth && <span>{p.dateOfBirth}</span>}
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -right-6 w-60 h-60 rounded-full bg-white/5" />
      </header>

      <div className="p-10 space-y-6">
        {sectionOrder.map((sectionId) => {
          switch (sectionId) {
            case 'summary':
              return p.summary ? (
                <section key={sectionId} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed ">{p.summary}</p>
                </section>
              ) : null;

            case 'experience':
              return experiences.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-4 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>{getSectionTitle('experience', cv.settings, lang)}</h2>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="flex gap-4">
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accent }} />
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-sm">{exp.position} \u2014 {exp.company}</h3>
                            <span className="text-xs text-slate-400 shrink-0">{exp.startDate} \u2014 {exp.current ? getPresentLabel(lang) : exp.endDate}</span>
                          </div>
                          {exp.description && <CVDescription description={exp.description} className="text-xs text-slate-600 mt-1 whitespace-pre-line" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'education':
              return education.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>{getSectionTitle('education', cv.settings, lang)}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {education.map((edu) => (
                      <div key={edu.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                        <p className="font-bold text-sm">{edu.degree}</p>
                        <p className="text-xs text-slate-500">{edu.institution}</p>
                        <p className="text-xs mt-1" style={{ color: accent }}>{edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' \u2014 ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'skills':
              return skills.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>{getSectionTitle('skills', cv.settings, lang)}</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s.id} className="px-3 py-1.5 text-xs rounded-full font-medium text-white" style={{ backgroundColor: accent }}>{s.name}</span>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'qualities':
              return qualities.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {qualities.map((q) => <p key={q.id} className="text-sm text-slate-600">• {q.name}</p>)}
                  </div>
                </section>
              ) : null;

            case 'languages':
              return languages.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>{getSectionTitle('languages', cv.settings, lang)}</h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {languages.map((l) => <p key={l.id} className="text-sm text-slate-600">• {l.name} \u2014 {l.level}</p>)}
                  </div>
                </section>
              ) : null;

            case 'hobbies':
              return hobbies.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>{getSectionTitle('hobbies', cv.settings, lang)}</h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {hobbies.map((h) => <p key={h.id} className="text-sm text-slate-600">• {h.name}</p>)}
                  </div>
                </section>
              ) : null;

            case 'certifications':
              return <CVCertifications key={sectionId} certifications={certifications} variant="creative" accentColor={accent} title={getSectionTitle('certifications', cv.settings, lang)} />;
            case 'projects':
              return <CVProjects key={sectionId} projects={projects} variant="creative" accentColor={accent} title={getSectionTitle('projects', cv.settings, lang)} />;
            case 'references':
              return <CVReferences key={sectionId} references={references} variant="creative" accentColor={accent} title={getSectionTitle('references', cv.settings, lang)} />;
            case 'divers':
              return <CVDivers key={sectionId} divers={divers} variant="creative" accentColor={accent} title={getSectionTitle('divers', cv.settings, lang)} />;

            default:
              return null;
          }
        })}

        <CVFooter footer={footer} variant="creative" lang={lang} />
      </div>
    </div>
  );
}
