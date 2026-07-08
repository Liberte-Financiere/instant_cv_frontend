import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authConfig } from '@/auth.config';
import * as jose from 'jose';

vi.mock('jose', () => ({
  jwtVerify: vi.fn(),
}));

describe('Auth Config - Impersonation Callbacks', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, IMPERSONATION_SECRET: 'test-secret' };
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.useRealTimers();
  });

  describe('JWT Callback', () => {
    const jwtCallback = authConfig.callbacks?.jwt as any;

    it('should start impersonation successfully', async () => {
      const mockPayload = {
        sub: 'target-123',
        role: 'USER',
        email: 'target@example.com',
        name: 'Target User',
        picture: 'target.png',
        impersonationSessionId: 'session-123',
        jti: 'jti-123',
      };

      (jose.jwtVerify as any).mockResolvedValue({ payload: mockPayload });

      const initialToken = {
        sub: 'admin-123',
        role: 'ADMIN',
        email: 'admin@example.com',
        name: 'Admin',
        picture: 'admin.png',
      };

      const sessionUpdate = { impersonationToken: 'mock-token' };

      const resultToken = await jwtCallback({
        token: { ...initialToken },
        trigger: 'update',
        session: sessionUpdate,
      });

      // Assert original user is saved
      expect(resultToken.originalUser).toEqual(initialToken);
      
      // Assert token is overwritten with target user
      expect(resultToken.sub).toBe('target-123');
      expect(resultToken.role).toBe('USER');
      expect(resultToken.email).toBe('target@example.com');
      expect(resultToken.impersonatedBy).toBe('admin-123');
      expect(resultToken.impersonationJti).toBe('jti-123');
    });

    it('should block impersonation if already impersonating (anti-chaining)', async () => {
      const mockPayload = { sub: 'target-123', jti: 'jti-new' };
      (jose.jwtVerify as any).mockResolvedValue({ payload: mockPayload });

      const chainedToken = {
        sub: 'target-1',
        originalUser: { sub: 'admin-123' }, // Already impersonating
      };

      const resultToken = await jwtCallback({
        token: { ...chainedToken },
        trigger: 'update',
        session: { impersonationToken: 'mock-token' },
      });

      // Sub should not change
      expect(resultToken.sub).toBe('target-1');
    });

    it('should stop impersonation successfully', async () => {
      const impersonatedToken = {
        sub: 'target-123',
        email: 'target@example.com',
        impersonationExpiresAt: Date.now() + 10000,
        originalUser: {
          sub: 'admin-123',
          role: 'ADMIN',
          email: 'admin@example.com',
          name: 'Admin',
          picture: 'admin.png',
        },
      };

      const resultToken = await jwtCallback({
        token: { ...impersonatedToken },
        trigger: 'update',
        session: { stopImpersonation: true },
      });

      // Assert restored to admin
      expect(resultToken.sub).toBe('admin-123');
      expect(resultToken.role).toBe('ADMIN');
      expect(resultToken.originalUser).toBeUndefined();
      expect(resultToken.impersonatedBy).toBeUndefined();
    });

    it('should silently auto-restore if impersonation expired', async () => {
      // Set time to Future
      const futureTime = Date.now() + 60 * 60 * 1000 + 1000; // 1 hour + 1 second
      vi.setSystemTime(futureTime);

      const expiredToken = {
        sub: 'target-123',
        impersonationExpiresAt: Date.now() - 1000, // Expired
        originalUser: {
          sub: 'admin-123',
          role: 'ADMIN',
          email: 'admin@example.com',
        },
      };

      const resultToken = await jwtCallback({
        token: { ...expiredToken },
        trigger: undefined,
        session: undefined,
      });

      expect(resultToken.sub).toBe('admin-123');
      expect(resultToken.role).toBe('ADMIN');
      expect(resultToken.originalUser).toBeUndefined();
    });
  });

  describe('Session Callback', () => {
    const sessionCallback = authConfig.callbacks?.session as any;

    it('should map token properties to session user when impersonating', () => {
      const token = {
        sub: 'target-123',
        role: 'USER',
        email: 'target@example.com',
        name: 'Target',
        picture: 'target.png',
        impersonatedBy: 'admin-123',
        impersonationSessionId: 'sess-123',
      };

      const session = {
        user: { id: 'admin-123', email: 'admin@example.com' },
      };

      const resultSession = sessionCallback({ session, token, user: null as any });

      expect(resultSession.user.id).toBe('target-123');
      expect(resultSession.user.role).toBe('USER');
      expect(resultSession.user.email).toBe('target@example.com');
      expect(resultSession.user.name).toBe('Target');
      expect(resultSession.user.image).toBe('target.png');
      expect(resultSession.user.impersonatedBy).toBe('admin-123');
    });
  });
});
