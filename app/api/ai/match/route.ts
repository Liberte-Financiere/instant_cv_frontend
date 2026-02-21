import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  generationConfig: { responseMimeType: "application/json" }
});

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

    const rateCheck = checkRateLimit(`${session.user.id}:ai-match`, RATE_LIMITS.AI_MATCH);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer dans quelques secondes.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.resetIn / 1000)) } }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
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
      5. REFORMULATIONS : Pour chaque élément du CV qui pourrait être mieux formulé pour cette offre, propose une reformulation. Indique la section (experiences, education, skills, personalInfo), l'index dans le tableau, le champ (description, position, summary, etc.), le texte original, la suggestion, et la raison.
      6. RECOMMANDATIONS : Conseils concrets pour maximiser les chances.

      SCHÉMA JSON DE SORTIE :
      {
        "compatibilityScore": number,
        "summary": string,
        "matchedSkills": string[],
        "missingSkills": string[],
        "reformulations": [
          {
            "section": "experiences" | "education" | "skills" | "personalInfo",
            "index": number,
            "field": string,
            "original": string,
            "suggested": string,
            "reason": string
          }
        ],
        "highlights": string[]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text();

    const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsedData = JSON.parse(cleanJson);
      return NextResponse.json(parsedData);
    } catch {
      console.error('[AI_MATCH] JSON Parse Error. Raw:', cleanJson.slice(0, 200));
      return NextResponse.json({ error: 'L\'IA a retourné un format invalide.' }, { status: 500 });
    }

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
