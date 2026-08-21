'use client';

import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { 
  CVContact, CVSummary, CVExperience, CVEducation, 
  CVSkills, CVLanguages, CVHobbies, CVCertifications, 
  CVProjects, CVReferences, CVDivers, CVFooter, CVQualities 
} from '@/components/cv-sections';

import { getSectionTitle } from '@/constants/sections';

interface TemplateProps {
  cv: CV;
}

export function CreativeGrid({ cv }: TemplateProps) {
  const lang = cv.settings?.language || 'fr';
  const personalInfo = cv.personalInfo || {};
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };

  const variant = 'creative';
  const accentColor = cv.settings?.accentColor || '#4f46e5';
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];
  const MAIN_SECTIONS: CVSectionId[] = ['summary', 'experience', 'education', 'projects'];
  const SIDEBAR_SECTIONS: CVSectionId[] = ['skills', 'languages', 'certifications', 'qualities', 'hobbies', 'references'];
  const mainOrder = sectionOrder.filter(s => MAIN_SECTIONS.includes(s));
  const sidebarOrder = sectionOrder.filter(s => SIDEBAR_SECTIONS.includes(s));

  return (
    <div className="cv-template w-full h-full bg-slate-50 text-slate-900 font-sans min-h-[297mm] flex flex-col">
      <div className="flex-1">
        {/* Header with Accent */}
        <div className="text-white p-10" style={{ backgroundColor: accentColor }}>
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-xl font-medium text-white/80">{personalInfo.title}</p>
          <div className="mt-6 flex flex-wrap gap-6 text-white/80 text-sm">
            <CVContact personalInfo={personalInfo} socialLinks={socialLinks} variant={variant} layout="horizontal" textColorClass="text-white/90" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-10">
          <div className="grid grid-cols-3 gap-8">
            {/* Main Column (2/3) */}
            <div className="col-span-2 space-y-8">
              {mainOrder.map((sectionId) => {
                switch (sectionId) {
                  case 'summary':
                    return <CVSummary key={sectionId} summary={personalInfo.summary} variant={variant} title={getSectionTitle('summary', cv.settings, lang)} accentColor={accentColor} />;
                  case 'experience':
                    return <CVExperience key={sectionId} experiences={experiences} variant={variant} title={getSectionTitle('experience', cv.settings, lang)} lang={lang} accentColor={accentColor} />;
                  case 'education':
                    return <CVEducation key={sectionId} education={education} variant={variant} title={getSectionTitle('education', cv.settings, lang)} lang={lang} accentColor={accentColor} />;
                  case 'projects':
                    return <CVProjects key={sectionId} projects={projects} variant={variant} title={getSectionTitle('projects', cv.settings, lang)} accentColor={accentColor} />;
                  default:
                    return null;
                }
              })}
            </div>

            {/* Sidebar Column (1/3) */}
            <div className="space-y-8">
              {sidebarOrder.map((sectionId) => {
                switch (sectionId) {
                  case 'skills':
                    return <CVSkills key={sectionId} skills={skills} variant={variant} layout="bars" title={getSectionTitle('skills', cv.settings, lang)} accentColor={accentColor} />;
                  case 'languages':
                    return <CVLanguages key={sectionId} languages={languages} variant={variant} title={getSectionTitle('languages', cv.settings, lang)} accentColor={accentColor} />;
                  case 'certifications':
                    return <CVCertifications key={sectionId} certifications={certifications} variant={variant} title={getSectionTitle('certifications', cv.settings, lang)} accentColor={accentColor} />;
                  case 'qualities':
                    return <CVQualities key={sectionId} qualities={cv.qualities || []} variant={variant} title={getSectionTitle('qualities', cv.settings, lang)} accentColor={accentColor} />;
                  case 'hobbies':
                    return <CVHobbies key={sectionId} hobbies={hobbies} variant={variant} title={getSectionTitle('hobbies', cv.settings, lang)} accentColor={accentColor} />;
                  case 'references':
                    return <CVReferences key={sectionId} references={references} variant={variant} showContact={false} title={getSectionTitle('references', cv.settings, lang)} accentColor={accentColor} />;
                  default:
                    return null;
                }
              })}
            </div>
          </div>

          <div className="mt-8">
            <CVDivers divers={divers} variant={variant} title={getSectionTitle('divers', cv.settings, lang)} accentColor={accentColor} />
          </div>
        </div>
      </div>

      <CVFooter footer={footer} variant={variant} lang={lang} />
    </div>
  );
}
