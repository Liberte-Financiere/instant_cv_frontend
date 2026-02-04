# 🎨 How to Create a New CV Template

This guide explains how to create a new CV template in **Instant CV** using the modular architecture.

## 1. Concepts

- **Templates** are React components stored in `components/templates/`.
- **CV Sections** are reusable components (e.g., `CVEducation`, `CVSkills`) in `components/cv-sections/`.
- **Titles** are centralized in `constants/sections.ts` to ensure consistency (e.g., "ÉDUCATION", "FORMATIONS").
- **SectionRenderer** is a helper to render a list of sections dynamically (optional, but recommended for advanced layouts).

## 2. Step-by-Step Guide

### A. Create the Component

Create a new file, e.g., `components/templates/MyNewTemplate.tsx`.

```tsx
'use client';

import { CV } from '@/types/cv';
import { SECTION_TITLES } from '@/constants/sections';
import { 
  CVContact, CVSummary, CVExperience, CVEducation, 
  CVSkills, CVLanguages, CVHobbies, CVCertifications, 
  CVProjects, CVReferences, CVDivers, CVFooter, CVQualities 
} from '@/components/cv-sections';

interface TemplateProps {
  cv: CV;
}

export function MyNewTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = cv;
  const certifications = cv.certifications || [];
  
  const variant = 'modern'; // or 'professional', 'creative'

  return (
    <div className="cv-template p-10 bg-white text-black min-h-[297mm]">
      {/* HEADER */}
      <h1>{personalInfo.firstName} {personalInfo.lastName}</h1>
      
      {/* SECTIONS */}
      
      {/* Use SECTION_TITLES for localized titles! */}
      <CVEducation 
    	education={education} 
    	variant={variant} 
    	title={SECTION_TITLES.education} 
      />

      <CVCertifications 
    	certifications={certifications} 
    	variant={variant} 
    	title={SECTION_TITLES.certifications} 
      />

      <CVQualities 
        qualities={cv.qualities || []}
        variant={variant}
        title={SECTION_TITLES.qualities}
      />
    </div>
  );
}
```

### B. Register the Template

1. Export your template in `components/templates/index.ts`.
2. Add it to the renderer in `components/editor/CVPreview.tsx` (or `SectionRenderer` if using dynamic loading).
3. Add a metadata entry (ID, name, thumbnail) so it appears in the **Template Selector**.

## 3. Best Practices

- **ALWAYS** use `SECTION_TITLES` from `@/constants/sections`. Do not hardcode "Experience" or "Education".
- **Check for Empty Data**: Always check `if (data.length > 0)` before rendering a section wrapper to avoid empty headings.
- **Use `variant` prop**: Pass the variant ('modern', 'professional', etc.) to section components so they style themselves matching your theme.
- **Page Breaks**: Use CSS `break-inside: avoid` on items if needed for print layout.

## 4. Troubleshooting

- **ReferenceError**: If you see `SECTION_TITLES is not defined`, check that you imported it at the **TOP** of the file, not inside the component function.
