import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  CV, PersonalInfo, Experience, Education, Skill, Language, 
  Hobby, CVFooter, EditorStep, Certification, Project, Reference, SocialLink, CVSettings 
} from '@/types/cv';
import { generateId } from '@/lib/utils';

interface CVState {
  currentCV: CV | null;
  currentStep: EditorStep;
  cvList: CV[];
  
  // Core Actions
  setCurrentStep: (step: EditorStep) => void;
  createNewCV: (title: string, templateId?: string) => string;
  loadCV: (id: string) => void;
  deleteCV: (id: string) => void;
  
  // Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  
  // Experiences
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  
  // Education
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  // Skills
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  
  // Languages
  addLanguage: (lang: Omit<Language, 'id'>) => void;
  updateLanguage: (id: string, lang: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  // Hobbies
  addHobby: (hobby: Omit<Hobby, 'id'>) => void;
  removeHobby: (id: string) => void;

  // Certifications
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  // Projects
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // References
  addReference: (ref: Omit<Reference, 'id'>) => void;
  updateReference: (id: string, ref: Partial<Reference>) => void;
  removeReference: (id: string) => void;

  // Social Links
  addSocialLink: (link: Omit<SocialLink, 'id'>) => void;
  updateSocialLink: (id: string, link: Partial<SocialLink>) => void;
  removeSocialLink: (id: string) => void;

  // Divers & Footer & Settings
  updateDivers: (text: string) => void;
  updateFooter: (footer: Partial<CVFooter>) => void;
  updateSettings: (settings: Partial<CVSettings>) => void;
}

const DEFAULT_SETTINGS: CVSettings = {
  accentColor: '#2563eb', // Blue
  fontFamily: 'sans',
};

const createEmptyCV = (title: string, templateId: string = 'modern'): CV => ({
  id: generateId(),
  title,
  templateId: templateId as CV['templateId'],
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  hobbies: [],
  certifications: [],
  projects: [],
  references: [],
  socialLinks: [],
  divers: '',
  footer: {
    showFooter: false,
    madeAt: '',
    madeDate: '',
    signatureUrl: '',
  },
  settings: DEFAULT_SETTINGS,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Helper to update CV and sync with list
const updateCV = (state: CVState, updater: (cv: CV) => CV) => {
  if (!state.currentCV) return state;
  const updatedCV = updater({ ...state.currentCV, updatedAt: new Date() });
  return {
    currentCV: updatedCV,
    cvList: state.cvList.map((c) => c.id === updatedCV.id ? updatedCV : c),
  };
};

export const useCVStore = create<CVState>()(
  persist(
    (set, get) => ({
      currentCV: null,
      currentStep: 'personal',
      cvList: [],

      setCurrentStep: (step) => set({ currentStep: step }),

      createNewCV: (title, templateId = 'modern') => {
        const newCV = createEmptyCV(title, templateId);
        set((state) => ({
          cvList: [...state.cvList, newCV],
          currentCV: newCV,
          currentStep: 'personal',
        }));
        return newCV.id;
      },

      loadCV: (id) => {
        const cv = get().cvList.find((c) => c.id === id);
        if (cv) {
          // Migrate old CVs that don't have new fields
          const migratedCV: CV = {
            ...cv,
            hobbies: cv.hobbies || [],
            certifications: cv.certifications || [],
            projects: cv.projects || [],
            references: cv.references || [],
            socialLinks: cv.socialLinks || [],
            divers: cv.divers || '',
            footer: cv.footer || { showFooter: false, madeAt: '', madeDate: '', signatureUrl: '' },
            settings: cv.settings || DEFAULT_SETTINGS,
          };
          set({ currentCV: migratedCV, currentStep: 'personal' });
        }
      },

      deleteCV: (id) => {
        set((state) => ({
          cvList: state.cvList.filter((c) => c.id !== id),
          currentCV: state.currentCV?.id === id ? null : state.currentCV,
        }));
      },

      // Personal Info
      updatePersonalInfo: (info) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        personalInfo: { ...cv.personalInfo, ...info },
      }))),

      // Experiences
      addExperience: (exp) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        experiences: [...cv.experiences, { ...exp, id: generateId() }],
      }))),
      updateExperience: (id, exp) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        experiences: cv.experiences.map((e) => e.id === id ? { ...e, ...exp } : e),
      }))),
      removeExperience: (id) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        experiences: cv.experiences.filter((e) => e.id !== id),
      }))),

      // Education
      addEducation: (edu) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        education: [...cv.education, { ...edu, id: generateId() }],
      }))),
      updateEducation: (id, edu) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        education: cv.education.map((e) => e.id === id ? { ...e, ...edu } : e),
      }))),
      removeEducation: (id) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        education: cv.education.filter((e) => e.id !== id),
      }))),

      // Skills
      addSkill: (skill) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        skills: [...cv.skills, { ...skill, id: generateId() }],
      }))),
      updateSkill: (id, skill) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        skills: cv.skills.map((s) => s.id === id ? { ...s, ...skill } : s),
      }))),
      removeSkill: (id) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        skills: cv.skills.filter((s) => s.id !== id),
      }))),

      // Languages
      addLanguage: (lang) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        languages: [...cv.languages, { ...lang, id: generateId() }],
      }))),
      updateLanguage: (id, lang) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        languages: cv.languages.map((l) => l.id === id ? { ...l, ...lang } : l),
      }))),
      removeLanguage: (id) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        languages: cv.languages.filter((l) => l.id !== id),
      }))),

      // Hobbies
      addHobby: (hobby) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        hobbies: [...(cv.hobbies || []), { ...hobby, id: generateId() }],
      }))),
      removeHobby: (id) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        hobbies: (cv.hobbies || []).filter((h) => h.id !== id),
      }))),

      // Certifications
      addCertification: (cert) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        certifications: [...(cv.certifications || []), { ...cert, id: generateId() }],
      }))),
      updateCertification: (id, cert) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        certifications: (cv.certifications || []).map((c) => c.id === id ? { ...c, ...cert } : c),
      }))),
      removeCertification: (id) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        certifications: (cv.certifications || []).filter((c) => c.id !== id),
      }))),

      // Projects
      addProject: (project) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        projects: [...(cv.projects || []), { ...project, id: generateId() }],
      }))),
      updateProject: (id, project) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        projects: (cv.projects || []).map((p) => p.id === id ? { ...p, ...project } : p),
      }))),
      removeProject: (id) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        projects: (cv.projects || []).filter((p) => p.id !== id),
      }))),

      // References
      addReference: (ref) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        references: [...(cv.references || []), { ...ref, id: generateId() }],
      }))),
      updateReference: (id, ref) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        references: (cv.references || []).map((r) => r.id === id ? { ...r, ...ref } : r),
      }))),
      removeReference: (id) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        references: (cv.references || []).filter((r) => r.id !== id),
      }))),

      // Social Links
      addSocialLink: (link) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        socialLinks: [...(cv.socialLinks || []), { ...link, id: generateId() }],
      }))),
      updateSocialLink: (id, link) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        socialLinks: (cv.socialLinks || []).map((l) => l.id === id ? { ...l, ...link } : l),
      }))),
      removeSocialLink: (id) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        socialLinks: (cv.socialLinks || []).filter((l) => l.id !== id),
      }))),

      // Divers
      updateDivers: (text) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        divers: text,
      }))),

      // Footer
      updateFooter: (footer) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        footer: { ...(cv.footer || {}), ...footer },
      }))),

      // Settings
      updateSettings: (settings) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        settings: { ...(cv.settings || DEFAULT_SETTINGS), ...settings },
      }))),
    }),
    {
      name: 'optijob-cv-storage',
    }
  )
);
