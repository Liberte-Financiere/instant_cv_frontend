'use client';

import { CVDescription } from '../cv-sections/CVDescription';
import Image from "next/image";
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';

interface TemplateProps { cv: CV; }

export function PastelModern({ cv }: TemplateProps) {
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
  const accent = cv.settings?.accentColor || '#be185d';
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];

  const pastelBg = `${accent}08`;
  const lightAccent = `${accent}20`;

  return (
    <div className="cv-template w-full h-full bg-white text-slate-800 min-h-[297mm] font-sans">
      {/* Pastel header */}
      <header className="px-10 pt-10 pb-8 relative" style={{ backgroundColor: pastelBg }}>
        <div className="flex items-center gap-6">
          {p.photoUrl && (
            <div className="p-1 rounded-full" style={{ backgroundColor: lightAccent }}>
              <Image src={p.photoUrl} alt={`${p.firstName} ${p.lastName}`} width={90} height={90} className="w-[90px] h-[90px] rounded-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold" style={{ color: accent }}>{p.firstName} {p.lastName}</h1>
            <p className="text-base mt-1 text-slate-500">{p.title}</p>
            <div className="flex flex-wrap gap-x-4 mt-2 text-xs text-slate-400">
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {p.address && <span>{p.address}</span>}
            </div>
          </div>
        </div>
        {/* Decorative shape */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: accent }} />
      </header>

      <div className="p-10 space-y-6">
        {sectionOrder.map((sectionId) => {
          switch (sectionId) {
            case 'summary':
              return p.summary ? (
                <section key={sectionId} className="p-4 rounded-xl" style={{ backgroundColor: pastelBg }}>
                  <p className="text-sm text-slate-600 leading-relaxed ">{p.summary}</p>
                </section>
              ) : null;

            case 'experience':
              return experiences.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accent }}>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
                    {getSectionTitle('experience', cv.settings, lang)}
                  </h2>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="pl-5 border-l-2" style={{ borderColor: lightAccent }}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-sm">{exp.position}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: pastelBg, color: accent }}>{exp.startDate} \u2014 {exp.current ? getPresentLabel(lang) : exp.endDate}</span>
                        </div>
                        <p className="text-xs font-semibold" style={{ color: accent }}>{exp.company}</p>
                        {exp.description && <CVDescription description={exp.description} className="text-xs text-slate-500 mt-1 whitespace-pre-line" />}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'education':
              return education.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accent }}>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
                    {getSectionTitle('education', cv.settings, lang)}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="p-3 rounded-lg" style={{ backgroundColor: pastelBg }}>
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
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accent }}>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
                    {getSectionTitle('skills', cv.settings, lang)}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s.id} className="px-3 py-1.5 text-xs rounded-full font-medium" style={{ backgroundColor: lightAccent, color: accent }}>{s.name}</span>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'qualities':
              return qualities.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                  <div className="flex flex-wrap gap-4">
                    {qualities.map((q) => <p key={q.id} className="text-xs text-slate-500 mb-0.5">♡ {q.name}</p>)}
                  </div>
                </section>
              ) : null;

            case 'languages':
              return languages.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('languages', cv.settings, lang)}</h2>
                  <div className="flex flex-wrap gap-4">
                    {languages.map((l) => <p key={l.id} className="text-xs text-slate-500 mb-0.5">{l.name} \u2014 {l.level}</p>)}
                  </div>
                </section>
              ) : null;

            case 'hobbies':
              return hobbies.length > 0 ? (
                <section key={sectionId}>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('hobbies', cv.settings, lang)}</h2>
                  <div className="flex flex-wrap gap-4">
                    {hobbies.map((h) => <p key={h.id} className="text-xs text-slate-500 mb-0.5">♡ {h.name}</p>)}
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

        <CVFooter footer={footer} variant="creative" lang={lang}/>
      </div>
    </div>
  );
}
