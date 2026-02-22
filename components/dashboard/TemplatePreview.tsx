import React from 'react';
import { TemplateId } from '@/types/cv';
import { DUMMY_CV } from './TemplateDummyData';
import { CVThumbnail } from './CVThumbnail';

import { LazyMount } from '@/components/ui/LazyMount';

interface TemplatePreviewProps {
  templateId: TemplateId;
  color?: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ templateId }) => {
  // Use the DUMMY_CV but override the templateId to the currently selected one
  const previewCV = {
    ...DUMMY_CV,
    templateId: templateId
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-white select-none pointer-events-none">
       {/* Use CVThumbnail to render the template. 
           We use a slightly larger scale here (0.16) for the selector cards.
           We absolutely position it to match the previous layout.
       */}
       <div className="absolute top-0 left-0 w-full h-full flex justify-center">
            <LazyMount className="w-full h-full flex justify-center items-center">
                <CVThumbnail cv={previewCV} scale={0.16} />
            </LazyMount>
       </div>
    </div>
  );
};
