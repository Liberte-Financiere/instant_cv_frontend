import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/recruiter/analytics/route';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    jobOffer: {
      aggregate: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
    jobApplication: {
      count: vi.fn(),
    },
  },
}));

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Recruiter Analytics API (/api/recruiter/analytics)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait renvoyer 401 si non authentifié', async () => {
    (auth as any).mockResolvedValue(null);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Non autorisé');
  });

  it('devrait renvoyer 403 si l\'utilisateur n\'est pas recruteur ni admin', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'user-1', role: 'CANDIDATE' },
    });

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe('Accès refusé');
  });

  it('devrait renvoyer les statistiques agrégées correctement pour un recruteur', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'recruiter-1', role: 'RECRUITER' },
    });

    (prisma.jobOffer.aggregate as any).mockResolvedValue({
      _count: { id: 8 },
      _sum: { viewsCount: 1500, clicksCount: 300 },
    });

    (prisma.jobOffer.count as any).mockResolvedValue(5);
    (prisma.jobApplication.count as any).mockResolvedValue(42);

    const mockTopJobs = [
      { id: 'job-1', title: 'Tech Lead React', viewsCount: 800, clicksCount: 160, status: 'ACTIVE' },
      { id: 'job-2', title: 'Dev Fullstack', viewsCount: 400, clicksCount: 90, status: 'ACTIVE' },
    ];
    (prisma.jobOffer.findMany as any).mockResolvedValue(mockTopJobs);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.totalJobs).toBe(8);
    expect(json.activeJobs).toBe(5);
    expect(json.totalViews).toBe(1500);
    expect(json.totalClicks).toBe(300);
    expect(json.totalApplications).toBe(42);
    expect(json.conversionRate).toBe(20); // 300 / 1500 * 100
    expect(json.topJobs).toEqual(mockTopJobs);

    expect(prisma.jobOffer.aggregate).toHaveBeenCalledWith({
      where: { recruiterId: 'recruiter-1' },
      _count: { id: true },
      _sum: { viewsCount: true, clicksCount: true },
    });
    expect(prisma.jobOffer.count).toHaveBeenCalledWith({
      where: { recruiterId: 'recruiter-1', status: 'ACTIVE' },
    });
    expect(prisma.jobApplication.count).toHaveBeenCalledWith({
      where: { jobOffer: { recruiterId: 'recruiter-1' } },
    });
    expect(prisma.jobOffer.findMany).toHaveBeenCalledWith({
      where: { recruiterId: 'recruiter-1' },
      orderBy: [{ viewsCount: 'desc' }, { id: 'desc' }],
      take: 5,
      select: {
        id: true,
        title: true,
        viewsCount: true,
        clicksCount: true,
        status: true,
      },
    });
  });

  it('devrait gérer le cas où le recruteur n\'a aucune offre sans diviser par zéro', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'recruiter-empty', role: 'RECRUITER' },
    });

    (prisma.jobOffer.aggregate as any).mockResolvedValue({
      _count: { id: 0 },
      _sum: { viewsCount: null, clicksCount: null },
    });

    (prisma.jobOffer.count as any).mockResolvedValue(0);
    (prisma.jobApplication.count as any).mockResolvedValue(0);
    (prisma.jobOffer.findMany as any).mockResolvedValue([]);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.totalJobs).toBe(0);
    expect(json.activeJobs).toBe(0);
    expect(json.totalViews).toBe(0);
    expect(json.totalClicks).toBe(0);
    expect(json.totalApplications).toBe(0);
    expect(json.conversionRate).toBe(0);
    expect(json.topJobs).toEqual([]);
  });
});
