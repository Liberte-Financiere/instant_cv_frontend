'use client';

import Image from "next/image";
import { CV } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter } from '@/components/cv-sections';

interface TemplateProps { cv: CV; }

export function BlueprintPremium({ cv }: TemplateProps) {
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
  const accent = cv.settings?.accentColor || '#1e3a5f';

  // Decorative square component
  const DecoSquare = ({ size, opacity = 1, className = '' }: { size: number; opacity?: number; className?: string }) => (
    <div
      className={`rounded-sm ${className}`}
      style={{ width: size, height: size, backgroundColor: accent, opacity }}
    />
  );

  return (
    <div className="cv-template w-full h-full bg-white text-slate-800 min-h-[297mm] font-sans relative overflow-hidden" style={{ hyphens: 'none', overflowWrap: 'break-word' }}>
      
      {/* Decorative squares - top left cluster */}
      <div className="absolute top-4 left-4 flex flex-col gap-1.5">
        <div className="flex gap-1.5">
          <DecoSquare size={14} opacity={0.7} />
          <DecoSquare size={14} opacity={0.3} />
        </div>
        <DecoSquare size={14} opacity={0.5} />
      </div>

      {/* ─── HEADER ─── */}
      <div className="px-10 pt-12 pb-8 flex items-start gap-8">
        {/* Photo with decorative squares */}
        <div className="relative shrink-0">
          {/* Decorative squares around photo */}
          <DecoSquare size={12} opacity={0.4} className="absolute -top-2 -left-2" />
          <DecoSquare size={12} opacity={0.6} className="absolute -top-2 right-4" />
          <DecoSquare size={10} opacity={0.3} className="absolute top-6 -left-3" />
          <DecoSquare size={12} opacity={0.5} className="absolute -bottom-2 -left-2" />
          <DecoSquare size={12} opacity={0.4} className="absolute -bottom-2 right-6" />
          
          {p.photoUrl ? (
            <Image
              src={p.photoUrl}
              alt={`${p.firstName} ${p.lastName}`}
              width={110}
              height={110}
              className="w-[110px] h-[110px] rounded-2xl object-cover border-2"
              style={{ borderColor: `${accent}30` }}
            />
          ) : (
            <div
              className="w-[110px] h-[110px] rounded-2xl flex items-center justify-center text-3xl font-bold"
              style={{ backgroundColor: `${accent}15` }}
            >
              <span style={{ color: accent }}>
                {(p.firstName?.[0] || '')}{(p.lastName?.[0] || '')}
              </span>
            </div>
          )}
        </div>

        {/* Name + Title + Summary */}
        <div className="flex-1 pt-2">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: accent }}>
            {p.firstName} {p.lastName}
          </h1>
          <p className="text-base font-medium text-slate-500 mt-1">{p.title}</p>
          {p.summary && (
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              {p.summary}
            </p>
          )}
        </div>
      </div>

      {/* ─── CONTACT BAR ─── */}
      <div className="mx-8 px-4 py-3 rounded-xl grid grid-cols-3 gap-3" style={{ backgroundColor: '#f3f6fa' }}>
        {p.phone && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: accent }}>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Portable</p>
              <p className="text-[11px] text-slate-700 font-medium truncate">{p.phone}</p>
            </div>
          </div>
        )}
        {p.address && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: accent }}>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Adresse</p>
              <p className="text-[11px] text-slate-700 font-medium">{p.address}</p>
            </div>
          </div>
        )}
        {p.email && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: accent }}>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">E-mail</p>
              <p className="text-[11px] text-slate-700 font-medium break-all">{p.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* ─── MAIN 2-COLUMN CONTENT ─── */}
      <div className="px-10 pt-8 pb-10 grid grid-cols-[1fr_1fr] gap-x-10 gap-y-6">
        
        {/* LEFT COLUMN: Formations, Compétences, Centres d'intérêts */}
        <div className="space-y-6">
          {/* Education / Formations */}
          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] mb-4" style={{ color: accent }}>
                {getSectionTitle('education', cv.settings, lang)}
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-sm text-slate-800">{edu.degree}</h3>
                    <p className="text-xs text-slate-500">{edu.institution} {edu.field && `— ${edu.field}`}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{edu.startDate}{edu.endDate && `/${edu.endDate}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills with checkmarks */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] mb-3" style={{ color: accent }}>
                {getSectionTitle('skills', cv.settings, lang)}
              </h2>
              <div className="space-y-2">
                {skills.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke={accent} strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-slate-600">{s.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies */}
          {hobbies.length > 0 && (
            <section>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] mb-3" style={{ color: accent }}>
                {getSectionTitle('hobbies', cv.settings, lang)}
              </h2>
              <ul className="space-y-2">
                {hobbies.map((h) => (
                  <li key={h.id} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                    {h.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] mb-3" style={{ color: accent }}>
                {getSectionTitle('languages', cv.settings, lang)}
              </h2>
              {languages.map((l) => (
                <p key={l.id} className="text-xs text-slate-600 mb-1">{l.name} — <span className="font-medium">{l.level}</span></p>
              ))}
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Expériences, Qualités, Références */}
        <div className="space-y-6">
          {/* Experiences */}
          {experiences.length > 0 && (
            <section>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] mb-4" style={{ color: accent }}>
                {getSectionTitle('experience', cv.settings, lang)}
              </h2>
              <div className="space-y-5">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <h3 className="font-extrabold text-sm text-slate-800">{exp.company}</h3>
                    <p className="text-xs text-slate-500 font-medium">{exp.position}</p>
                    <p className="text-xs mt-0.5" style={{ color: accent }}>
                      {exp.startDate} - {exp.current ? getPresentLabel(lang) : exp.endDate}
                    </p>
                    {exp.description && (
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Qualities as grid */}
          {qualities.length > 0 && (
            <section>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] mb-3" style={{ color: accent }}>
                {getSectionTitle('qualities', cv.settings, lang)}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {qualities.map((q) => (
                  <div key={q.id} className="flex flex-col items-center p-2 rounded-lg border" style={{ borderColor: `${accent}25` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold mb-1" style={{ backgroundColor: accent }}>
                      {q.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[10px] text-center text-slate-500 leading-tight">{q.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          <CVReferences references={references} variant="professional" accentColor={accent}  title={getSectionTitle('references', cv.settings, lang)} />
        </div>
      </div>

      {/* Extra sections below */}
      <div className="px-10 pb-8 space-y-4">
        <CVCertifications certifications={certifications} variant="professional" accentColor={accent} title={getSectionTitle('certifications', cv.settings, lang)} />
        <CVProjects projects={projects} variant="professional" accentColor={accent}  title={getSectionTitle('projects', cv.settings, lang)} />
        <CVDivers divers={divers} variant="professional" accentColor={accent}  title={getSectionTitle('divers', cv.settings, lang)} />
        <CVFooter footer={footer} variant="professional"  lang={lang}/>
      </div>

      {/* Decorative squares - bottom right cluster */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1.5">
        <DecoSquare size={14} opacity={0.3} />
        <div className="flex gap-1.5">
          <DecoSquare size={14} opacity={0.5} />
          <DecoSquare size={14} opacity={0.7} />
        </div>
        <div className="flex gap-1.5">
          <DecoSquare size={14} opacity={0.4} />
          <DecoSquare size={14} opacity={0.6} />
          <DecoSquare size={14} opacity={0.8} />
        </div>
      </div>
    </div>
  );
}
