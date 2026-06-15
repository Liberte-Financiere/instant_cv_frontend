import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

import { APP_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    const { extractText } = await import('unpdf');
    const arrayBuffer = await file.arrayBuffer();
    const { text } = await extractText(new Uint8Array(arrayBuffer));
    return text.join('\n');
  } else if (file.type === 'text/plain') {
    return await file.text();
  }
  throw new Error('Format non supporté. Utilisez PDF ou TXT.');
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });



    // Check and consume 2 credits
    const { checkAndConsumeCredits } = await import('@/lib/credits');
    try {
      await checkAndConsumeCredits(session.user.id, 'AI_MATCH', 'Matching du CV avec offre par IA');
    } catch (e: any) {
      return NextResponse.json({ error: e.message || 'Crédits insuffisants' }, { status: 403 });
    }

    if (!process.env.MY_GEMINI_KEY) {
      return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 });
    }

    const contentType = req.headers.get('content-type') || '';
    let cvContent = '';
    let jobContent = '';

    if (contentType.includes('multipart/form-data')) {
      // FormData mode: PDF uploads
      const formData = await req.formData();
      
      // CV source: either JSON data or PDF file
      const cvDataRaw = formData.get('cvData') as string | null;
      const cvFile = formData.get('cvFile') as File | null;

      if (cvFile) {
        cvContent = await extractTextFromFile(cvFile);
      } else if (cvDataRaw) {
        cvContent = cvDataRaw;
      } else {
        return NextResponse.json({ error: 'CV requis (données ou fichier)' }, { status: 400 });
      }

      // Job source: either text or PDF file
      const jobText = formData.get('jobDescription') as string | null;
      const jobFile = formData.get('jobFile') as File | null;

      if (jobFile) {
        jobContent = await extractTextFromFile(jobFile);
      } else if (jobText) {
        jobContent = jobText;
      } else {
        return NextResponse.json({ error: 'Offre d\'emploi requise' }, { status: 400 });
      }
    } else {
      // JSON mode (backward compatible)
      const { cvData, jobDescription } = await req.json();
      if (!cvData || !jobDescription) {
        return NextResponse.json({ error: 'Les données du CV et l\'offre d\'emploi sont requises.' }, { status: 400 });
      }
      cvContent = typeof cvData === 'string' ? cvData : JSON.stringify(cvData);
      jobContent = jobDescription;
    }

    if (!cvContent.trim() || cvContent.trim().length < 30) {
      return NextResponse.json({ error: 'Le contenu du CV est insuffisant.' }, { status: 400 });
    }
    if (!jobContent.trim() || jobContent.trim().length < 20) {
      return NextResponse.json({ error: 'Le contenu de l\'offre est insuffisant.' }, { status: 400 });
    }

    const prompt = `
      Tu es un expert RH et coach carrière. Tu analyses la compatibilité entre un CV et une offre d'emploi.

      IMPORTANT: Analyse dans la langue du CV. Si le CV est en français, réponds en français. Si en anglais, en anglais.

      CV DU CANDIDAT :
      ${cvContent.slice(0, 40000)}

      OFFRE D'EMPLOI :
      ${jobContent.slice(0, 15000)}

      TÂCHES :
      1. SCORE DE COMPATIBILITÉ (0-100) : Évalue la correspondance globale.
      2. RÉSUMÉ : 2-3 phrases synthétisant la compatibilité.
      3. COMPÉTENCES MATCHÉES : Liste des compétences du CV qui correspondent à l'offre.
      4. COMPÉTENCES MANQUANTES : Compétences demandées dans l'offre mais absentes du CV.
      5. REFORMULATIONS : Pour chaque élément du CV qui pourrait être mieux formulé pour cette offre, propose une reformulation. Indique la section (experiences, education, skills, projects, certifications, personalInfo), l'index dans le tableau (commence à 0), le champ précis (description, position, summary, name, technologies, etc.), le texte original complet (exactement comme dans le CV), la suggestion d'amélioration, et la raison. Ne modifie pas la structure du JSON, uniquement le contenu textuel des valeurs.
      6. RECOMMANDATIONS : Conseils concrets pour maximiser les chances.

      SCHÉMA JSON DE SORTIE :
      (Suit strictement le schéma fourni)
    `;

    const apiKey = process.env.MY_GEMINI_KEY || '';
    const google = createGoogleGenerativeAI({ apiKey });

    const matchSchema = z.object({
      compatibilityScore: z.number(),
      summary: z.string(),
      matchedSkills: z.array(z.string()),
      missingSkills: z.array(z.string()),
      reformulations: z.array(z.object({
        section: z.enum(["experiences", "education", "skills", "projects", "certifications", "personalInfo"]),
        index: z.number(),
        field: z.string(),
        original: z.string(),
        suggested: z.string(),
        reason: z.string()
      })),
      highlights: z.array(z.string())
    });

    const { object } = await generateObject({
      model: google(APP_CONFIG.ai.models.fast),
      schema: matchSchema,
      prompt: prompt,
    });

    return NextResponse.json(object);

  } catch (error: any) {
    console.error('[AI_MATCH] Error:', error);

    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      return NextResponse.json({ error: 'Quota IA dépassé. Réessayez dans une minute.' }, { status: 429 });
    }

    return NextResponse.json({ 
      error: error.message || 'Erreur lors de l\'analyse de compatibilité.'
    }, { status: 500 });
  }
}
