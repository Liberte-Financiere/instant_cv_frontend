import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCVStore } from '@/store/useCVStore';
import { CVService } from '@/services/cvService';
import { toast } from 'sonner';
import { CV } from '@/types/cv';

vi.mock('@/services/cvService', () => ({
  CVService: {
    getAllSummaries: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock fetch for history
global.fetch = vi.fn() as any;

describe('useCVStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCVStore.setState({
      currentCV: null,
      cvList: [],
      history: [],
      currentStep: 'personal',
    });
  });

  describe('fetchUserCVs', () => {
    it('should fetch and merge CVs properly', async () => {
      const mockSummaries = [
        { id: '1', title: 'Server CV', updatedAt: new Date('2025-01-01') },
      ];
      
      (CVService.getAllSummaries as any).mockResolvedValue(mockSummaries);
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      // Add a local CV
      useCVStore.setState({
        cvList: [
          { id: '2', title: 'Local Only', updatedAt: new Date('2025-01-02') } as any
        ]
      });

      await useCVStore.getState().fetchUserCVs();

      const cvList = useCVStore.getState().cvList;
      expect(cvList).toHaveLength(2);
      expect(cvList.find(c => c.id === '1')).toBeDefined();
      expect(cvList.find(c => c.id === '2')).toBeDefined();
    });
  });

  describe('loadCV', () => {
    it('should load full CV from backend if local copy lacks experiences array', async () => {
      // Local CV is just a summary
      useCVStore.setState({
        cvList: [{ id: '1', title: 'Summary Only' } as any]
      });

      const fullCV = { id: '1', title: 'Full CV', experiences: [{ id: 'exp1' }] };
      (CVService.getById as any).mockResolvedValue(fullCV);

      await useCVStore.getState().loadCV('1');

      expect(CVService.getById).toHaveBeenCalledWith('1');
      expect(useCVStore.getState().currentCV?.title).toBe('Full CV');
      expect(useCVStore.getState().currentCV?.experiences).toHaveLength(1);
    });

    it('should NOT call getById if local CV is already full', async () => {
      useCVStore.setState({
        cvList: [{ id: '1', title: 'Full Local', experiences: [] } as any]
      });

      await useCVStore.getState().loadCV('1');

      expect(CVService.getById).not.toHaveBeenCalled();
      expect(useCVStore.getState().currentCV?.title).toBe('Full Local');
    });

    it('should show toast error if getById fails', async () => {
      useCVStore.setState({ cvList: [] });
      (CVService.getById as any).mockRejectedValue(new Error('Network error'));

      await useCVStore.getState().loadCV('1');

      expect(toast.error).toHaveBeenCalledWith('Erreur lors du chargement du CV.');
      expect(useCVStore.getState().currentCV).toBeNull();
    });
  });

  describe('saveCurrentCV', () => {
    it('should call CVService.update with current CV', async () => {
      const mockCV = { id: '1', title: 'Test' } as any;
      useCVStore.setState({ currentCV: mockCV });

      await useCVStore.getState().saveCurrentCV();

      expect(CVService.update).toHaveBeenCalledWith('1', mockCV);
    });

    it('should catch error and show toast if update fails (e.g. 403 Forbidden during impersonation)', async () => {
      const mockCV = { id: '1', title: 'Test' } as any;
      useCVStore.setState({ currentCV: mockCV });

      (CVService.update as any).mockRejectedValue(new Error('Forbidden'));

      await useCVStore.getState().saveCurrentCV();

      expect(toast.error).toHaveBeenCalledWith('Échec de la sauvegarde. Vérifiez votre connexion.');
    });
  });
});
