

// Dictionary of static section titles per language
export const SECTION_TITLES: Record<string, Record<string, string>> = {
  fr: {
    contact: "CONTACT",
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
  },
  en: {
    contact: "CONTACT",
    education: "EDUCATION",
    certifications: "CERTIFICATIONS",
    qualities: "QUALITIES",
    skills: "SKILLS",
    languages: "LANGUAGES",
    experience: "PROFESSIONAL EXPERIENCE",
    projects: "PROJECTS",
    hobbies: "HOBBIES & INTERESTS",
    references: "REFERENCES",
    divers: "MISCELLANEOUS",
    summary: "PROFILE",
  },
  zh: {
    contact: "联系方式",
    education: "教育背景",
    certifications: "资质认证",
    qualities: "个人品质",
    skills: "专业技能",
    languages: "语言能力",
    experience: "工作经验",
    projects: "项目经验",
    hobbies: "兴趣爱好",
    references: "推荐信",
    divers: "其他",
    summary: "个人简介",
  }
};
export const ACADEMIC_SECTION_TITLES: Record<string, Record<string, string>> = {
  fr: {
    summary: 'OBJECTIF PROFESSIONNEL',
    education: 'FORMATION ACADÉMIQUE',
    experience: 'EXPÉRIENCES PROFESSIONNELLES',
    projects: 'PROJETS ACADÉMIQUES & TRAVAUX PRATIQUES',
    skills: 'COMPÉTENCES',
    languages: 'COMPÉTENCES LINGUISTIQUES',
    qualities: 'QUALITÉS PERSONNELLES',
    hobbies: 'CENTRES D\'INTÉRÊT',
    certifications: 'FORMATIONS',
    references: 'RÉFÉRENCES',
    divers: 'DIVERS',
  },
  en: {
    summary: 'PROFESSIONAL OBJECTIVE',
    education: 'ACADEMIC BACKGROUND',
    experience: 'PROFESSIONAL EXPERIENCE',
    projects: 'ACADEMIC PROJECTS & PRACTICAL WORK',
    skills: 'SKILLS',
    languages: 'LINGUISTIC SKILLS',
    qualities: 'PERSONAL QUALITIES',
    hobbies: 'HOBBIES & INTERESTS',
    certifications: 'CERTIFICATIONS',
    references: 'REFERENCES',
    divers: 'MISCELLANEOUS',
  },
  zh: {
    summary: '职业目标',
    education: '学术背景',
    experience: '专业经验',
    projects: '学术项目与实践工作',
    skills: '专业技能',
    languages: '语言能力',
    qualities: '个人品质',
    hobbies: '兴趣爱好',
    certifications: '资质认证',
    references: '推荐信',
    divers: '其他',
  }
};

import { CVSettings } from '@/types/cv';

export const getSectionTitle = (sectionId: string, settings?: CVSettings, language: string = 'fr'): string => {
  const customTitle = settings?.sectionTitles?.[sectionId];
  if (customTitle?.trim()) return customTitle.trim();
  
  if (settings?.cvMode === 'academic') {
    const academicDict = ACADEMIC_SECTION_TITLES[language] || ACADEMIC_SECTION_TITLES['fr'];
    if (academicDict[sectionId]) return academicDict[sectionId];
  }
  
  const langDict = SECTION_TITLES[language] || SECTION_TITLES['fr'];
  return langDict[sectionId] || sectionId.toUpperCase();
};

const PRESENT_LABELS: Record<string, string> = {
  fr: 'Présent',
  en: 'Present',
  zh: '至今',
};

export const getPresentLabel = (language: string = 'fr'): string => {
  return PRESENT_LABELS[language] || PRESENT_LABELS['fr'];
};
