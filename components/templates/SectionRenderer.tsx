'use client';

import { ReactNode } from 'react';
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { 
  CVSummary, CVExperience, CVEducation, 
  CVSkills, CVLanguages, CVHobbies, CVCertifications, 
  CVProjects, CVReferences, CVDivers 
} from '@/components/cv-sections';

interface SectionRendererProps {
  cv: CV;
  variant: 'modern' | 'professional' | 'tech';
  accentColor?: string;
  // Some sections need specific rendering (e.g., sidebar vs main)
  filterSections?: CVSectionId[];
  excludeSections?: CVSectionId[];
}

export function SectionRenderer({ 
  cv, 
  variant, 
  accentColor, 
  filterSections,
  excludeSections = [] 
}: SectionRendererProps) {
  const sectionOrder = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];
  
  // Filter sections if specified
  let sectionsToRender = filterSections 
    ? sectionOrder.filter(s => filterSections.includes(s))
    : sectionOrder;
  
  // Exclude certain sections
  sectionsToRender = sectionsToRender.filter(s => !excludeSections.includes(s));

  const renderSection = (sectionId: CVSectionId): ReactNode => {
    switch (sectionId) {
      case 'summary':
        return cv.personalInfo.summary ? (
          <CVSummary key={sectionId} summary={cv.personalInfo.summary} variant={variant} accentColor={accentColor} />
        ) : null;
      
      case 'experience':
        return cv.experiences.length > 0 ? (
          <CVExperience key={sectionId} experiences={cv.experiences} variant={variant} accentColor={accentColor} />
        ) : null;
      
      case 'education':
        return cv.education.length > 0 ? (
          <CVEducation key={sectionId} education={cv.education} variant={variant} accentColor={accentColor} />
        ) : null;
      
      case 'skills':
        return cv.skills.length > 0 ? (
          <CVSkills key={sectionId} skills={cv.skills} variant={variant} />
        ) : null;
      
      case 'languages':
        return cv.languages.length > 0 ? (
          <CVLanguages key={sectionId} languages={cv.languages} variant={variant} />
        ) : null;
      
      case 'hobbies':
        return (cv.hobbies?.length || 0) > 0 ? (
          <CVHobbies key={sectionId} hobbies={cv.hobbies || []} variant={variant} />
        ) : null;
      
      case 'certifications':
        return (cv.certifications?.length || 0) > 0 ? (
          <CVCertifications key={sectionId} certifications={cv.certifications || []} variant={variant} accentColor={accentColor} />
        ) : null;
      
      case 'projects':
        return (cv.projects?.length || 0) > 0 ? (
          <CVProjects key={sectionId} projects={cv.projects || []} variant={variant} accentColor={accentColor} />
        ) : null;
      
      case 'references':
        return (cv.references?.length || 0) > 0 ? (
          <CVReferences key={sectionId} references={cv.references || []} variant={variant} accentColor={accentColor} />
        ) : null;
      
      case 'divers':
        return cv.divers ? (
          <CVDivers key={sectionId} divers={cv.divers} variant={variant} accentColor={accentColor} />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <>
      {sectionsToRender.map(sectionId => renderSection(sectionId))}
    </>
  );
}
