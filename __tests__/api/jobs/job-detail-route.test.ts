import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/jobs/[id]/route';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    jobOffer: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock global fetch for Go microservice
global.fetch = vi.fn();

describe('Job Detail API (/api/jobs/[id])', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('devrait retourner une offre native et incrémenter les vues', async () => {
      const mockNativeJob = {
        id: 'cuid-123',
        title: 'Développeur React',
        status: 'ACTIVE'
      };
      
      (prisma.jobOffer.findFirst as any).mockResolvedValue(mockNativeJob);
      (prisma.jobOffer.update as any).mockResolvedValue(mockNativeJob); // Mock increment

      const req = new Request('http://localhost:3000/api/jobs/cuid-123');
      const response = await GET(req, { params: Promise.resolve({ id: 'cuid-123' }) });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.id).toBe('cuid-123');
      expect(json.source).toBe('NATIVE');
      
      // Vérifier que prisma.update a été appelé pour incrémenter les vues
      expect(prisma.jobOffer.update).toHaveBeenCalledWith({
        where: { id: 'cuid-123' },
        data: { viewsCount: { increment: 1 } }
      });
    });

    it('devrait retourner une offre scrappée via le microservice Go', async () => {
      const mockGoJob = {
        data: {
          id: '555',
          title: 'Ingénieur Go',
          source_url: 'https://example.com/apply'
        }
      };
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockGoJob,
      });

      const req = new Request('http://localhost:3000/api/jobs/ext-555');
      const response = await GET(req, { params: Promise.resolve({ id: 'ext-555' }) });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.id).toBe('ext-555'); // Prefix ext- should be maintained
      expect(json.source).toBe('SCRAPED');
      
      // Fetch should have been called twice (1 for get, 1 for view tracking)
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(1, 'http://127.0.0.1:8080/api/v1/opportunities/555', expect.any(Object));
      expect(global.fetch).toHaveBeenNthCalledWith(2, 'http://127.0.0.1:8080/api/v1/opportunities/555/view', { method: 'POST' });
    });
  });

  describe('POST (Click Tracking)', () => {
    it('devrait incrémenter les vues (clicks n\'existant pas) pour une offre native', async () => {
      (prisma.jobOffer.update as any).mockResolvedValue({});

      const req = new Request('http://localhost:3000/api/jobs/cuid-123', { method: 'POST' });
      const response = await POST(req, { params: Promise.resolve({ id: 'cuid-123' }) });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      
      expect(prisma.jobOffer.update).toHaveBeenCalledWith({
        where: { id: 'cuid-123' },
        data: { viewsCount: { increment: 1 } }
      });
    });

    it('devrait appeler l\'API Go pour traquer les clics d\'une offre scrappée', async () => {
      (global.fetch as any).mockResolvedValue({ ok: true });

      const req = new Request('http://localhost:3000/api/jobs/ext-555', { method: 'POST' });
      const response = await POST(req, { params: Promise.resolve({ id: 'ext-555' }) });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      
      expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8080/api/v1/opportunities/555/click', { method: 'POST' });
      // Prisma shouldn't be touched for scraped jobs
      expect(prisma.jobOffer.update).not.toHaveBeenCalled();
    });
  });
});
