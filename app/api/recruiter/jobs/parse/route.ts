import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import { generateObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { APP_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texte manquant ou invalide' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY || '';
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Clé API Groq manquante' }, { status: 500 });
    }

    const groq = createGroq({ apiKey: groqApiKey });

    const jobSchema = z.object({
      title: z.string().describe("Le titre exact du poste. S'il n'y a pas de titre précis, essayer d'en déduire un court."),
      company: z.string().describe("Le nom de l'entreprise qui recrute. Laisser vide si introuvable."),
      location: z.string().describe("La localisation du poste (ex: Paris, Télétravail, Lyon)."),
      type: z.enum(['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance']).nullable().describe("Le type de contrat."),
      salary: z.string().describe("Le salaire ou TJM proposé. Laisser vide si non mentionné."),
      applyUrlOrMail: z.string().describe("Le lien URL ou l'adresse email pour postuler (si mentionné dans le texte). Laisser vide sinon."),
      description: z.string().describe("La description complète du poste. IMPORTANT : Inclus TOUT le contexte supplémentaire ici (missions, équipe, conditions, dates, comment postuler, étapes de recrutement, etc.) afin de ne perdre aucune information du texte original."),
      requirements: z.string().describe("Les compétences et prérequis attendus, séparés par des virgules (ex: React, Node.js, 3 ans d'expérience)."),
    });

    const prompt = `
Tu es un expert RH. Voici le texte brut d'une offre d'emploi (peut-être extrait d'un PDF, de WhatsApp ou de LinkedIn).
Ton objectif est de structurer ces informations au format JSON.
Si une information manque (comme le salaire ou l'entreprise), laisse le champ vide ("") ou null. Ne l'invente pas.

TRÈS IMPORTANT : Ne supprime aucune information utile (comme les dates limites, les étapes de sélection, les conditions de travail ou les consignes). Tout ce qui ne rentre pas dans les champs spécifiques (salaire, titre, entreprise...) DOIT être compilé proprement et ajouté dans le champ "description".

Texte brut de l'offre :
"""
${text.slice(0, 15000)}
"""
`;

    const { object } = await generateObject({
      // @ts-ignore - Utilisateur peut avoir un nom de modèle OpenRouter dans sa config, on ignore l'erreur TS
      model: groq(APP_CONFIG.ai.models.groqJobReformulation),
      schema: jobSchema,
      prompt: prompt,
    });

    return NextResponse.json(object);

  } catch (error: any) {
    console.error('[API_JOBS_PARSE] Error:', error);
    
    // Si l'erreur est liée au nom du modèle Groq ou JSON parse
    return NextResponse.json({ 
      error: 'Erreur lors de l\'extraction par l\'IA.', 
      details: error.message 
    }, { status: 500 });
  }
}
