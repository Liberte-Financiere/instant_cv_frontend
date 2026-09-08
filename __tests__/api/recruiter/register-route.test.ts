import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/recruiter/register/route';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Recruiter Registration API (/api/recruiter/register)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPayload = {
    companyName: 'FASO TECH SOLUTIONS',
    companySector: 'Informatique & Télécoms',
    companyPhone: '+226 25 30 00 00',
    companyCity: 'Ouagadougou',
    companyCountry: 'Burkina Faso',
    companyWebsite: 'https://fasotech.example.com',
    companyTaxId: 'BF-OUA-01-2023-B12-00000',
    companySize: '11-50',
  };

  it('devrait refuser les requêtes non authentifiées (401)', async () => {
    (auth as any).mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/recruiter/register', {
      method: 'POST',
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('devrait interdire aux administrateurs de devenir recruteur (403)', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN' },
    });

    const req = new Request('http://localhost:3000/api/recruiter/register', {
      method: 'POST',
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toContain('administrateur');
  });

  it('devrait refuser si le recruteur est déjà validé (409)', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'rec-1', role: 'RECRUITER' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      role: 'RECRUITER',
      recruiterStatus: 'APPROVED',
    });

    const req = new Request('http://localhost:3000/api/recruiter/register', {
      method: 'POST',
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.error).toContain('déjà inscrit et validé');
  });

  it('devrait refuser si un dossier est déjà en attente (409)', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'user-pending', role: 'USER' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      role: 'USER',
      recruiterStatus: 'PENDING',
    });

    const req = new Request('http://localhost:3000/api/recruiter/register', {
      method: 'POST',
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.error).toContain('déjà en cours de vérification');
  });

  it('devrait valider les champs obligatoires avec Zod (400 si téléphone manquant)', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      role: 'USER',
      recruiterStatus: 'NONE',
    });

    const invalidPayload = { ...validPayload, companyPhone: '' };

    const req = new Request('http://localhost:3000/api/recruiter/register', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('téléphone');
  });

  it('devrait enregistrer le dossier avec le statut PENDING sans octroyer le rôle RECRUITER', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'user-new', role: 'USER' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      role: 'USER',
      recruiterStatus: 'NONE',
    });
    (prisma.user.update as any).mockResolvedValue({
      id: 'user-new',
      companyName: 'FASO TECH SOLUTIONS',
      recruiterStatus: 'PENDING',
    });

    const req = new Request('http://localhost:3000/api/recruiter/register', {
      method: 'POST',
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe('PENDING');
    expect(json.message).toContain('soumis avec succès');

    // Vérifier que prisma.user.update a bien reçu recruiterStatus: 'PENDING'
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-new' },
        data: expect.objectContaining({
          companyName: 'FASO TECH SOLUTIONS',
          companySector: 'Informatique & Télécoms',
          companyPhone: '+226 25 30 00 00',
          companyCity: 'Ouagadougou',
          companyCountry: 'Burkina Faso',
          recruiterStatus: 'PENDING',
        }),
      })
    );
  });
});
