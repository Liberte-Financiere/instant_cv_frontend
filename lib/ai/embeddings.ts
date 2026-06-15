import { embed } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { logAIUsage } from './logger';

/**
 * Génère un vecteur (embedding) à partir d'un texte en utilisant Gemini.
 * @param text Le texte optimisé du CV (Titre, Résumé, Compétences, Expériences)
 * @returns Un tableau de nombres (le vecteur)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.MY_GEMINI_KEY;
  
  if (!apiKey) {
    throw new Error('MY_GEMINI_KEY is missing for embeddings');
  }

  const google = createGoogleGenerativeAI({ apiKey });
  
  // Utilisation du modèle d'embedding Gemini validé lors de nos tests
  const model = google.textEmbeddingModel('gemini-embedding-001');

  const startTime = performance.now();
  try {
    const { embedding, usage } = await embed({
      model,
      value: text,
    });
    
    logAIUsage({
      type: 'embedding',
      model: 'gemini-embedding-001',
      status: 'success',
      promptTokens: usage?.tokens || 0,
      latencyMs: performance.now() - startTime,
    });
    
    return embedding;
  } catch (error: any) {
    console.error('Erreur lors de la génération de l\'embedding:', error);
    
    logAIUsage({
      type: 'embedding',
      model: 'gemini-embedding-001',
      status: 'error',
      errorMessage: error?.message || 'Erreur inconnue',
      latencyMs: performance.now() - startTime,
    });
    
    throw new Error('Impossible de générer le vecteur sémantique.');
  }
}
