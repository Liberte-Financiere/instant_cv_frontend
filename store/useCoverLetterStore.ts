import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/storage';
import { CoverLetterService } from '@/services/coverLetterService';
import { toast } from 'sonner';
import { CoverLetter, CoverLetterStep, CoverLetterContent } from '@/types/cover-letter';
import { generateId } from '@/lib/utils';

interface CoverLetterState {
  currentCL: CoverLetter | null;
  clList: CoverLetter[];
  currentStep: CoverLetterStep;

  // Actions
  fetchUserCLs: () => Promise<void>;
  loadCL: (id: string) => Promise<void>;
  saveCurrentCL: () => Promise<void>;
  setCurrentStep: (step: CoverLetterStep) => void;
  createNewCL: (title: string) => string;
  updateContent: (content: Partial<CoverLetterContent>) => void;
  deleteCL: (id: string) => Promise<void>;
}

const createEmptyCL = (title: string): CoverLetter => ({
  id: generateId(),
  title,
  content: {
    sender: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      title: '',
      summary: '',
    },
    recipient: {
      name: '',
      company: '',
      address: '',
    },
    details: {
      date: new Date().toLocaleDateString(),
      location: '',
      subject: '',
      salutation: 'Madame, Monsieur,',
      body: '',
      closing: 'Cordialement,',
    }
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: '', // Set by backend
});

export const useCoverLetterStore = create<CoverLetterState>()(
  persist(
    (set, get) => ({
      currentCL: null,
      clList: [],
      currentStep: 'info',

      fetchUserCLs: async () => {
        try {
          const cls = await CoverLetterService.getAll();
          set({ clList: cls });
        } catch (error) {
          console.error('Failed to fetch cover letters', error);
        }
      },

      loadCL: async (id: string) => {
        const cl = get().clList.find(c => c.id === id);
        if (cl) {
          set({ currentCL: cl, currentStep: 'info' });
        } else {
          try {
            const serverCL = await CoverLetterService.getById(id);
            set(state => ({
                // Ensure no duplicates
                clList: [...state.clList.filter(c => c.id !== serverCL.id), serverCL],
                currentCL: serverCL,
                currentStep: 'info'
            }));
          } catch (error) {
            console.error('Failed to load CL', error);
          }
        }
      },

      saveCurrentCL: async () => {
        const { currentCL } = get();
        if (!currentCL) return;
        try {
          await CoverLetterService.update(currentCL.id, currentCL);
          toast.success('Lettre sauvegardée !');
          // Update list
          set(state => ({
            clList: state.clList.map(c => c.id === currentCL.id ? currentCL : c)
          }));
        } catch (error) {
          console.error('Failed to save CL', error);
          toast.error('Erreur lors de la sauvegarde');
        }
      },

      setCurrentStep: (step) => set({ currentStep: step }),

      createNewCL: (title) => {
        const newCL = createEmptyCL(title);
        set(state => ({
          clList: [...state.clList, newCL],
          currentCL: newCL,
          currentStep: 'info'
        }));

        CoverLetterService.create(newCL).catch(err => {
          console.error('Failed to sync new CL', err);
        });

        return newCL.id;
      },

      updateContent: (content) => set(state => {
        if (!state.currentCL) return state;
        const updatedCL = {
          ...state.currentCL,
          content: { ...state.currentCL.content, ...content },
          updatedAt: new Date()
        };
        return {
          currentCL: updatedCL,
          clList: state.clList.map(c => c.id === updatedCL.id ? updatedCL : c)
        };
      }),

      deleteCL: async (id) => {
        set(state => ({
          clList: state.clList.filter(c => c.id !== id),
          currentCL: state.currentCL?.id === id ? null : state.currentCL
        }));
        try {
          await CoverLetterService.delete(id);
        } catch (error) {
          console.error('Failed to delete CL', error);
        }
      }
    }),
    {
      name: 'optijob-cl-storage',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
