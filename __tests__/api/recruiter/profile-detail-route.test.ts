import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/recruiter/profiles/[id]/route';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    candidateProfile: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Recruiter Profile Detail API (/api/recruiter/profiles/[id])', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCandidate = {
    id: 'cand-1',
    userId: 'user-cand',
    anonymousName: 'A.S.',
    title: 'Développeur Fullstack',
    sector: 'Informatique',
    skills: ['React', 'TypeScript', 'Node.js'],
    experienceYears: 4,
    locationCity: 'Ouagadougou',
    locationCountry: 'Burkina Faso',
    completionScore: 85,
    lastCvUpdate: new Date('2026-03-01'),
    isActive: true,
    anonymousData: {
      anonymousName: 'A.S.',
      title: 'Développeur Fullstack',
      sector: 'Informatique',
      skills: ['React', 'TypeScript', 'Node.js'],
      experienceYears: 4,
      locationCity: 'Ouagadougou',
      locationCountry: 'Burkina Faso',
      completionScore: 85,
      experiences: [],
      education: [],
      languages: [],
      certifications: [],
      projects: [],
    },
    cv: {
      content: {
        personalInfo: {
          firstName: 'Amadou',
          lastName: 'Sawadogo',
          email: 'amadou@example.com',
          phone: '+226 70 00 00 00',
          address: 'Ouagadougou, Secteur 15',
        },
      },
    },
  };

  it('devrait retourner 404 si le profil n\'existe pas', async () => {
    (auth as any).mockResolvedValue(null);
    (prisma.candidateProfile.findUnique as any).mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/recruiter/profiles/cand-not-found');
    const res = await GET(req, { params: Promise.resolve({ id: 'cand-not-found' }) });

    expect(res.status).toBe(404);
  });

  it('devrait retourner 404 si le profil est inactif', async () => {
    (auth as any).mockResolvedValue(null);
    (prisma.candidateProfile.findUnique as any).mockResolvedValue({
      ...mockCandidate,
      isActive: false,
    });

    const req = new Request('http://localhost:3000/api/recruiter/profiles/cand-1');
    const res = await GET(req, { params: Promise.resolve({ id: 'cand-1' }) });

    expect(res.status).toBe(404);
  });

  it('devrait retourner le profil anonymisé avec isUnlocked: false et contactInfo: null si visiteur anonyme', async () => {
    (auth as any).mockResolvedValue(null);
    (prisma.candidateProfile.findUnique as any).mockResolvedValue(mockCandidate);

    const req = new Request('http://localhost:3000/api/recruiter/profiles/cand-1');
    const res = await GET(req, { params: Promise.resolve({ id: 'cand-1' }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe('cand-1');
    expect(json.anonymousName).toBe('A.S.');
    expect(json.isUnlocked).toBe(false);
    expect(json.contactInfo).toBeNull();
  });

  it('devrait retourner isUnlocked: false si recruteur connecté mais profil non débloqué', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'recruiter-1', role: 'RECRUITER' },
    });
    (prisma.candidateProfile.findUnique as any).mockResolvedValue({
      ...mockCandidate,
      unlocks: [],
    });

    const req = new Request('http://localhost:3000/api/recruiter/profiles/cand-1');
    const res = await GET(req, { params: Promise.resolve({ id: 'cand-1' }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.isUnlocked).toBe(false);
    expect(json.contactInfo).toBeNull();
  });

  it('devrait retourner isUnlocked: true et contactInfo si le recruteur a déjà débloqué le profil', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'recruiter-1', role: 'RECRUITER' },
    });
    (prisma.candidateProfile.findUnique as any).mockResolvedValue({
      ...mockCandidate,
      unlocks: [{ id: 'unlock-1' }],
    });

    const req = new Request('http://localhost:3000/api/recruiter/profiles/cand-1');
    const res = await GET(req, { params: Promise.resolve({ id: 'cand-1' }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.isUnlocked).toBe(true);
    expect(json.contactInfo).toEqual({
      firstName: 'Amadou',
      lastName: 'Sawadogo',
      email: 'amadou@example.com',
      phone: '+226 70 00 00 00',
      address: 'Ouagadougou, Secteur 15',
    });
  });

  it('devrait retourner isUnlocked: true et contactInfo si l\'utilisateur est ADMIN', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN' },
    });
    (prisma.candidateProfile.findUnique as any).mockResolvedValue({
      ...mockCandidate,
      unlocks: [],
    });

    const req = new Request('http://localhost:3000/api/recruiter/profiles/cand-1');
    const res = await GET(req, { params: Promise.resolve({ id: 'cand-1' }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.isUnlocked).toBe(true);
    expect(json.contactInfo.email).toBe('amadou@example.com');
  });

  it('devrait retourner isUnlocked: true et contactInfo si l\'utilisateur est le propriétaire du profil', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'user-cand', role: 'CANDIDATE' },
    });
    (prisma.candidateProfile.findUnique as any).mockResolvedValue({
      ...mockCandidate,
      unlocks: [],
    });

    const req = new Request('http://localhost:3000/api/recruiter/profiles/cand-1');
    const res = await GET(req, { params: Promise.resolve({ id: 'cand-1' }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.isUnlocked).toBe(true);
    expect(json.contactInfo.firstName).toBe('Amadou');
  });
});
