import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { cvData, cvText, jobDescription } = await req.json();

    if ((!cvData && !cvText) || !jobDescription) {
      return NextResponse.json({ error: 'CV data/text and Job Description are required' }, { status: 400 });
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (sometimes Gemini adds markdown blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse AI response as JSON");
    
    const letterData = JSON.parse(jsonMatch[0]);

    return NextResponse.json(letterData);

  } catch (error: any) {
    console.error('AI Generation Detailed Error:', error);
    
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('usage limit')) {
        return NextResponse.json({ error: 'Quota API dépassé (429). Réessayez plus tard.' }, { status: 429 });
    }

    return NextResponse.json({ error: error.message || 'Erreur lors de la génération de la lettre.' }, { status: 500 });
  }
}
