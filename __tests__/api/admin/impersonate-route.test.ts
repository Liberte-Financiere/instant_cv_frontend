import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/admin/impersonate/route';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import * as jose from 'jose';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    auditLog: { create: vi.fn() },
  },
}));

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('jose', () => {
  return {
    SignJWT: vi.fn().mockImplementation(function() {
      return {
        setProtectedHeader: vi.fn().mockReturnThis(),
        setIssuedAt: vi.fn().mockReturnThis(),
        setExpirationTime: vi.fn().mockReturnThis(),
        sign: vi.fn().mockResolvedValue('mocked.jwt.token'),
      };
    }),
  };
});

describe('POST /api/admin/impersonate', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, IMPERSONATION_SECRET: 'test-secret' };
    vi.clearAllMocks();
    
    // Polyfill crypto.randomUUID for JSDOM / Node environments that might lack it in tests
    if (!global.crypto) {
       (global as any).crypto = {};
    }
    if (!global.crypto.randomUUID) {
       global.crypto.randomUUID = (() => 'mocked-uuid-' + Math.random().toString(36).slice(2)) as any;
    }
    if (!global.TextEncoder) {
       global.TextEncoder = require('util').TextEncoder;
    }
    if (!global.TextDecoder) {
       global.TextDecoder = require('util').TextDecoder;
    }
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const mockRequest = (body: any) => {
    return new Request('http://localhost:3000/api/admin/impersonate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  it('should return 401 if unauthenticated', async () => {
    (auth as any).mockResolvedValue(null);

    const req = mockRequest({ targetUserId: 'target-1' });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Unauthorized');
  });

  it('should return 401 if user is not ADMIN', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' },
    });

    const req = mockRequest({ targetUserId: 'target-1' });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it('should return 400 if targetUserId is missing', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN' },
    });

    const req = mockRequest({});
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it('should return 404 if target user is not found', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN' },
    });

    (prisma.user.findUnique as any).mockResolvedValue(null);

    const req = mockRequest({ targetUserId: 'non-existent' });
    const res = await POST(req);

    expect(res.status).toBe(404);
  });

  it('should return 403 and log audit if trying to impersonate another ADMIN', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN' },
    });

    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'admin-2',
      role: 'ADMIN',
    });

    const req = mockRequest({ targetUserId: 'admin-2' });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe('Cannot impersonate an ADMIN');
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          adminId: 'admin-1',
          targetId: 'admin-2',
          action: 'DENIED_TARGET_ADMIN',
        }),
      })
    );
  });

  it('should succeed, create audit log, and return JWT token', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN' },
    });

    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'target-1',
      name: 'Target User',
      email: 'target@example.com',
      role: 'USER',
      image: 'img.png',
    });

    const originalError = console.error;
    let capturedError = null;
    console.error = (...args) => {
      capturedError = args;
    };

    const req = mockRequest({ targetUserId: 'target-1' });
    const res = await POST(req);
    const json = await res.json();

    console.error = originalError;

    if (res.status === 500) {
      throw new Error(`API returned 500. Inner error: ${JSON.stringify(capturedError)}`);
    }

    expect(res.status).toBe(200);
    expect(json.token).toBe('mocked.jwt.token');
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          adminId: 'admin-1',
          targetId: 'target-1',
          action: 'START_IMPERSONATION',
        }),
      })
    );
  });
});
