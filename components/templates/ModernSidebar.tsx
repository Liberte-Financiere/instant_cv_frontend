'use client';

import { CV } from '@/types/cv';
import { 
  CVContact, CVSummary, CVExperience, CVEducation, 
  CVSkills, CVLanguages, CVHobbies, CVCertifications, 
  CVProjects, CVReferences, CVDivers, CVFooter 
} from '@/components/cv-sections';

interface TemplateProps {
  cv: CV;
}

export function ModernSidebar({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };

  const variant = 'modern';

  return (
    <div className="cv-template w-full h-full bg-white text-slate-800 font-sans text-sm leading-relaxed flex flex-col min-h-[297mm]">
      <div className="flex flex-col sm:flex-row flex-1">
        {/* Sidebar (Left Column) - stretches to match content height */}
        <div className="w-[30%] bg-slate-900 text-white p-5 space-y-5 flex-shrink-0 print:bg-slate-900 print:text-white">
          {/* Avatar & Name */}
          <div className="text-center sm:text-left">
             <div className="w-24 h-24 mx-auto sm:mx-0 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold mb-6 text-blue-400 ring-4 ring-slate-800 ring-offset-2 ring-offset-slate-900">
               {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
             </div>
             
             <h1 className="text-2xl font-bold leading-tight mb-2">
               {personalInfo.firstName} <br /> {personalInfo.lastName}
             </h1>
             <p className="text-blue-400 font-medium text-sm uppercase tracking-wider">
               {personalInfo.title}
             </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Contact</h3>
             <CVContact personalInfo={personalInfo} socialLinks={socialLinks} variant={variant} layout="sidebar" />
          </div>

          {/* Skills - Sidebar version */}
          {skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded text-xs font-medium">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages - Sidebar version */}
          {languages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Langues</h3>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">{lang.name}</span>
                    <span className="text-xs text-slate-500 font-medium">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies - Sidebar version */}
          {hobbies.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Centres d&apos;intérêt</h3>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby) => (
                  <span key={hobby.id} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded text-xs font-medium">
                    {hobby.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content (Right Column) */}
        <div className="flex-1 p-6 sm:p-8 space-y-6 bg-white">
           <CVSummary summary={personalInfo.summary} variant={variant} />
           <CVExperience experiences={experiences} variant={variant} />
           <CVEducation education={education} variant={variant} />
           <CVCertifications certifications={certifications} variant={variant} />
           <CVProjects projects={projects} variant={variant} />
           <CVReferences references={references} variant={variant} />
           <CVDivers divers={divers} variant={variant} />
        </div>
      </div>

      <CVFooter footer={footer} variant={variant} />
    </div>
  );
}
