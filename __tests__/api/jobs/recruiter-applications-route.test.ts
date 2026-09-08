import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/recruiter/jobs/[id]/applications/route';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    jobOffer: {
      findUnique: vi.fn(),
    },
    jobApplication: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// Mock Auth.js
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Recruiter Job Applications API (/api/recruiter/jobs/[id]/applications)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait retourner 401 si l\'utilisateur n\'est pas authentifié', async () => {
    (auth as any).mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/recruiter/jobs/job-1/applications');
    const res = await GET(req, { params: Promise.resolve({ id: 'job-1' }) });
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Non autorisé');
  });

  it('devrait retourner 403 si l\'utilisateur n\'a pas le rôle RECRUITER ou ADMIN', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-standard' } });
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'USER' });

    const req = new Request('http://localhost:3000/api/recruiter/jobs/job-1/applications');
    const res = await GET(req, { params: Promise.resolve({ id: 'job-1' }) });
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe('Accès réservé aux recruteurs');
  });

  it('devrait retourner 404 si l\'offre d\'emploi est introuvable', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'recruiter-1' } });
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'RECRUITER' });
    (prisma.jobOffer.findUnique as any).mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/recruiter/jobs/job-missing/applications');
    const res = await GET(req, { params: Promise.resolve({ id: 'job-missing' }) });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Offre non trouvée');
  });

  it('devrait bloquer l\'accès (403 IDOR) si l\'offre appartient à un autre recruteur', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'recruiter-attacker' } });
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'RECRUITER' });
    (prisma.jobOffer.findUnique as any).mockResolvedValue({ recruiterId: 'recruiter-victim' });

    const req = new Request('http://localhost:3000/api/recruiter/jobs/job-victim/applications');
    const res = await GET(req, { params: Promise.resolve({ id: 'job-victim' }) });
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe('Action non autorisée');
    expect(prisma.jobApplication.findMany).not.toHaveBeenCalled();
  });

  it('devrait permettre à un ADMIN d\'accéder aux candidatures de n\'importe quel recruteur', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'admin-1' } });
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'ADMIN' });
    (prisma.jobOffer.findUnique as any).mockResolvedValue({ recruiterId: 'recruiter-any' });
    (prisma.jobApplication.findMany as any).mockResolvedValue([]);
    (prisma.jobApplication.count as any).mockResolvedValue(0);

    const req = new Request('http://localhost:3000/api/recruiter/jobs/job-any/applications');
    const res = await GET(req, { params: Promise.resolve({ id: 'job-any' }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.applications).toEqual([]);
    expect(json.pagination.total).toBe(0);
  });

  it('devrait paginer par défaut (page 1, limit 20) avec ordre déterministe', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'recruiter-owner' } });
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'RECRUITER' });
    (prisma.jobOffer.findUnique as any).mockResolvedValue({ recruiterId: 'recruiter-owner' });

    const mockApplications = [
      { id: 'app-1', firstName: 'Jean', lastName: 'Kaboré', email: 'jean@example.com' },
      { id: 'app-2', firstName: 'Awa', lastName: 'Ouédraogo', email: 'awa@example.com' },
    ];
    (prisma.jobApplication.findMany as any).mockResolvedValue(mockApplications);
    (prisma.jobApplication.count as any).mockResolvedValue(45);

    const req = new Request('http://localhost:3000/api/recruiter/jobs/job-1/applications?page=2&limit=20');
    const res = await GET(req, { params: Promise.resolve({ id: 'job-1' }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.applications).toEqual(mockApplications);
    expect(json.pagination).toEqual({
      page: 2,
      limit: 20,
      total: 45,
      totalPages: 3,
    });

    expect(prisma.jobApplication.findMany).toHaveBeenCalledWith({
      where: { jobOfferId: 'job-1' },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: 20,
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            image: true,
          },
        },
      },
    });
  });

  it('devrait borner limit à 100 maximum pour protéger la mémoire du serveur', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'recruiter-owner' } });
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'RECRUITER' });
    (prisma.jobOffer.findUnique as any).mockResolvedValue({ recruiterId: 'recruiter-owner' });
    (prisma.jobApplication.findMany as any).mockResolvedValue([]);
    (prisma.jobApplication.count as any).mockResolvedValue(0);

    const req = new Request('http://localhost:3000/api/recruiter/jobs/job-1/applications?limit=5000');
    const res = await GET(req, { params: Promise.resolve({ id: 'job-1' }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.pagination.limit).toBe(100);
    expect(prisma.jobApplication.findMany).toHaveBeenCalledWith(expect.objectContaining({
      take: 100,
    }));
  });

  it('devrait transmettre les filtres de statut et de recherche textuelle à PostgreSQL', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'recruiter-owner' } });
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'RECRUITER' });
    (prisma.jobOffer.findUnique as any).mockResolvedValue({ recruiterId: 'recruiter-owner' });
    (prisma.jobApplication.findMany as any).mockResolvedValue([]);
    (prisma.jobApplication.count as any).mockResolvedValue(0);

    const req = new Request('http://localhost:3000/api/recruiter/jobs/job-1/applications?status=NEW&q=Kaboré&exp=SENIOR');
    const res = await GET(req, { params: Promise.resolve({ id: 'job-1' }) });

    expect(res.status).toBe(200);
    expect(prisma.jobApplication.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        jobOfferId: 'job-1',
        status: 'NEW',
        experienceYears: { gt: 5 },
        OR: [
          { firstName: { contains: 'Kaboré', mode: 'insensitive' } },
          { lastName: { contains: 'Kaboré', mode: 'insensitive' } },
          { email: { contains: 'Kaboré', mode: 'insensitive' } },
        ],
      },
    }));
  });
});
