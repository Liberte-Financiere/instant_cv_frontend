'use client';

import Image from "next/image";
import { CV } from '@/types/cv';
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
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -right-6 w-60 h-60 rounded-full bg-white/5" />
      </header>

      <div className="p-10 space-y-6">
        {/* Summary */}
        {p.summary && (
          <section className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed ">{p.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>{getSectionTitle('experience', undefined, lang)}</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accent }} />
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-sm">{exp.position} — {exp.company}</h3>
                      <span className="text-xs text-slate-400 shrink-0">{exp.startDate} — {exp.current ? getPresentLabel(lang) : exp.endDate}</span>
                    </div>
                    {exp.description && <p className="text-xs text-slate-600 mt-1 ">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>{getSectionTitle('education', undefined, lang)}</h2>
            <div className="grid grid-cols-2 gap-4">
              {education.map((edu) => (
                <div key={edu.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <p className="font-bold text-sm">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.institution}</p>
                  <p className="text-xs mt-1" style={{ color: accent }}>{edu.startDate} — {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills as pills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accent, borderColor: accent }}>{getSectionTitle('skills', undefined, lang)}</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="px-3 py-1.5 text-xs rounded-full font-medium text-white" style={{ backgroundColor: accent }}>{s.name}</span>
              ))}
            </div>
          </section>
        )}

        {/* Qualities + Languages + Hobbies in 3 columns */}
        <div className="grid grid-cols-3 gap-6">
          {qualities.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('qualities', undefined, lang)}</h2>
              {qualities.map((q) => <p key={q.id} className="text-xs text-slate-600">• {q.name}</p>)}
            </section>
          )}
          {languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('languages', undefined, lang)}</h2>
              {languages.map((l) => <p key={l.id} className="text-xs text-slate-600">• {l.name} — {l.level}</p>)}
            </section>
          )}
          {hobbies.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{getSectionTitle('hobbies', undefined, lang)}</h2>
              {hobbies.map((h) => <p key={h.id} className="text-xs text-slate-600">• {h.name}</p>)}
            </section>
          )}
        </div>

        <CVCertifications certifications={certifications} variant="creative" accentColor={accent} title={getSectionTitle('certifications', undefined, lang)} />
        <CVProjects projects={projects} variant="creative" accentColor={accent}  title={getSectionTitle('projects', undefined, lang)} />
        <CVReferences references={references} variant="creative" accentColor={accent}  title={getSectionTitle('references', undefined, lang)} />
        <CVDivers divers={divers} variant="creative" accentColor={accent}  title={getSectionTitle('divers', undefined, lang)} />
        <CVFooter footer={footer} variant="creative"  lang={lang}/>
      </div>
    </div>
  );
}
