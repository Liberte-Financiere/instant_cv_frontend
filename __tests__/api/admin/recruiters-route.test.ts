import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH } from '@/app/api/admin/recruiters/route';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { sendEmailViaService } from '@/lib/email-client';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/email-templates', () => ({
  generateAnnouncementEmail: vi.fn().mockReturnValue('<html>mock email</html>'),
}));

vi.mock('@/lib/email-client', () => ({
  sendEmailViaService: vi.fn().mockResolvedValue({ success: true }),
}));

describe('Admin Recruiters API (/api/admin/recruiters)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/recruiters', () => {
    it('devrait refuser l\'accès aux utilisateurs non administrateurs (403)', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'user-1', role: 'USER' } });

      const req = new Request('http://localhost:3000/api/admin/recruiters');
      const res = await GET(req);

      expect(res.status).toBe(403);
    });

    it('devrait refuser les requêtes sans session (403)', async () => {
      (auth as any).mockResolvedValue(null);

      const req = new Request('http://localhost:3000/api/admin/recruiters');
      const res = await GET(req);

      expect(res.status).toBe(403);
    });

    it('devrait lister les dossiers en attente par défaut avec le rôle ADMIN (200)', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } });
      const mockList = [
        {
          id: 'user-1',
          name: 'Tech Recruiter',
          email: 'rec@tech.com',
          companyName: 'Tech Corp',
          recruiterStatus: 'PENDING',
        },
      ];
      (prisma.user.findMany as any).mockResolvedValue(mockList);

      const req = new Request('http://localhost:3000/api/admin/recruiters');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.recruiters).toHaveLength(1);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { recruiterStatus: 'PENDING' },
        })
      );
    });

    it('devrait supporter le filtre status=ALL (200)', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } });
      (prisma.user.findMany as any).mockResolvedValue([]);

      const req = new Request('http://localhost:3000/api/admin/recruiters?status=ALL');
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { recruiterStatus: { in: ['PENDING', 'APPROVED', 'REJECTED'] } },
        })
      );
    });
  });

  describe('PATCH /api/admin/recruiters', () => {
    it('devrait refuser l\'accès aux non-administrateurs (403)', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'user-1', role: 'USER' } });

      const req = new Request('http://localhost:3000/api/admin/recruiters', {
        method: 'PATCH',
        body: JSON.stringify({ userId: 'u1', action: 'APPROVE' }),
      });
      const res = await PATCH(req);

      expect(res.status).toBe(403);
    });

    it('devrait rejeter les paramètres invalides (400)', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } });

      const req = new Request('http://localhost:3000/api/admin/recruiters', {
        method: 'PATCH',
        body: JSON.stringify({ userId: '', action: 'INVALID_ACTION' }),
      });
      const res = await PATCH(req);

      expect(res.status).toBe(400);
    });

    it('devrait retourner 404 si l\'utilisateur cible n\'existe pas', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } });
      (prisma.user.findUnique as any).mockResolvedValue(null);

      const req = new Request('http://localhost:3000/api/admin/recruiters', {
        method: 'PATCH',
        body: JSON.stringify({ userId: 'ghost-user', action: 'APPROVE' }),
      });
      const res = await PATCH(req);

      expect(res.status).toBe(404);
    });

    it('devrait approuver un recruteur, accorder le rôle RECRUITER, réinitialiser les crédits et envoyer un email', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } });
      (prisma.user.findUnique as any).mockResolvedValue({
        id: 'rec-1',
        email: 'rec@faso.bf',
        name: 'Alpha Ouedraogo',
        companyName: 'FASO CORP',
      });
      (prisma.user.update as any).mockResolvedValue({
        id: 'rec-1',
        role: 'RECRUITER',
        recruiterStatus: 'APPROVED',
        companyName: 'FASO CORP',
      });

      const req = new Request('http://localhost:3000/api/admin/recruiters', {
        method: 'PATCH',
        body: JSON.stringify({ userId: 'rec-1', action: 'APPROVE' }),
      });
      const res = await PATCH(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.message).toContain('approuvé avec succès');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'rec-1' },
          data: expect.objectContaining({
            role: 'RECRUITER',
            recruiterStatus: 'APPROVED',
            freeUnlocksUsed: 0,
            recruiterRejectionReason: null,
          }),
        })
      );
      expect(sendEmailViaService).toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: { email: 'rec@faso.bf', name: 'Alpha Ouedraogo' },
          subject: expect.stringContaining('validé'),
        })
      );
    });

    it('devrait rejeter un dossier recruteur avec motif et envoyer un email', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } });
      (prisma.user.findUnique as any).mockResolvedValue({
        id: 'rec-2',
        email: 'rec2@faso.bf',
        name: 'Beta Traore',
        companyName: 'Inconnu SARL',
      });
      (prisma.user.update as any).mockResolvedValue({
        id: 'rec-2',
        role: 'USER',
        recruiterStatus: 'REJECTED',
      });

      const req = new Request('http://localhost:3000/api/admin/recruiters', {
        method: 'PATCH',
        body: JSON.stringify({
          userId: 'rec-2',
          action: 'REJECT',
          reason: 'Numéro de téléphone non joignable',
        }),
      });
      const res = await PATCH(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.message).toContain('rejeté');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'rec-2' },
          data: expect.objectContaining({
            role: 'USER',
            recruiterStatus: 'REJECTED',
            recruiterRejectionReason: 'Numéro de téléphone non joignable',
          }),
        })
      );
      expect(sendEmailViaService).toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: { email: 'rec2@faso.bf', name: 'Beta Traore' },
          subject: expect.stringContaining('demande recruteur'),
        })
      );
    });

    it('devrait réussir même si le service d\'envoi d\'email échoue', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } });
      (prisma.user.findUnique as any).mockResolvedValue({
        id: 'rec-3',
        email: 'rec3@faso.bf',
        name: 'Gamma Diallo',
        companyName: 'Gamma SARL',
      });
      (prisma.user.update as any).mockResolvedValue({
        id: 'rec-3',
        role: 'RECRUITER',
        recruiterStatus: 'APPROVED',
      });
      (sendEmailViaService as any).mockRejectedValueOnce(new Error('Email service offline'));

      const req = new Request('http://localhost:3000/api/admin/recruiters', {
        method: 'PATCH',
        body: JSON.stringify({ userId: 'rec-3', action: 'APPROVE' }),
      });
      const res = await PATCH(req);

      expect(res.status).toBe(200);
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });
});
