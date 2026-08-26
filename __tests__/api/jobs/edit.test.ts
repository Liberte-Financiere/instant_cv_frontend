import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from '@/app/api/recruiter/jobs/[id]/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { auth } from '@/auth';

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    jobOffer: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('PATCH /api/recruiter/jobs/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/recruiter/jobs/job-123', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  };

  it('devrait retourner 401 si non connecté', async () => {
    (auth as any).mockResolvedValue(null);

    const req = createRequest({ title: 'Nouveau Titre' });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'job-123' }) });
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.error).toBe('Non autorisé');
  });

  it('devrait retourner 403 si non recruteur', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-1' } });
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'CANDIDATE' });

    const req = createRequest({ title: 'Nouveau Titre' });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'job-123' }) });
    const json = await response.json();

    expect(response.status).toBe(403);
    expect(json.error).toBe('Accès réservé aux recruteurs');
  });

  it('devrait retourner 403 si tentative de modifier une offre appartenant à un autre', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'recruiter-A' } });
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'RECRUITER' });
    
    // L'offre appartient à un autre recruteur
    (prisma.jobOffer.findUnique as any).mockResolvedValue({ recruiterId: 'recruiter-B' });

    const req = createRequest({ title: 'Nouveau Titre' });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'job-123' }) });
    const json = await response.json();

    expect(response.status).toBe(403);
    expect(json.error).toBe('Non autorisé à modifier cette offre');
  });

  it('devrait retourner 400 si les données (Zod) sont invalides', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'recruiter-A' } });
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'RECRUITER' });
    (prisma.jobOffer.findUnique as any).mockResolvedValue({ recruiterId: 'recruiter-A' });

    // Envoi d'un titre vide (min 2 caractères requis)
    const req = createRequest({ title: '' });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'job-123' }) });
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('Données invalides');
  });

  it('devrait réussir (200) et appeler prisma.update avec des données valides', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'recruiter-A' } });
    (prisma.user.findUnique as any).mockResolvedValue({ role: 'RECRUITER' });
    (prisma.jobOffer.findUnique as any).mockResolvedValue({ recruiterId: 'recruiter-A' });

    // Mock du retour de l'update
    const updatedMock = { id: 'job-123', title: 'Senior Dev' };
    (prisma.jobOffer.update as any).mockResolvedValue(updatedMock);

    const validPayload = { 
      title: 'Senior Dev', 
      applyMethod: 'NATIVE', 
      maxApplications: 10 
    };

    const req = createRequest(validPayload);
    const response = await PATCH(req, { params: Promise.resolve({ id: 'job-123' }) });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.title).toBe('Senior Dev');
    
    // Vérifier que prisma.update a bien été appelé avec les bonnes données
    expect(prisma.jobOffer.update).toHaveBeenCalledWith({
      where: { id: 'job-123' },
      data: validPayload,
    });
  });
});
