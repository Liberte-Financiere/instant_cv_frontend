import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET as getStats } from '@/app/api/hq-ops/marketing/stats/route';
import { POST as sendMarketing, GET as getCount } from '@/app/api/hq-ops/marketing/send/route';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// --- MOCKS ---
vi.mock('@/lib/prisma', () => ({
  prisma: {
    marketingCampaign: {
      create: vi.fn(),
    },
    user: {
      count: vi.fn(),
      findMany: vi.fn(),
    }
  }
}));

vi.mock('@/auth', () => ({
  auth: vi.fn()
}));

// Mock global fetch for Brevo API
const originalFetch = global.fetch;

describe('Marketing HQ Ops API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
    // Default auth mock: Admin user
    (auth as any).mockResolvedValue({
      user: { role: 'ADMIN', email: 'admin@jobsira.com' }
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('GET /api/hq-ops/marketing/stats', () => {
    it('should return 403 if user is not ADMIN', async () => {
      (auth as any).mockResolvedValue({ user: { role: 'USER' } });
      const req = new Request('http://localhost/api/hq-ops/marketing/stats');
      const res = await getStats();
      
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toBe('Non autorisé');
    });

    it('should fetch stats from Brevo successfully', async () => {
      process.env.BREVO_API_KEY = 'test_key';
      (prisma.user.count as any).mockResolvedValue(100);
      
      // Mock Brevo success response
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          delivered: 100,
          uniqueOpens: 50,
          uniqueClicks: 10
        }),
        text: async () => 'OK'
      });

      const req = new Request('http://localhost/api/hq-ops/marketing/stats');
      const res = await getStats();
      
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.totalSubscribers).toBe(100);
      expect(json.emailsSent).toBe(100);
      expect(json.openRate).toBe(50.0);
      expect(json.clickRate).toBe(10.0);
    });

    it('should handle Brevo API errors gracefully by returning 0s', async () => {
      process.env.BREVO_API_KEY = 'test_key';
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => 'Bad Request'
      });

      const req = new Request('http://localhost/api/hq-ops/marketing/stats');
      const res = await getStats();
      
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.emailsSent).toBe(0);
    });
  });

  describe('GET /api/hq-ops/marketing/send (Subscriber count)', () => {
    it('should return 401 if user is not ADMIN', async () => {
      (auth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/hq-ops/marketing/send');
      const res = await getCount();
      expect(res.status).toBe(401);
    });

    it('should return the correct count of users from DB', async () => {
      (prisma.user.count as any).mockResolvedValue(1234);
      const req = new Request('http://localhost/api/hq-ops/marketing/send');
      const res = await getCount();
      
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.count).toBe(1234);
    });
  });

  describe('POST /api/hq-ops/marketing/send (Send/Save Campaign)', () => {
    it('should return 401 if not ADMIN', async () => {
      (auth as any).mockResolvedValue({ user: { role: 'USER' } });
      const req = new Request('http://localhost/api/hq-ops/marketing/send', {
        method: 'POST',
        body: JSON.stringify({ subject: 'Test' })
      });
      const res = await sendMarketing(req);
      expect(res.status).toBe(401);
    });

    it('should return error if no valid recipients found', async () => {
      (auth as any).mockResolvedValue({ user: { role: 'ADMIN' } });
      // targetAudience: 'test' but empty externalEmails -> 0 recipients
      const payload = {
        subject: 'Test Subject',
        message: 'Test Message',
        targetAudience: 'test',
        externalEmails: []
      };
      const req = new Request('http://localhost/api/hq-ops/marketing/send', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      const res = await sendMarketing(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain('Aucun destinataire');
    });

    it('should validate missing fields on send', async () => {
      const payload = {
        // missing subject and message
        externalEmails: ['test@example.com']
      };
      const req = new Request('http://localhost/api/hq-ops/marketing/send', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const res = await sendMarketing(req);
      expect(res.status).toBe(400);
    });

    it('should send a test email successfully via Brevo', async () => {
      process.env.BREVO_API_KEY = 'test_key';
      const payload = {
        subject: 'Test Subject',
        message: 'Test Message',
        targetAudience: 'test',
        externalEmails: ['test@example.com'],
        templateId: 'minimal'
      };
      const req = new Request('http://localhost/api/hq-ops/marketing/send', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      (global.fetch as any).mockResolvedValue({ ok: true, json: async () => ({}) });
      (prisma.marketingCampaign.create as any).mockResolvedValue({ id: '123' });

      const res = await sendMarketing(req);
      expect(res.status).toBe(200);

      // Verify DB save as SENT
      expect(prisma.marketingCampaign.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'sent', recipientsCount: 1 }) })
      );

      // Verify Microservice Call
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/emails/send'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('test@example.com')
        })
      );
    });
  });
});
