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

  return (
    <div className="cv-template w-full h-full bg-slate-50 text-slate-900 font-sans min-h-[297mm] flex flex-col">
      <div className="flex-1">
        {/* Header with Accent */}
        <div className="bg-indigo-600 text-white p-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-xl text-indigo-200 font-medium">{personalInfo.title}</p>
          <div className="mt-6 flex flex-wrap gap-6 text-indigo-100 text-sm">
            <CVContact personalInfo={personalInfo} socialLinks={socialLinks} variant={variant} layout="horizontal" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-10">
          <div className="grid grid-cols-3 gap-8">
            {/* Main Column (2/3) */}
            <div className="col-span-2 space-y-8">
              <CVSummary summary={personalInfo.summary} variant={variant}  title={getSectionTitle('summary', undefined, lang)} />
              <CVExperience experiences={experiences} variant={variant}  title={getSectionTitle('experience', undefined, lang)}  lang={lang}/>
              <CVEducation education={education} variant={variant} title={getSectionTitle('education', undefined, lang)}  lang={lang}/>
              <CVProjects projects={projects} variant={variant}  title={getSectionTitle('projects', undefined, lang)} />
            </div>

            {/* Sidebar Column (1/3) */}
            <div className="space-y-8">
              <CVSkills skills={skills} variant={variant} layout="bars"  title={getSectionTitle('skills', undefined, lang)} />
              <CVLanguages languages={languages} variant={variant}  title={getSectionTitle('languages', undefined, lang)} />
              <CVCertifications certifications={certifications} variant={variant} title={getSectionTitle('certifications', undefined, lang)} />
              <CVQualities qualities={cv.qualities || []} variant={variant} title={getSectionTitle('qualities', undefined, lang)} />
              <CVHobbies hobbies={hobbies} variant={variant}  title={getSectionTitle('hobbies', undefined, lang)} />
              <CVReferences references={references} variant={variant} showContact={false}  title={getSectionTitle('references', undefined, lang)} />
            </div>
          </div>

          <div className="mt-8">
            <CVDivers divers={divers} variant={variant}  title={getSectionTitle('divers', undefined, lang)} />
          </div>
        </div>
      </div>

      <CVFooter footer={footer} variant={variant}  lang={lang}/>
    </div>
  );
}
