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
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-2 border-b-2 border-black inline-block pb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-lg font-medium mt-4">{personalInfo.title}</p>
          <div className="mt-4">
            <CVContact personalInfo={personalInfo} socialLinks={socialLinks} variant={variant} layout="horizontal" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <CVSummary summary={personalInfo.summary} variant={variant}  title={getSectionTitle('summary', undefined, lang)} />
          <CVExperience experiences={experiences} variant={variant}  title={getSectionTitle('experience', undefined, lang)}  lang={lang}/>
          <CVEducation education={education} variant={variant} title={getSectionTitle('education', undefined, lang)}  lang={lang}/>
          <CVCertifications certifications={certifications} variant={variant} title={getSectionTitle('certifications', undefined, lang)} />
          
          {/* Skills & Languages */}
          <div className="grid grid-cols-2 gap-8">
            <CVSkills skills={skills} variant={variant} layout="list"  title={getSectionTitle('skills', undefined, lang)} />
            <CVLanguages languages={languages} variant={variant}  title={getSectionTitle('languages', undefined, lang)} />
          </div>

          <CVProjects projects={projects} variant={variant}  title={getSectionTitle('projects', undefined, lang)} />
          <CVQualities qualities={cv.qualities || []} variant={variant} title={getSectionTitle('qualities', undefined, lang)} />
          <CVHobbies hobbies={hobbies} variant={variant}  title={getSectionTitle('hobbies', undefined, lang)} />
          <CVReferences references={references} variant={variant}  title={getSectionTitle('references', undefined, lang)} />
          <CVDivers divers={divers} variant={variant}  title={getSectionTitle('divers', undefined, lang)} />
        </div>
      </div>

      <CVFooter footer={footer} variant={variant}  lang={lang}/>
    </div>
  );
}
