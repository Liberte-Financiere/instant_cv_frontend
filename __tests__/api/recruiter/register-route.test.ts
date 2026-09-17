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

vi.mock('@/lib/cloudinary', () => ({
  uploadBufferToCloudinary: vi.fn().mockResolvedValue({
    secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v123/rccm-doc.pdf',
    public_id: 'jobsira-company-documents/rccm-doc',
  }),
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

  it('devrait refuser un site web sans protocole http:// ou https://', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      role: 'USER',
      recruiterStatus: 'NONE',
    });

    const invalidPayload = { ...validPayload, companyWebsite: 'www.sans-protocole.com' };

    const req = new Request('http://localhost:3000/api/recruiter/register', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('http:// ou https://');
  });

  it('devrait refuser une description dépassant 500 caractères', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      role: 'USER',
      recruiterStatus: 'NONE',
    });

    const invalidPayload = { ...validPayload, companyDescription: 'A'.repeat(501) };

    const req = new Request('http://localhost:3000/api/recruiter/register', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('500 caractères');
  });

  it('devrait traiter une soumission multipart/form-data avec téléversement de document', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'user-multipart', role: 'USER' },
    });
    (prisma.user.findUnique as any).mockResolvedValue({
      role: 'USER',
      recruiterStatus: 'NONE',
      companyDocumentUrl: null,
    });
    (prisma.user.update as any).mockResolvedValue({
      id: 'user-multipart',
      companyName: 'FASO TECH SOLUTIONS',
      recruiterStatus: 'PENDING',
      companyDocumentUrl: 'https://res.cloudinary.com/test-cloud/image/upload/v123/rccm-doc.pdf',
    });

    const formData = new FormData();
    formData.append('companyName', validPayload.companyName);
    formData.append('companySector', validPayload.companySector);
    formData.append('companyPhone', validPayload.companyPhone);
    formData.append('companyCity', validPayload.companyCity);
    formData.append('companyCountry', validPayload.companyCountry);
    formData.append('companyWebsite', validPayload.companyWebsite);
    formData.append('companyDescription', 'Entreprise leader dans la tech ouest-africaine.');
    const mockFile = new File(['%PDF-1.4 mock content'], 'rccm.pdf', { type: 'application/pdf' });
    formData.append('companyDocument', mockFile);

    const req = new Request('http://localhost:3000/api/recruiter/register', {
      method: 'POST',
      body: formData,
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe('PENDING');
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-multipart' },
        data: expect.objectContaining({
          companyName: 'FASO TECH SOLUTIONS',
          companyDescription: 'Entreprise leader dans la tech ouest-africaine.',
          companyDocumentUrl: 'https://res.cloudinary.com/test-cloud/image/upload/v123/rccm-doc.pdf',
          recruiterStatus: 'PENDING',
        }),
      })
    );
  });
});
