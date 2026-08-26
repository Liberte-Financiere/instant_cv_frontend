import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { APP_CONFIG } from '@/lib/config';
import { sanitizeText } from '@/lib/anonymize';

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

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await context.params;
    const jobId = resolvedParams.id;

    if (!jobId) {
      return NextResponse.json({ error: "ID de l'offre manquant" }, { status: 400 });
    }

    // Récupérer la vraie offre depuis la BDD (sécurisé)
    const jobOffer = await prisma.jobOffer.findUnique({
      where: { id: jobId }
    });

    if (!jobOffer) {
      return NextResponse.json({ error: "Offre d'emploi introuvable" }, { status: 404 });
    }

    const formData = await req.formData();
    const cvFile = formData.get('cvFile') as File | null;

    if (!cvFile) {
      return NextResponse.json({ error: 'Fichier CV requis' }, { status: 400 });
    }

    // Extraction du texte du CV et anonymisation à la volée (RGPD)
    const rawCvContent = await extractTextFromFile(cvFile);
    const cvContent = sanitizeText(rawCvContent);
    
    // Construction du contenu de l'offre
    const jobContent = `
Titre : ${jobOffer.title}
Entreprise : ${jobOffer.company}
Description : ${jobOffer.description}
Prérequis : ${jobOffer.requirements.join(', ')}
    `.trim();

    if (!cvContent.trim() || cvContent.trim().length < 30) {
      return NextResponse.json({ error: 'Le contenu du CV est insuffisant.' }, { status: 400 });
    }

    const prompt = `
      Tu es un expert RH et coach carrière. Tu analyses la compatibilité entre un CV et une offre d'emploi.

      IMPORTANT: Analyse dans la langue du CV. Si le CV est en français, réponds en français. Si en anglais, en anglais.

      CV DU CANDIDAT :
      ${cvContent.slice(0, 40000)}

      OFFRE D'EMPLOI :
      ${jobContent.slice(0, 15000)}

      TÂCHES :
      1. SCORE DE COMPATIBILITÉ (0-100) : Évalue la correspondance globale. Fais preuve d'une intelligence sémantique : si l'offre demande du "JavaScript" et que le CV liste "React" ou "Node.js", déduis la compétence. Ne fais pas qu'une recherche par mot-clé exacte, comprends les écosystèmes techniques et leurs implications (ex: qui fait du Next.js sait faire du React et du JS).
      2. RÉSUMÉ : 2-3 phrases synthétisant la compatibilité.
      3. COMPÉTENCES MATCHÉES : Liste des compétences du CV qui correspondent à l'offre (forces), incluant celles que tu as intelligemment déduites (ex: TypeScript déduit de Angular).
      4. COMPÉTENCES MANQUANTES : Compétences demandées dans l'offre mais réellement absentes du CV. Avant de lister une faille, vérifie si elle n'est pas couverte par une compétence synonyme ou englobante présente dans le CV.
      5. REFORMULATIONS : Non requises ici (laisser un tableau vide).
      6. HIGHLIGHTS (Recommandations) : Un conseil très bref et actionnable pour ce candidat.

      SCHÉMA JSON DE SORTIE :
      (Suit strictement le schéma fourni)
    `;

    const apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!apiKey) {
      return NextResponse.json({ error: "Configuration IA manquante (OpenRouter)" }, { status: 500 });
    }
    const openrouter = createOpenRouter({ apiKey });

    // On utilise exactement le même schéma que la route d'analyse existante pour rester consistant
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
      model: openrouter(APP_CONFIG.ai.models.openrouter.fast), // Utilise Gemini-3.7-flash (très rapide et pas cher)
      schema: matchSchema,
      prompt: prompt,
    });

    return NextResponse.json(object);

  } catch (error: any) {
    console.error('[AI_JOB_MATCH] Error:', error);

    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      return NextResponse.json({ error: 'Quota IA dépassé. Réessayez dans une minute.' }, { status: 429 });
    }

    return NextResponse.json({ 
      error: error.message || 'Erreur lors de l\'analyse de compatibilité.'
    }, { status: 500 });
  }
}
