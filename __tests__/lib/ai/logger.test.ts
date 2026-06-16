import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logAIUsage } from '@/lib/ai/logger';
import { prisma } from '@/lib/prisma';

// Mock du client Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    aILog: {
      create: vi.fn(),
    },
  },
}));

describe('logAIUsage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Silence console.error for tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('devrait appeler prisma.aILog.create avec les bonnes données', async () => {
    const mockData = {
      type: 'chat',
      model: 'gemini-test',
      status: 'success' as const,
      promptTokens: 10,
      completionTokens: 20,
      latencyMs: 1500,
      userId: 'user-123'
    };

    // Appel de la fonction (fire-and-forget)
    logAIUsage(mockData);

    // On attend un tick de l'event loop car c'est dans un Promise.resolve().then()
    await new Promise(process.nextTick);

    expect(prisma.aILog.create).toHaveBeenCalledTimes(1);
    expect(prisma.aILog.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-123',
        type: 'chat',
        model: 'gemini-test',
        status: 'success',
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30, // calcul automatique
        latencyMs: 1500,
        errorMessage: null,
      }
    });
  });

  it('devrait échouer silencieusement si Prisma lance une erreur (ne pas crasher)', async () => {
    // On force Prisma à lancer une erreur
    const errorMessage = 'Database connection failed';
    vi.mocked(prisma.aILog.create).mockRejectedValueOnce(new Error(errorMessage));

    const mockData = {
      type: 'embedding',
      model: 'gemini-test'
    };

    // Appel de la fonction (fire-and-forget)
    // S'il y a une erreur non catchée, le test plantera
    expect(() => logAIUsage(mockData)).not.toThrow();

    // On attend un tick
    await new Promise(process.nextTick);

    expect(prisma.aILog.create).toHaveBeenCalledTimes(1);
    
    // Le console.error devrait avoir été appelé
    expect(console.error).toHaveBeenCalledWith(
      '[AI_LOGGER_ERROR] Impossible d\'enregistrer le log IA:',
      expect.any(Error)
    );
  });
});
