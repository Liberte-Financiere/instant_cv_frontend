import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/recruiter/profiles/[id]/unlock/route';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { unlockProfile, InsufficientRecruiterCreditsError } from '@/lib/recruiter-credits';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    candidateProfile: {
      findUnique: vi.fn(),
    },
    creditTransaction: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/recruiter-credits', () => ({
  unlockProfile: vi.fn(),
  InsufficientRecruiterCreditsError: class InsufficientRecruiterCreditsError extends Error {
    cost: number;
    balance: number;
    constructor(cost: number, balance: number) {
      super(`Crédits recruteur insuffisants: requis ${cost}, disponible ${balance}`);
      this.name = 'InsufficientRecruiterCreditsError';
      this.cost = cost;
      this.balance = balance;
    }
  },
}));

describe('Recruiter Unlock Profile API (/api/recruiter/profiles/[id]/unlock)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const params = Promise.resolve({ id: 'cand-profile-1' });

  it('devrait refuser les requêtes non authentifiées (401)', async () => {
    (auth as any).mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/recruiter/profiles/cand-profile-1/unlock', {
      method: 'POST',
    });
    const res = await POST(req, { params });

    expect(res.status).toBe(401);
  });

  it('devrait refuser un recruteur dont le statut en base n\'est pas APPROVED (403)', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'rec-unapproved', role: 'USER' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      role: 'USER',
      recruiterStatus: 'PENDING',
    });

    const req = new Request('http://localhost:3000/api/recruiter/profiles/cand-profile-1/unlock', {
      method: 'POST',
    });
    const res = await POST(req, { params });
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toContain('Accès réservé aux recruteurs validés');
  });

  it('devrait autoriser le déblocage pour un recruteur validé (status APPROVED)', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'rec-approved', role: 'RECRUITER', recruiterStatus: 'APPROVED' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      role: 'RECRUITER',
      recruiterStatus: 'APPROVED',
    });

    (unlockProfile as any).mockResolvedValue({
      status: 'unlocked',
      wasFree: true,
      freeRemaining: 2,
      creditsCost: 0,
      remainingCredits: 0,
    });

    (prisma.candidateProfile.findUnique as any).mockResolvedValue({
      anonymousName: 'O.K.',
      title: 'Comptable Senior',
      cv: {
        content: {
          personalInfo: {
            firstName: 'Oumar',
            lastName: 'Kaboré',
            email: 'oumar.kabore@example.com',
            phone: '+226 70 00 00 01',
          },
        },
      },
    });

    const req = new Request('http://localhost:3000/api/recruiter/profiles/cand-profile-1/unlock', {
      method: 'POST',
    });
    const res = await POST(req, { params });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe('unlocked');
    expect(json.contactInfo.email).toBe('oumar.kabore@example.com');
    expect(json.refunded).toBe(false);
  });

  it('devrait renvoyer une erreur 402 si les crédits sont insuffisants', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'rec-nocredits', role: 'RECRUITER', recruiterStatus: 'APPROVED' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      role: 'RECRUITER',
      recruiterStatus: 'APPROVED',
    });

    (unlockProfile as any).mockRejectedValue(
      new InsufficientRecruiterCreditsError(1, 0)
    );

    const req = new Request('http://localhost:3000/api/recruiter/profiles/cand-profile-1/unlock', {
      method: 'POST',
    });
    const res = await POST(req, { params });
    const json = await res.json();

    expect(res.status).toBe(402);
    expect(json.error).toContain('Crédits recruteur insuffisants');
  });

  it('devrait autoriser un administrateur même sans profil recruteur', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      role: 'ADMIN',
      recruiterStatus: 'NONE',
    });

    (unlockProfile as any).mockResolvedValue({
      status: 'unlocked',
      wasFree: true,
      freeRemaining: 0,
      creditsCost: 0,
      remainingCredits: 999,
    });

    (prisma.candidateProfile.findUnique as any).mockResolvedValue({
      anonymousName: 'Admin View',
      title: 'Dev',
      cv: {
        content: {
          personalInfo: {
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean@example.com',
            phone: '+226 71 00 00 00',
          },
        },
      },
    });

    const req = new Request('http://localhost:3000/api/recruiter/profiles/cand-profile-1/unlock', {
      method: 'POST',
    });
    const res = await POST(req, { params });

    expect(res.status).toBe(200);
  });
});
