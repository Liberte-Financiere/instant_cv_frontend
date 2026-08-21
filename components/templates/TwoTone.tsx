'use client';

import { CVDescription } from '../cv-sections/CVDescription';
import Image from "next/image";
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';

interface TemplateProps { cv: CV; }

export function TwoTone({ cv }: TemplateProps) {
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
  const accent = cv.settings?.accentColor || '#d97706';
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];

  return (
    <div className="cv-template w-full h-full bg-white text-slate-900 min-h-[297mm] font-sans">
      {/* Top half - colored */}
      <div className="px-10 pt-10 pb-8" style={{ backgroundColor: accent }}>
        <div className="flex items-center gap-6">
          {p.photoUrl && (
            <Image src={p.photoUrl} alt={`${p.firstName} ${p.lastName}`} width={90} height={90} className="w-[90px] h-[90px] rounded-full object-cover border-3 border-white/30" />
          )}
          <div className="text-white">
            <h1 className="text-3xl font-bold">{p.firstName} {p.lastName}</h1>
            <p className="text-base mt-1 text-white/80">{p.title}</p>
          </div>
        </div>
        {/* Contact + Summary */}
        <div className="mt-5 grid grid-cols-2 gap-6">
          <div className="text-xs text-white/70 space-y-1">
            {p.email && <p>✉ {p.email}</p>}
            {p.phone && <p>📞 {p.phone}</p>}
            {p.address && <p>📍 {p.address}</p>}
            {p.nationality && <p>{lang === 'fr' ? 'Nationalité' : 'Nationality'}: {p.nationality}</p>}
            {p.dateOfBirth && <p>{p.dateOfBirth}</p>}
          </div>
          {p.summary && <p className="text-xs text-white/80 leading-relaxed ">{p.summary}</p>}
        </div>
      </div>

      {/* Bottom half - white */}
      <div className="px-10 py-8 space-y-6">
        {sectionOrder.map((sectionId) => {
          switch (sectionId) {
            case 'experience':
              return experiences.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('experience', cv.settings, lang)}</h2>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-sm">{exp.position} \u2014 <span style={{ color: accent }}>{exp.company}</span></h3>
                          <span className="text-xs text-slate-400">{exp.startDate} \u2014 {exp.current ? getPresentLabel(lang) : exp.endDate}</span>
                        </div>
                        {exp.description && <CVDescription description={exp.description} className="text-xs text-slate-600 mt-1 whitespace-pre-line" />}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'education':
              return education.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('education', cv.settings, lang)}</h2>
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <p className="font-bold text-xs">{edu.degree}</p>
                        <p className="text-[11px] text-slate-500">{edu.institution} • {edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' \u2013 ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'skills':
              return skills.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('skills', cv.settings, lang)}</h2>
                  <div className="space-y-1.5 max-w-sm">
                    {skills.map((s) => (
                      <div key={s.id}>
                        <div className="flex justify-between text-xs mb-0.5"><span>{s.name}</span></div>
                        <div className="h-1.5 rounded-full" style={{ backgroundColor: `${accent}20` }}>
                          <div className="h-full rounded-full" style={{ width: `${(s.level/5)*100}%`, backgroundColor: accent }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'languages':
              return languages.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>{getSectionTitle('languages', cv.settings, lang)}</h2>
                  {languages.map((l) => <p key={l.id} className="text-xs text-slate-600">{l.name} \u2014 {l.level}</p>)}
                </section>
              ) : null;

            case 'hobbies':
              return hobbies.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>{getSectionTitle('hobbies', cv.settings, lang)}</h2>
                  {hobbies.map((h) => <p key={h.id} className="text-xs text-slate-600">• {h.name}</p>)}
                </section>
              ) : null;

            case 'qualities':
              return qualities.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                  {qualities.map((q) => <p key={q.id} className="text-xs text-slate-600">• {q.name}</p>)}
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

        <CVFooter footer={footer} variant="creative" lang={lang}/>
      </div>
    </div>
  );
}
