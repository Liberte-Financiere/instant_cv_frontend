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

export function ExecutiveCorporate({ cv }: TemplateProps) {
  const lang = cv.settings?.language || 'fr';
  const accentColor = cv.settings?.accentColor;
  const personalInfo = cv.personalInfo || {};
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };

  const variant = 'executive';
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];

  return (
    <div className="cv-template w-full h-full bg-white text-black font-serif p-12 min-h-[297mm] leading-snug flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 
            className="text-3xl font-bold uppercase tracking-widest mb-2 border-b-2 inline-block pb-2"
            style={accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: 'black' }}
          >
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-lg font-medium mt-4">{personalInfo.title}</p>
          <div className="mt-4">
            <CVContact personalInfo={personalInfo} socialLinks={socialLinks} variant={variant} layout="horizontal" accentColor={accentColor} />
          </div>
        </div>

        {/* Dynamic sections */}
        <div className="space-y-8">
          {sectionOrder.map((sectionId) => {
            switch (sectionId) {
              case 'summary':
                return <CVSummary key={sectionId} summary={personalInfo.summary} variant={variant} accentColor={accentColor} title={getSectionTitle('summary', cv.settings, lang)} />;
              case 'experience':
                return <CVExperience key={sectionId} experiences={experiences} variant={variant} accentColor={accentColor} title={getSectionTitle('experience', cv.settings, lang)} lang={lang} />;
              case 'education':
                return <CVEducation key={sectionId} education={education} variant={variant} accentColor={accentColor} title={getSectionTitle('education', cv.settings, lang)} lang={lang} />;
              case 'certifications':
                return <CVCertifications key={sectionId} certifications={certifications} variant={variant} accentColor={accentColor} title={getSectionTitle('certifications', cv.settings, lang)} />;
              case 'skills':
                return <CVSkills key={sectionId} skills={skills} variant={variant} accentColor={accentColor} layout="list" title={getSectionTitle('skills', cv.settings, lang)} />;
              case 'languages':
                return <CVLanguages key={sectionId} languages={languages} variant={variant} accentColor={accentColor} title={getSectionTitle('languages', cv.settings, lang)} />;
              case 'projects':
                return <CVProjects key={sectionId} projects={projects} variant={variant} accentColor={accentColor} title={getSectionTitle('projects', cv.settings, lang)} />;
              case 'qualities':
                return <CVQualities key={sectionId} qualities={cv.qualities || []} variant={variant} accentColor={accentColor} title={getSectionTitle('qualities', cv.settings, lang)} />;
              case 'hobbies':
                return <CVHobbies key={sectionId} hobbies={hobbies} variant={variant} accentColor={accentColor} title={getSectionTitle('hobbies', cv.settings, lang)} />;
              case 'references':
                return <CVReferences key={sectionId} references={references} variant={variant} accentColor={accentColor} title={getSectionTitle('references', cv.settings, lang)} />;
              case 'divers':
                return <CVDivers key={sectionId} divers={divers} variant={variant} accentColor={accentColor} title={getSectionTitle('divers', cv.settings, lang)} />;
              default:
                return null;
            }
          })}
        </div>
      </div>

      <CVFooter footer={footer} variant={variant} lang={lang} />
    </div>
  );
}
