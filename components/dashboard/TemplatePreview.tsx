import React from 'react';
import { TemplateId } from '@/types/cv';
import { DUMMY_CV } from './TemplateDummyData';

// Import all templates
import { ModernSidebar } from '@/components/templates/ModernSidebar';
import { MinimalistTemplate } from '@/components/templates/MinimalistTemplate';
import { ProfessionalClean } from '@/components/templates/ProfessionalClean';
import { ExecutiveCorporate } from '@/components/templates/ExecutiveCorporate';
import { CreativeGrid } from '@/components/templates/CreativeGrid';
import { TechStack } from '@/components/templates/TechStack';
import { ATSFriendlyTemplate } from '@/components/templates/ATSFriendlyTemplate';

interface TemplatePreviewProps {
  templateId: TemplateId;
  color?: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ templateId }) => {
  // Select component
  const getTemplateComponent = () => {
    switch (templateId) {
      case 'ats': return ATSFriendlyTemplate;
      case 'modern': return ModernSidebar;
      case 'professional': return ProfessionalClean;
      case 'minimalist': return MinimalistTemplate;
      case 'executive': return ExecutiveCorporate;
      case 'creative': return CreativeGrid;
      case 'tech': return TechStack;
      
      default: return ATSFriendlyTemplate;
    }
  };

  const Component = getTemplateComponent();

  // Create a copy of dummy data with the specific template ID to ensure internal logic (like default colors) works
  const previewCV = {
    ...DUMMY_CV,
    templateId: templateId
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-white select-none pointer-events-none">
      <div className="absolute top-0 left-0 origin-top-left w-[210mm] min-h-[297mm] transform scale-[0.16]">
         <Component cv={previewCV} />
      </div>
    </div>
  );
};
