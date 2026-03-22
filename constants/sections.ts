

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

export const getSectionTitle = (sectionId: string, customTitle?: string, language: string = 'fr'): string => {
  if (customTitle) return customTitle;
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
