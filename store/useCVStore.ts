import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CV, PersonalInfo, Experience, Education, Skill, Language, EditorStep } from '@/types/cv';
import { generateId } from '@/lib/utils';

interface CVState {
  // Current CV being edited
  currentCV: CV | null;
  currentStep: EditorStep;
  
  // All CVs
  cvList: CV[];
  
  // Actions
  setCurrentStep: (step: EditorStep) => void;
  createNewCV: (title: string) => string;
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
}

const createEmptyCV = (title: string): CV => ({
  id: generateId(),
  title,
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
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useCVStore = create<CVState>()(
  persist(
    (set, get) => ({
      currentCV: null,
      currentStep: 'personal',
      cvList: [],

      setCurrentStep: (step) => set({ currentStep: step }),

      createNewCV: (title) => {
        const newCV = createEmptyCV(title);
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
          set({ currentCV: cv, currentStep: 'personal' });
        }
      },

      deleteCV: (id) => {
        set((state) => ({
          cvList: state.cvList.filter((c) => c.id !== id),
          currentCV: state.currentCV?.id === id ? null : state.currentCV,
        }));
      },

      updatePersonalInfo: (info) => {
        set((state) => {
          if (!state.currentCV) return state;
          const updatedCV = {
            ...state.currentCV,
            personalInfo: { ...state.currentCV.personalInfo, ...info },
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },

      addExperience: (exp) => {
        set((state) => {
          if (!state.currentCV) return state;
          const newExp = { ...exp, id: generateId() };
          const updatedCV = {
            ...state.currentCV,
            experiences: [...state.currentCV.experiences, newExp],
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },

      updateExperience: (id, exp) => {
        set((state) => {
          if (!state.currentCV) return state;
          const updatedCV = {
            ...state.currentCV,
            experiences: state.currentCV.experiences.map((e) =>
              e.id === id ? { ...e, ...exp } : e
            ),
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },

      removeExperience: (id) => {
        set((state) => {
          if (!state.currentCV) return state;
          const updatedCV = {
            ...state.currentCV,
            experiences: state.currentCV.experiences.filter((e) => e.id !== id),
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },

      addEducation: (edu) => {
        set((state) => {
          if (!state.currentCV) return state;
          const newEdu = { ...edu, id: generateId() };
          const updatedCV = {
            ...state.currentCV,
            education: [...state.currentCV.education, newEdu],
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },

      updateEducation: (id, edu) => {
        set((state) => {
          if (!state.currentCV) return state;
          const updatedCV = {
            ...state.currentCV,
            education: state.currentCV.education.map((e) =>
              e.id === id ? { ...e, ...edu } : e
            ),
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },

      removeEducation: (id) => {
        set((state) => {
          if (!state.currentCV) return state;
          const updatedCV = {
            ...state.currentCV,
            education: state.currentCV.education.filter((e) => e.id !== id),
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },

      addSkill: (skill) => {
        set((state) => {
          if (!state.currentCV) return state;
          const newSkill = { ...skill, id: generateId() };
          const updatedCV = {
            ...state.currentCV,
            skills: [...state.currentCV.skills, newSkill],
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },

      updateSkill: (id, skill) => {
        set((state) => {
          if (!state.currentCV) return state;
          const updatedCV = {
            ...state.currentCV,
            skills: state.currentCV.skills.map((s) =>
              s.id === id ? { ...s, ...skill } : s
            ),
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },

      removeSkill: (id) => {
        set((state) => {
          if (!state.currentCV) return state;
          const updatedCV = {
            ...state.currentCV,
            skills: state.currentCV.skills.filter((s) => s.id !== id),
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },

      addLanguage: (lang) => {
        set((state) => {
          if (!state.currentCV) return state;
          const newLang = { ...lang, id: generateId() };
          const updatedCV = {
            ...state.currentCV,
            languages: [...state.currentCV.languages, newLang],
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },

      updateLanguage: (id, lang) => {
        set((state) => {
          if (!state.currentCV) return state;
          const updatedCV = {
            ...state.currentCV,
            languages: state.currentCV.languages.map((l) =>
              l.id === id ? { ...l, ...lang } : l
            ),
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },

      removeLanguage: (id) => {
        set((state) => {
          if (!state.currentCV) return state;
          const updatedCV = {
            ...state.currentCV,
            languages: state.currentCV.languages.filter((l) => l.id !== id),
            updatedAt: new Date(),
          };
          return {
            currentCV: updatedCV,
            cvList: state.cvList.map((c) =>
              c.id === updatedCV.id ? updatedCV : c
            ),
          };
        });
      },
    }),
    {
      name: 'optijob-cv-storage',
    }
  )
);
