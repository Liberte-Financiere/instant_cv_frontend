import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/jobs/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    jobOffer: {
      findMany: vi.fn(),
    },
  },
}));

// Mock global fetch for Go microservice
global.fetch = vi.fn();

describe('GET /api/jobs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait fusionner les offres natives et scrappées avec succès', async () => {
    // 1. Mock Prisma response (Native Jobs)
    const mockNativeJobs = [
      {
        id: 'native-1',
        title: 'Développeur React',
        company: 'TechCorp',
        location: 'Paris',
        type: 'JOB_LOCAL',
        salary: '45k',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10000),
      }
    ];
    (prisma.jobOffer.findMany as any).mockResolvedValue(mockNativeJobs);

    // 2. Mock Go Microservice response (Scraped Jobs)
    const mockGoData = {
      data: [
        {
          id: '123',
          title: 'Ingénieur DevOps',
          organization: 'CloudInc',
          city: 'Lyon',
          country: 'France',
          opportunity_type: 'JOB_LOCAL',
          published_at: new Date().toISOString(),
          deadline: new Date(Date.now() + 10000).toISOString(),
          work_mode: 'REMOTE'
        }
      ]
    };
    
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockGoData,
    });

    // Run the handler
    const req = new NextRequest('http://localhost:3000/api/jobs?page=1&limit=10');
    const response = await GET(req);
    const json = await response.json();

    // Verification
    expect(response.status).toBe(200);
    
    // Total jobs should be 2 (1 native + 1 scraped)
    expect(json.data.length).toBe(2);
    
    // Validate Native Job mapping
    expect(json.data[0].id).toBe('native-1');
    expect(json.data[0].source).toBe('NATIVE');
    
    // Validate Scraped Job mapping
    expect(json.data[1].id).toBe('ext-123');
    expect(json.data[1].source).toBe('SCRAPED');
    expect(json.data[1].company).toBe('CloudInc');
    expect(json.data[1].location).toBe('Lyon, France');
  });

  it('devrait ignorer les offres scrappées si le microservice Go échoue', async () => {
    const mockNativeJobs = [
      {
        id: 'native-1',
        title: 'Développeur React',
        source: 'NATIVE'
      }
    ];
    (prisma.jobOffer.findMany as any).mockResolvedValue(mockNativeJobs);
    
    // Mock fetch to simulate API failure
    (global.fetch as any).mockRejectedValue(new Error('Go API Down'));

    const req = new NextRequest('http://localhost:3000/api/jobs');
    const response = await GET(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data.length).toBe(1); // Only native jobs should be present
    expect(json.data[0].id).toBe('native-1');
  });
});
