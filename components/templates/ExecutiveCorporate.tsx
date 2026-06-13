'use client';

import { CV } from '@/types/cv';
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

        {/* Content */}
        <div className="space-y-8">
          <CVSummary summary={personalInfo.summary} variant={variant} accentColor={accentColor} title={getSectionTitle('summary', cv.settings, lang)} />
          <CVExperience experiences={experiences} variant={variant} accentColor={accentColor} title={getSectionTitle('experience', cv.settings, lang)} lang={lang} />
          <CVEducation education={education} variant={variant} accentColor={accentColor} title={getSectionTitle('education', cv.settings, lang)} lang={lang} />
          <CVCertifications certifications={certifications} variant={variant} accentColor={accentColor} title={getSectionTitle('certifications', cv.settings, lang)} />
          
          {/* Skills & Languages */}
          <div className="grid grid-cols-2 gap-8">
            <CVSkills skills={skills} variant={variant} accentColor={accentColor} layout="list" title={getSectionTitle('skills', cv.settings, lang)} />
            <CVLanguages languages={languages} variant={variant} accentColor={accentColor} title={getSectionTitle('languages', cv.settings, lang)} />
          </div>

          <CVProjects projects={projects} variant={variant} accentColor={accentColor} title={getSectionTitle('projects', cv.settings, lang)} />
          <CVQualities qualities={cv.qualities || []} variant={variant} accentColor={accentColor} title={getSectionTitle('qualities', cv.settings, lang)} />
          <CVHobbies hobbies={hobbies} variant={variant} accentColor={accentColor} title={getSectionTitle('hobbies', cv.settings, lang)} />
          <CVReferences references={references} variant={variant} accentColor={accentColor} title={getSectionTitle('references', cv.settings, lang)} />
          <CVDivers divers={divers} variant={variant} accentColor={accentColor} title={getSectionTitle('divers', cv.settings, lang)} />
        </div>
      </div>

      <CVFooter footer={footer} variant={variant}  lang={lang}/>
    </div>
  );
}
