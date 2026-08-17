import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/storage';
import { CVService } from '@/services/cvService';
import { toast } from 'sonner';
import type { 
  CV, PersonalInfo, Experience, Education, Skill, Language, Quality,
  Hobby, CVFooter, EditorStep, Certification, Project, Reference, SocialLink, CVSettings, CVSectionId, TemplateId
} from '@/types/cv';
import { DEFAULT_SECTION_ORDER } from '@/types/cv';
import { generateId, sanitizeCVData } from '@/lib/utils';

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

// Match Result State
export interface MatchResultState {
  result: any; // Using any to avoid circular dependency, or import MatchResultData if possible
  cvSourceMode: 'select' | 'upload';
  selectedCVId: string;
  bilanData?: any; // Used to restore a bilan from history
}

// History State
export interface AnalysisHistoryItem {
  id: string;
  type: 'analysis' | 'match' | 'bilan';
  date: string; // ISO string
  score: number;
  title: string;
  data: any; // Full result data
}

interface CVState {
  currentCV: CV | null;
  currentStep: EditorStep;
  cvList: CV[];
  
  // History
  history: AnalysisHistoryItem[];
  addToHistory: (item: AnalysisHistoryItem) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;

  // Bilan State
  lastBilan: any | null;
  setBilanData: (data: any | null) => void;

  // Analysis State
  lastAnalysis: { analysis: DetailedAnalysis, cvData: Partial<CV> } | null;
  setAnalysisData: (data: { analysis: DetailedAnalysis, cvData: Partial<CV> } | null) => void;

  // Match State
  lastMatch: MatchResultState | null;
  setMatchData: (data: MatchResultState | null) => void;
  
  // API Sync
  fetchUserCVs: () => Promise<void>;
  fetchCV: (id: string) => Promise<CV | null>;
  saveCurrentCV: () => Promise<void>;
  
  // Core Actions
  setCurrentStep: (step: EditorStep) => void;
  createNewCV: (title: string, templateId?: string) => string;
  createImportedCV: (data: Partial<CV>) => string;
  loadCV: (id: string) => Promise<void>;
  deleteCV: (id: string) => Promise<void>;
  
  // Personal Info
  updateCVTitle: (newTitle: string) => void;
  updateTemplateId: (templateId: TemplateId) => void;
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

  // AI Translation
  translateCV: (id: string, targetLanguage: 'en' | 'fr' | 'zh') => Promise<string | null>;
}

