import { create } from 'zustand';

interface CreditStore {
  credits: number;
  isLoading: boolean;
  isOutOfCreditsModalOpen: boolean;
  fetchCredits: () => Promise<void>;
  deductCredits: (amount: number) => void;
  setOutOfCreditsModalOpen: (open: boolean) => void;
}

export const useCreditStore = create<CreditStore>((set, get) => ({
  credits: 0,
  isLoading: true,
  isOutOfCreditsModalOpen: false,
  fetchCredits: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/user/credits');
      if (response.ok) {
        const data = await response.json();
        set({ credits: data.credits, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
      set({ isLoading: false });
    }
  },
  deductCredits: (amount: number) => {
    const current = get().credits;
    set({ credits: Math.max(0, current - amount) });
  },
  setOutOfCreditsModalOpen: (open: boolean) => {
    set({ isOutOfCreditsModalOpen: open });
  }
}));
