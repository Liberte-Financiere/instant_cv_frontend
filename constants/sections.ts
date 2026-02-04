import { CVSectionId } from '@/types/cv';

export const SECTION_TITLES: Record<string, string> = {
  education: "ÉDUCATION",
  certifications: "FORMATIONS",
  qualities: "QUALITÉS",
  skills: "COMPÉTENCES",
  languages: "LANGUES",
  experience: "EXPÉRIENCE PROFESSIONNELLE",
  projects: "PROJETS",
  hobbies: "CENTRES D'INTÉRÊT",
  references: "RÉFÉRENCES",
  divers: "DIVERS",
  summary: "PROFIL",
};

export const getSectionTitle = (sectionId: string, customTitle?: string): string => {
  if (customTitle) return customTitle;
  return SECTION_TITLES[sectionId] || sectionId.toUpperCase();
};