const DEFAULT_SETTINGS: CVSettings = {
  accentColor: '#2563eb', // Blue
  sidebarColor: '#0f172a', // Slate 900
  tagsColor: 'transparent', // Transparent par défaut pour laisser le ModernSidebar utiliser black/20
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
  isSearchable: false,
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
      history: [],
      
      addToHistory: (item) => {
        // Optimistic update
        set((state) => ({ 
          history: [item, ...state.history].slice(0, 50) 
        }));

        // Sync with API
        fetch('/api/ai/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        }).catch(err => console.error('Failed to sync history item:', err));
      },
      
      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter((item) => item.id !== id)
      })),
      clearHistory: () => set({ history: [] }),
      
      lastAnalysis: null,
      setAnalysisData: (data) => set({ lastAnalysis: data }),

      lastMatch: null,
      setMatchData: (data) => set({ lastMatch: data }),

      lastBilan: null,
      setBilanData: (data) => set({ lastBilan: data }),

      // API Sync
      fetchUserCVs: async () => {
        try {
          // Fetch CVs Summaries and History in parallel
          const [cvsRes, historyRes] = await Promise.all([
            CVService.getAllSummaries(),
            fetch('/api/ai/history').then(res => res.ok ? res.json() : [])
          ]);

          const { cvList: localCVs, history: localHistory } = get();
          
          // --- Sync CVs ---
          const serverCVMap = new Map(cvsRes.map(cv => [cv.id, cv]));
          
          const mergedCVs = localCVs.map(localCV => {
            const serverCV = serverCVMap.get(localCV.id);
            if (!serverCV) return localCV; // Keep local if not on server yet (draft)
            
            // If both exist, keep the one with the newest updatedAt date
            const localDate = new Date(localCV.updatedAt || 0).getTime();
            const serverDate = new Date(serverCV.updatedAt || 0).getTime();
            
            // Mark as handled
            serverCVMap.delete(localCV.id);
            
            return localDate > serverDate ? localCV : serverCV;
          });

          // Add remaining server CVs that aren't in local storage at all
          const remainingServerCVs = Array.from(serverCVMap.values());
          mergedCVs.push(...remainingServerCVs);
          
          // --- Sync History ---
          // Server returns createdAt, client uses date. Map it.
          const formattedHistoryRes = historyRes.map((h: any) => ({
             ...h,
             date: h.createdAt || h.date // Handle both cases for robustness
          }));

          const serverHistoryIds = new Set(formattedHistoryRes.map((h: any) => h.id));
          const unsavedLocalHistory = localHistory.filter(h => !serverHistoryIds.has(h.id));
          
          // Combine and sort
          const mergedHistory = [...formattedHistoryRes, ...unsavedLocalHistory].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ).slice(0, 50);

          set({ 
            cvList: mergedCVs, 
            history: mergedHistory as AnalysisHistoryItem[] 
          });

        } catch (error) {
          console.error('Failed to sync user data', error);
        }
      },

      fetchCV: async (id: string) => {
        try {
          // Check local first
          const localCV = get().cvList.find(c => c.id === id);
          // ONLY use local CV if it's a FULL cv (contains experiences array), otherwise we must fetch
          if (localCV && localCV.experiences) {
            set({ currentCV: localCV });
            return localCV;
          }

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
        const title = `CV Importé ${new Date().toLocaleDateString()}`;
        const sanitized = sanitizeCVData({
          ...data,
          title: data.title || title,
        });

        set((state) => ({
          cvList: [...state.cvList, sanitized],
          currentCV: sanitized,
          currentStep: 'personal',
        }));
        
        // Sync with server (fire and forget)
        CVService.create(sanitized).catch(err => {
          console.error('Failed to save imported CV on server', err);
          toast.error('Échec de sauvegarde du CV importé.');
        });
        
        return sanitized.id;
      },

      loadCV: async (id) => {
        let cv = get().cvList.find((c) => c.id === id);
        
        // If CV is not tracked locally OR it is a summary (missing experiences array)
        if (!cv || !cv.experiences) {
           try {
              const fullCV = await CVService.getById(id);
              if (fullCV) {
                // Update local storage with the full CV
                set(state => ({
                  cvList: [...state.cvList.filter(c => c.id !== id), fullCV]
                }));
                cv = fullCV;
              }
           } catch (error) {
              console.error('Failed to load full CV', error);
              toast.error('Erreur lors du chargement du CV.');
              return;
           }
        }

        if (cv) {
          // Migrate old CVs that don't have new fields
          const migratedCV: CV = {
             // ... spread the rest of cv
            ...cv,
            templateId: cv.templateId || 'modern',
            experiences: cv.experiences || [],
            education: cv.education || [],
            skills: cv.skills || [],
            languages: cv.languages || [],
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

      translateCV: async (id, targetLanguage) => {
        try {
           const res = await fetch(`/api/cv/${id}/translate`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ targetLanguage })
           });

           const data = await res.json();
           
           if (!res.ok) {
              toast.error(data.error || "Erreur de traduction");
              return null;
           }

           toast.success("CV traduit avec succès !");
           // Fetch the newly translated CV into the store
           await get().fetchCV(data.newCvId);
           return data.newCvId;

        } catch (error) {
           console.error("Translation ERROR", error);
           toast.error("Erreur de connexion");
           return null;
        }
      },

      updateCVTitle: (newTitle) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        title: newTitle,
      }))),
      updateTemplateId: (templateId) => set((state) => updateCV(state, (cv) => ({
        ...cv,
        templateId,
      }))),
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

      togglePublic: (cvId) => set((state) => {
        const updatedList = state.cvList.map((c) => 
          c.id === cvId ? { ...c, isPublic: !c.isPublic } : c
        );
        return {
          cvList: updatedList,
          currentCV: state.currentCV?.id === cvId 
            ? { ...state.currentCV, isPublic: !state.currentCV.isPublic } 
            : state.currentCV
        };
      }),
    }),
    {
      name: 'jobsira-cv-storage',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
