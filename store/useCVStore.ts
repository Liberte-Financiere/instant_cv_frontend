import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/storage';
import { CVService } from '@/services/cvService';
import { toast } from 'sonner';
import type { 
  CV, PersonalInfo, Experience, Education, Skill, Language, Quality,
  Hobby, CVFooter, EditorStep, Certification, Project, Reference, SocialLink, CVSettings, CVSectionId 
} from '@/types/cv';
import { DEFAULT_SECTION_ORDER } from '@/types/cv';
import { generateId } from '@/lib/utils';

// New Interface for Detailed Analysis
export interface SectionAudit {
  score: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export interface DetailedAnalysis {
  globalScore: number;
  globalReview: string;
  detectedKeywords: string[];
  recommendedPositions: {
    title: string;
    match: number;
    reason: string;
  }[];
  sections: {
    structure: SectionAudit;
    experience: SectionAudit;
    education: SectionAudit;
    skills: SectionAudit;
  };
}

interface CVState {
  currentCV: CV | null;
  currentStep: EditorStep;
  cvList: CV[];

  // Analysis State
  lastAnalysis: { analysis: DetailedAnalysis, cvData: Partial<CV> } | null;
  setAnalysisData: (data: { analysis: DetailedAnalysis, cvData: Partial<CV> } | null) => void;
  
  // API Sync
  fetchUserCVs: () => Promise<void>;
  fetchCV: (id: string) => Promise<CV | null>;
  saveCurrentCV: () => Promise<void>;
  
  // Core Actions
  setCurrentStep: (step: EditorStep) => void;
  createNewCV: (title: string, templateId?: string) => string;
  createImportedCV: (data: Partial<CV>) => string;
  loadCV: (id: string) => void;
  deleteCV: (id: string) => Promise<void>;
  
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

  // Qualities
  addQuality: (quality: Omit<Quality, 'id'>) => void;
  updateQuality: (id: string, quality: Partial<Quality>) => void;
  removeQuality: (id: string) => void;

  // Social Links
  addSocialLink: (link: Omit<SocialLink, 'id'>) => void;
  updateSocialLink: (id: string, link: Partial<SocialLink>) => void;
  removeSocialLink: (id: string) => void;

  // Divers & Footer & Settings
  updateDivers: (text: string) => void;
  updateFooter: (footer: Partial<CVFooter>) => void;
  updateSettings: (settings: Partial<CVSettings>) => void;
  
  // Section Order
  updateSectionOrder: (order: CVSectionId[]) => void;

