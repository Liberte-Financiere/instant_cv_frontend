import { NextResponse } from 'next/server';
import { auth } from '@/auth';

import { APP_CONFIG } from '@/lib/config';
import { streamObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod'; 
import { logAIUsage } from '@/lib/ai/logger';

export async function POST(req: Request) {
  let session: any;
  try {
    session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });



    const { cvData, cvText, jobDescription } = await req.json();

    if ((!cvData && !cvText) || !jobDescription) {
      return NextResponse.json({ error: 'CV data/text and Job Description are required' }, { status: 400 });
    }

    // Check and consume 2 credits
    const { checkAndConsumeCredits } = await import('@/lib/credits');
    try {
      await checkAndConsumeCredits(session.user.id, 'AI_GENERATE_LETTER', 'Génération d\'une lettre de motivation par IA');
    } catch (e: any) {
      return NextResponse.json({ error: e.message || 'Crédits insuffisants' }, { status: 403 });
    }

    const cvContent = cvText || JSON.stringify(cvData);

    const prompt = `
      Tu es un expert en recrutement. Ta tâche est de rédiger une lettre de motivation percutante et personnalisée.
      
      DONNÉES DU CANDIDAT (CV) :
      ${cvContent}
      
      OFFRE D'EMPLOI :
      ${jobDescription}
      
      CONSIGNES :
      1. Rédige une lettre de motivation professionnelle en français.
      2. Adapte le ton à l'entreprise et au poste.
      3. Mets en avant les compétences du candidat qui matchent avec l'offre.
      4. Structure : Coordonnées (utilise des placeholders si manquants), Objet, Salutations, Corps (3-4 paragraphes : Vous, Moi, Nous), Formule de politesse.
      5. Retourne UNIQUEMENT le corps de la lettre au format JSON avec la structure suivante :
      {
        "subject": "Objet de la lettre",
        "salutation": "Madame, Monsieur,",
        "body": "Texte complet du corps de la lettre, sans les coordonnées ni la signature.",
        "closing": "Formule de politesse"
      }
    `;

    const startTime = Date.now();

    const apiKey = process.env.MY_GEMINI_KEY || '';
    const google = createGoogleGenerativeAI({ apiKey });

    const clSchema = z.object({
      subject: z.string(),
      salutation: z.string(),
      body: z.string(),
      closing: z.string()
    });

    const startTimeMs = performance.now();
    const result = await streamObject({
      model: google(APP_CONFIG.ai.models.fast),
      schema: clSchema,
      prompt: prompt,
      onFinish: ({ usage }) => {
        logAIUsage({
          type: 'cover-letter',
          model: APP_CONFIG.ai.models.fast,
          status: 'success',
          promptTokens: (usage as any)?.promptTokens || (usage as any)?.inputTokens || 0,
          completionTokens: (usage as any)?.completionTokens || (usage as any)?.outputTokens || 0,
          latencyMs: performance.now() - startTimeMs,
          userId: session?.user?.id
        });
      }
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error('AI Generation Detailed Error:', error);

    logAIUsage({
      type: 'cover-letter',
      model: APP_CONFIG.ai.models.fast,
      status: 'error',
      errorMessage: error?.message || 'Erreur inconnue',
      userId: session?.user?.id
    });
    
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('usage limit')) {
        return NextResponse.json({ error: 'Quota API dépassé (429). Réessayez plus tard.' }, { status: 429 });
    }

    return NextResponse.json({ error: error.message || 'Erreur lors de la génération de la lettre.' }, { status: 500 });
  }
}
