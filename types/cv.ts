export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  photoUrl?: string;
  title: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Language {
  id: string;
  name: string;
  level: "Débutant" | "Intermédiaire" | "Avancé" | "Natif";
}

export interface Hobby {
  id: string;
  name: string;
}

// NEW: Certifications
export interface Certification {
  id: string;
  name: string;
  organization: string;
  date: string;
  url?: string;
  credentialUrl?: string;
}

// NEW: Projects
export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  github?: string;
  technologies?: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email?: string;
  phone?: string;
  hideContact?: boolean;
}

// NEW: Social Links
export interface SocialLink {
  id: string;
  platform: 'linkedin' | 'github' | 'portfolio' | 'twitter' | 'other';
  url: string;
  label?: string;
}

export interface CVFooter {
  showFooter: boolean;
  madeAt: string;
  madeDate: string;
  signatureUrl?: string;
}

// NEW: CV Settings for customization
export interface CVSettings {
  accentColor: string; // hex color
  sidebarColor?: string; // hex color
  fontFamily?: 'sans' | 'serif' | 'mono';
}

export type TemplateId = 'modern' | 'professional' | 'executive' | 'creative' | 'tech' | 'minimalist' | 'ats';

export type CVSectionId = 'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'hobbies' | 'certifications' | 'projects' | 'references' | 'divers';

export const DEFAULT_SECTION_ORDER: CVSectionId[] = [
  'summary', 'experience', 'education', 'skills', 'languages', 
  'hobbies', 'certifications', 'projects', 'references', 'divers'
];

export interface CV {
  id: string;
  title: string;
  templateId: TemplateId;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  hobbies: Hobby[];
  certifications: Certification[];
  projects: Project[];
  references: Reference[];
  socialLinks: SocialLink[];
  divers: string;
  footer: CVFooter;
  settings: CVSettings;
  sectionOrder: CVSectionId[];
  createdAt: Date;
  updatedAt: Date;
}

export type EditorStep =
  | "personal"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "hobbies"
  | "certifications"
  | "projects"
  | "references"
  | "divers"
  | "preview";

export const EDITOR_STEPS: { key: EditorStep; label: string }[] = [
  { key: "personal", label: "Infos Personnelles" },
  { key: "experience", label: "Expériences" },
  { key: "education", label: "Formation" },
  { key: "skills", label: "Compétences" },
  { key: "certifications", label: "Certifications" },
  { key: "projects", label: "Projets" },
  { key: "languages", label: "Langues" },
  { key: "hobbies", label: "Centres d'intérêt" },
  { key: "references", label: "Références" },
  { key: "divers", label: "Divers" },
  { key: "preview", label: "Aperçu" },
];

// Variant type for reusable components
export type CVVariant = 'modern' | 'professional' | 'executive' | 'creative' | 'tech';
