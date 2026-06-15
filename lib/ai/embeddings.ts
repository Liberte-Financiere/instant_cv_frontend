import { embed } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

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

  try {
    const { embedding } = await embed({
      model,
      value: text,
    });
    
    return embedding;
  } catch (error) {
    console.error('Erreur lors de la génération de l\'embedding:', error);
    throw new Error('Impossible de générer le vecteur sémantique.');
  }
}
