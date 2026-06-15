import { prisma } from '../prisma';

interface AILogData {
  userId?: string;
  type: string; // 'chat', 'search', 'embedding', 'analysis', 'cover-letter'
  model: string;
  status?: 'success' | 'error' | 'timeout';
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  latencyMs?: number;
  errorMessage?: string;
}

/**
 * Log une requête IA en base de données de manière asynchrone (fire-and-forget).
 * Encapsulé dans un try/catch pour ne jamais faire crasher la requête principale.
 */
export function logAIUsage(data: AILogData) {
  // Fire and forget: on ne fait pas de await intentionnellement
  Promise.resolve().then(async () => {
    try {
      await prisma.aILog.create({
        data: {
          userId: data.userId || null,
          type: data.type,
          model: data.model,
          status: data.status || 'success',
          promptTokens: data.promptTokens || 0,
          completionTokens: data.completionTokens || 0,
          totalTokens: data.totalTokens || (data.promptTokens || 0) + (data.completionTokens || 0),
          latencyMs: data.latencyMs ? Math.round(data.latencyMs) : 0,
          errorMessage: data.errorMessage || null,
        },
      });
    } catch (error) {
      // Échec silencieux de l'enregistrement du log pour ne pas affecter l'utilisateur
      console.error('[AI_LOGGER_ERROR] Impossible d\'enregistrer le log IA:', error);
    }
  });
}