  // Sharing & Analytics
  incrementViews: (cvId: string) => void;
  togglePublic: (cvId: string) => void;
}

const DEFAULT_SETTINGS: CVSettings = {
  accentColor: '#2563eb', // Blue
  sidebarColor: '#0f172a', // Slate 900
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
  qualities: [],
  socialLinks: [],
  divers: '',
  footer: {
    showFooter: false,
    madeAt: '',
    madeDate: '',
    signatureUrl: '',
  },
  settings: DEFAULT_SETTINGS,
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  views: 0,
  isPublic: false,
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
      
      lastAnalysis: null,
      setAnalysisData: (data) => set({ lastAnalysis: data }),

      // API Sync
      fetchUserCVs: async () => {
        try {
          const serverCVs = await CVService.getAll();
          const { cvList: localCVs } = get();
          
          // Create a map of server CVs by ID (server is source of truth)
          const serverCVMap = new Map(serverCVs.map(cv => [cv.id, cv]));
          
          // For any local CVs not on server yet, keep them (they might be unsaved)
          const unsavedLocalCVs = localCVs.filter(cv => !serverCVMap.has(cv.id));
          
          // Merge: server CVs first, then unsaved local CVs
          const mergedCVs = [...serverCVs, ...unsavedLocalCVs];
          
          set({ cvList: mergedCVs });
        } catch (error) {
          console.error('Failed to fetch CVs', error);
        }
      },

      fetchCV: async (id: string) => {
        try {
          // Check local first
          const localCV = get().cvList.find(c => c.id === id);
          if (localCV) return localCV;

          // Check server
          const serverCV = await CVService.getById(id);
          
          // Add to local list and format if needed
          // Assuming API returns correct full format due to previous fix
          if (serverCV) {
            set(state => ({
              cvList: [...state.cvList.filter(c => c.id !== id), serverCV],
              currentCV: serverCV
            }));
            return serverCV;
          }
          return null;
        } catch (error) {
          console.error('Failed to fetch CV', error);
          return null;
        }
      },

      saveCurrentCV: async () => {
        const { currentCV } = get();
        if (!currentCV) return;
        try {
           await CVService.update(currentCV.id, currentCV);
        } catch (error) {
           console.error('Failed to save CV', error);
           toast.error('Échec de la sauvegarde. Vérifiez votre connexion.');
        }
      },

      setCurrentStep: (step) => set({ currentStep: step }),

      createNewCV: (title, templateId = 'modern') => {
        const newCV = createEmptyCV(title, templateId);
        set((state) => ({
          cvList: [...state.cvList, newCV],
          currentCV: newCV,
          currentStep: 'personal',
        }));
        
        // Sync with server (fire and forget)
        CVService.create(newCV).catch(err => {
          console.error('Failed to create CV on server', err);
          toast.error('Échec de création du CV sur le serveur.');
        });
        
        return newCV.id;
      },

      createImportedCV: (data) => {
        const newCV = createEmptyCV(`CV Importé ${new Date().toLocaleDateString()}`, 'modern');
        
        // Helper to ensure all items in an array have an ID
        const ensureIds = <T>(arr: unknown[]): T[] => {
            if (!Array.isArray(arr)) return [] as T[];
            return arr.map(item => {
                const record = item as Record<string, unknown>;
                return { 
                    ...record, 
                    id: (record.id as string) || generateId() 
                } as unknown as T;
            });
        };

        // Merge imported data with default structure AND ensure IDs
        const mergedCV: CV = {
           ...newCV,
           ...data,
           id: newCV.id, // Keep generated main ID
           settings: newCV.settings, // Keep default settings
           
           // Sanitize Arrays
           experiences: ensureIds(data.experiences || []),
           education: ensureIds(data.education || []),
           skills: ensureIds(data.skills || []),
           languages: ensureIds(data.languages || []),
           hobbies: ensureIds(data.hobbies || []),
           certifications: ensureIds(data.certifications || []),
           projects: ensureIds(data.projects || []),
           references: ensureIds(data.references || []),
           qualities: ensureIds(data.qualities || []),
           socialLinks: ensureIds(data.socialLinks || []),
           
           createdAt: new Date(),
           updatedAt: new Date(),
        };

        set((state) => ({
          cvList: [...state.cvList, mergedCV],
          currentCV: mergedCV,
          currentStep: 'personal',
        }));
        
        // Sync with server (fire and forget)
        CVService.create(mergedCV).catch(err => {
          console.error('Failed to save imported CV on server', err);
          toast.error('Échec de sauvegarde du CV importé.');
        });
        
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
            qualities: cv.qualities || [],
            socialLinks: cv.socialLinks || [],
            divers: cv.divers || '',
            footer: cv.footer || { showFooter: false, madeAt: '', madeDate: '', signatureUrl: '' },
            settings: cv.settings || DEFAULT_SETTINGS,
            views: cv.views || 0,
            isPublic: cv.isPublic || false,
          };
          set({ currentCV: migratedCV, currentStep: 'personal' });
        }
      },

      deleteCV: async (id) => {
        // Delete locally first for instant feedback
        set((state) => ({
          cvList: state.cvList.filter((c) => c.id !== id),
          currentCV: state.currentCV?.id === id ? null : state.currentCV,
        }));
        
        // Then sync with server
        try {
          await CVService.delete(id);
        } catch (error) {
          console.error('Failed to delete CV from server', error);
          toast.error('Échec de suppression du CV sur le serveur.');
        }
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

      // Qualities
      addQuality: (quality) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        qualities: [...(cv.qualities || []), { ...quality, id: generateId() }],
      }))),
      updateQuality: (id, quality) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        qualities: (cv.qualities || []).map((q) => q.id === id ? { ...q, ...quality } : q),
      }))),
      removeQuality: (id) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        qualities: (cv.qualities || []).filter((q) => q.id !== id),
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

      // Section Order
      updateSectionOrder: (order) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        sectionOrder: order,
      }))),

      // Sharing & Analytics
      incrementViews: (cvId) => set((state) => {
        const updatedList = state.cvList.map((c) => 
          c.id === cvId ? { ...c, views: (c.views || 0) + 1 } : c
        );
        return {
          cvList: updatedList,
          currentCV: state.currentCV?.id === cvId 
            ? { ...state.currentCV, views: (state.currentCV.views || 0) + 1 } 
            : state.currentCV
        };
      }),

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      togglePublic: (_cvId) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        isPublic: !cv.isPublic,
      }))),
    }),
    {
      name: 'optijob-cv-storage',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
