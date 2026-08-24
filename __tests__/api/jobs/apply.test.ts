import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import { POST } from '@/app/api/jobs/[id]/apply/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    jobOffer: {
      findUnique: vi.fn(),
    },
    jobApplication: {
      findFirst: vi.fn(),
      create: vi.fn(),
    }
  }
}));

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: 'user-1' } })
}));

// Mock email client
vi.mock('@/lib/email-client', () => ({
  sendEmailViaService: vi.fn().mockResolvedValue(true)
}));

describe('Apply API Route', () => {
  const mockJobOffer = {
    id: 'job-1',
    title: 'Développeur Fullstack',
    company: 'Tech Corp',
    status: 'ACTIVE',
    requestedFiles: ['CV', 'PORTFOLIO'],
    maxApplications: null,
    _count: {
      applications: 0
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Override the global prisma mock just for these tests to return our mock job offer
    (prisma.jobOffer.findUnique as any) = vi.fn().mockResolvedValue(mockJobOffer);
    (prisma.jobApplication.findFirst as any) = vi.fn().mockResolvedValue(null);
    (prisma.jobApplication.create as any) = vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'app-1', ...data }));
  });

  const createRequest = (body: any) => {
    return new Request('http://localhost:3000/api/jobs/job-1/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  };

  it('should successfully apply when all required files are provided', async () => {
    const req = createRequest({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
      phone: '+22670000000',
      availability: 'Immédiate',
      hasConsent: true,
      cvUrl: 'https://cloudinary.com/cv.pdf',
      portfolioUrl: 'https://cloudinary.com/portfolio.pdf'
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'job-1' }) });
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.jobOfferId).toBe('job-1');
    expect(prisma.jobApplication.create).toHaveBeenCalled();
  });

  it('should fail when a required file (Portfolio) is missing', async () => {
    const req = createRequest({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
      phone: '+22670000000',
      availability: 'Immédiate',
      hasConsent: true,
      cvUrl: 'https://cloudinary.com/cv.pdf',
      // portfolioUrl missing
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'job-1' }) });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Le portfolio est obligatoire.');
    expect(prisma.jobApplication.create).not.toHaveBeenCalled();
  });

  it('should fail when CV is missing but requested', async () => {
    const req = createRequest({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
      phone: '+22670000000',
      availability: 'Immédiate',
      hasConsent: true,
      portfolioUrl: 'https://cloudinary.com/portfolio.pdf',
      // cvUrl missing
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'job-1' }) });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Le CV est obligatoire pour cette offre.');
  });
});
