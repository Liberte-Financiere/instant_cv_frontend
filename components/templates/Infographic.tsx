'use client';

import { CVDescription } from '../cv-sections/CVDescription';
import Image from "next/image";
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';

interface TemplateProps { cv: CV; }

export function Infographic({ cv }: TemplateProps) {
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
  const accent = cv.settings?.accentColor || '#0d9488';
  
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];
  const sidebarSections: CVSectionId[] = ['skills', 'languages', 'hobbies'];
  
  const sidebarOrder = sectionOrder.filter(id => sidebarSections.includes(id));
  const mainOrder = sectionOrder.filter(id => !sidebarSections.includes(id));

  // Progress circle SVG (Removed as requested by user)
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
    <div className="cv-template w-full h-full bg-white text-slate-900 min-h-[297mm] font-sans print:bg-transparent">
      <style>{`
        @media print {
          @page { margin: 0 !important; }
          html, body {
            background: linear-gradient(to right, ${accent} 0%, ${accent} 200px, white 200px, white 100%) !important;
          }
          .cv-template section, .cv-item {
            border-top: 10mm solid transparent !important;
            margin-top: -10mm !important;
            background-clip: padding-box !important;
          }
        }
      `}</style>
      <div className="flex min-h-[297mm]">
        {/* Left sidebar */}
        <div className="w-[200px] shrink-0 p-6 text-white print:text-white print:bg-transparent" style={{ backgroundColor: accent }}>
          {p.photoUrl && (
            <Image src={p.photoUrl} alt={`${p.firstName} ${p.lastName}`} width={160} height={160} className="w-full h-auto rounded-xl object-cover mb-4 border-2 border-white/20" />
          )}
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2 pb-1 border-b border-white/20">{getSectionTitle('contact', cv.settings, lang)}</h2>
          <div className="space-y-1.5 text-xs text-white/85 mb-5">
            {p.email && <p className="break-all">{p.email}</p>}
            {p.phone && <p>{p.phone}</p>}
            {p.address && <p>{p.address}</p>}
            {p.nationality && <p>{lang === 'fr' ? 'Nationalité' : 'Nationality'} : {p.nationality}</p>}
            {p.dateOfBirth && <p>{p.dateOfBirth}</p>}
          </div>

          {/* Dynamic Sidebar Sections */}
          {sidebarOrder.map((sectionId) => {
            switch (sectionId) {
              case 'skills':
                return skills.length > 0 ? (
                  <div key={sectionId}>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3 pb-1 border-b border-white/20">{getSectionTitle('skills', cv.settings, lang)}</h2>
                    <div className="space-y-1.5 mb-5">
                      {skills.map((s) => (
                        <p key={s.id} className="text-[11px] text-white/80 break-inside-avoid">
                          <span className="font-medium text-white/95">{s.name}</span>
                          {s.level ? ` \u2014 ${getSkillLabel(s.level, lang)}` : ''}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null;
              case 'languages':
                return languages.length > 0 ? (
                  <div key={sectionId}>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2 pb-1 border-b border-white/20">{getSectionTitle('languages', cv.settings, lang)}</h2>
                    <div className="mb-5">
                      {languages.map((l) => <p key={l.id} className="text-[11px] text-white/80 mb-1 break-inside-avoid">{l.name} \u2014 {l.level}</p>)}
                    </div>
                  </div>
                ) : null;
              case 'hobbies':
                return hobbies.length > 0 ? (
                  <div key={sectionId} className="mb-5">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2 pb-1 border-b border-white/20">{getSectionTitle('hobbies', cv.settings, lang)}</h2>
                    {hobbies.map((h) => <p key={h.id} className="text-[11px] text-white/80 mb-1 break-inside-avoid">• {h.name}</p>)}
                  </div>
                ) : null;
              default:
                return null;
            }
          })}
        </div>

        {/* Main content */}
        <div className="flex-1 p-8 space-y-5">
          <header>
            <h1 className="text-3xl font-black" style={{ color: accent }}>{p.firstName} {p.lastName}</h1>
            <p className="text-base text-slate-500 font-light mt-1">{p.title}</p>
          </header>

          {mainOrder.map((sectionId) => {
            switch (sectionId) {
              case 'summary':
                return p.summary ? <p key={sectionId} className="text-sm text-slate-600 leading-relaxed  border-l-3 pl-4" style={{ borderLeftWidth: '3px', borderColor: accent }}>{p.summary}</p> : null;
              
              case 'experience':
                return experiences.length > 0 ? (
                  <section key={sectionId}>
                    <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('experience', cv.settings, lang)}</h2>
                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="flex gap-3 break-inside-avoid">
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accent }} />
                          <div className="flex-1">
                            <h3 className="font-bold text-sm">{exp.position} \u2014 {exp.company}</h3>
                            <p className="text-xs" style={{ color: accent }}>{exp.startDate} \u2014 {exp.current ? getPresentLabel(lang) : exp.endDate}</p>
                            {exp.description && <CVDescription description={exp.description} className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null;
              
              case 'education':
                return education.length > 0 ? (
                  <section key={sectionId}>
                    <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: accent, borderColor: accent }}>{getSectionTitle('education', cv.settings, lang)}</h2>
                    <div className="space-y-2">
                      {education.map((edu) => (
                        <div key={edu.id} className="break-inside-avoid">
                          <p className="font-bold text-sm">{edu.degree}</p>
                          <p className="text-xs text-slate-500">{edu.institution} • {edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' \u2013 ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null;
              
              case 'qualities':
                return qualities.length > 0 ? (
                  <section key={sectionId}>
                    <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                    <div className="flex flex-wrap gap-2">
                      {qualities.map((q) => <span key={q.id} className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: `${accent}15`, color: accent }}>{q.name}</span>)}
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
          <CVFooter footer={footer} variant="modern"  lang={lang}/>
        </div>
      </div>
    </div>
  );
}
