'use client';

import { CV } from '@/types/cv';
import { 
  CVContact, CVSummary, CVExperience, CVEducation, 
  CVSkills, CVLanguages, CVHobbies, CVCertifications, 
  CVProjects, CVReferences, CVDivers, CVFooter, CVQualities 
} from '@/components/cv-sections';

import { SECTION_TITLES } from '@/constants/sections';

interface TemplateProps {
  cv: CV;
}

export function CreativeGrid({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = cv;
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
              <CVSummary summary={personalInfo.summary} variant={variant} />
              <CVExperience experiences={experiences} variant={variant} />
              <CVEducation education={education} variant={variant} title={SECTION_TITLES.education} />
              <CVProjects projects={projects} variant={variant} />
            </div>

            {/* Sidebar Column (1/3) */}
            <div className="space-y-8">
              <CVSkills skills={skills} variant={variant} layout="bars" />
              <CVLanguages languages={languages} variant={variant} />
              <CVCertifications certifications={certifications} variant={variant} title={SECTION_TITLES.certifications} />
              <CVQualities qualities={cv.qualities || []} variant={variant} title={SECTION_TITLES.qualities} />
              <CVHobbies hobbies={hobbies} variant={variant} />
              <CVReferences references={references} variant={variant} showContact={false} />
            </div>
          </div>

          <div className="mt-8">
            <CVDivers divers={divers} variant={variant} />
          </div>
        </div>
      </div>

      <CVFooter footer={footer} variant={variant} />
    </div>
  );
}
