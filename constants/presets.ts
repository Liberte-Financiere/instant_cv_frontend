import { CVMode, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';

export interface CVPreset {
  sectionTitles: Record<string, string>;
  sectionOrder: CVSectionId[];
}

export const CV_PRESETS: Record<CVMode, CVPreset> = {
  professional: {
    sectionTitles: {}, // Utilise les traductions par défaut de constants/sections.ts
    sectionOrder: DEFAULT_SECTION_ORDER, // L'ordre standard
  },
  academic: {
    sectionTitles: {}, // Géré dynamiquement par getSectionTitle via ACADEMIC_SECTION_TITLES
    // Ordre spécifique UVBF / Étudiant (Formation avant Expérience)
    sectionOrder: [
      'summary',
      'education',
      'experience',
      'projects',
      'skills',
      'languages',
      'qualities',
      'hobbies',
      'certifications',
      'references',
      'divers'
    ]
  }
};
