// CV Types for Antigravity

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  photo?: string;
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

export interface CV {
  id: string;
  title: string;
  templateId: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  createdAt: Date;
  updatedAt: Date;
}

export type EditorStep =
  | "personal"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "preview";

export const EDITOR_STEPS: { key: EditorStep; label: string }[] = [
  { key: "personal", label: "Informations Personnelles" },
  { key: "experience", label: "Expériences" },
  { key: "education", label: "Formation" },
  { key: "skills", label: "Compétences" },
  { key: "languages", label: "Langues" },
  { key: "preview", label: "Aperçu" },
];
