import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { checkAndConsumeCredits } from '@/lib/credits';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { APP_CONFIG } from '@/lib/config';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
// Force using standard text/JSON model
const model = genAI.getGenerativeModel({ 
  model: APP_CONFIG.ai.models.pro, 
  generationConfig: { responseMimeType: "application/json" }
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { targetLanguage } = await req.json();

    if (!targetLanguage || !['en', 'fr', 'zh'].includes(targetLanguage)) {
      return NextResponse.json({ error: "Langue cible invalide. Les choix sont: 'en', 'fr', 'zh'" }, { status: 400 });
    }

    const { id } = await params;

    // 1. Fetch original CV
    const originalCV = await prisma.cV.findUnique({
      where: { id, userId: session.user.id }
    });

    if (!originalCV) {
      return NextResponse.json({ error: "CV introuvable ou vous n'avez pas les droits." }, { status: 404 });
    }

    // 2. Consume Credits
    try {
      await checkAndConsumeCredits(session.user.id, 'AI_CV_TRANSLATE', `Traduction du CV en ${targetLanguage.toUpperCase()}`);
    } catch (e: any) {
      return NextResponse.json({ error: e.message || 'Crédits insuffisants' }, { status: 403 });
    }

    // 3. Translate content via AI
    // We remove the unique 'id' from the content to avoid issues
    const { id: originalContentId, ...cvContentToTranslate } = originalCV.content as any;

    const languageNames: Record<string, string> = {
      'en': 'Anglais',
      'fr': 'Français',
      'zh': 'Chinois (Mandarin)'
    };

    const prompt = `Tu es un traducteur professionnel expert en optimisation de CV.
Ta tâche est de traduire l'intégralité du CV fourni au format JSON vers la langue: ${languageNames[targetLanguage]}.

RÈGLES STRICTES :
1. Tu DOIS renvoyer un objet JSON valide et structuré exactement comme l'original.
2. Ne modifie AUCUNE clé du JSON (ex: 'personalInfo', 'jobTitle', 'startDate' doivent rester en anglais si elles le sont).
3. Ne traduis QUE les CHAÎNES DE CARACTÈRES qui représentent du contenu utilisateur (titres de postes, descriptions, résumés, noms de diplômes, compétences).
4. Ne traduis pas les emails, les numéros de téléphone, les URLs, ou les noms propres (sauf exceptions logiques).
5. Ne rajoute aucun nouveau champ, ne supprime aucun champ. Si un tableau est vide, laisse-le vide.
6. Le format de sortie doit être un JSON pur, sans markdown autour (pas de \`\`\`json).

Contenu original à traduire :
${JSON.stringify(cvContentToTranslate, null, 2)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();

    // Clean up potential markdown blocks if Gemini ignored the instruction
    let jsonString = generatedText;
    if (jsonString.startsWith('```json')) jsonString = jsonString.slice(7);
    if (jsonString.startsWith('```')) jsonString = jsonString.slice(3);
    if (jsonString.endsWith('```')) jsonString = jsonString.slice(0, -3);

    const translatedContent = JSON.parse(jsonString.trim());
    
    // Set a new ID for the content object
    const newContentId = crypto.randomUUID();
    translatedContent.id = newContentId;

    // 4. Determine new Title
    let newTitle = originalCV.title || "CV Traduit";
    const langSuffix = ` - ${targetLanguage.toUpperCase()}`;
    if (!newTitle.endsWith(langSuffix)) {
        newTitle = `${newTitle}${langSuffix}`;
    }

    // 5. Save the new Translated CV
    const newCV = await prisma.cV.create({
      data: {
        id: newContentId, // Using the new unique ID for the DB link
        title: newTitle,
        content: translatedContent,
        userId: session.user.id
      }
    });

    return NextResponse.json({ success: true, newCvId: newCV.id });

  } catch (error: any) {
    console.error('[CV_TRANSLATE_POST]', error);
    
    // Clean, readable error for the user
    let userMessage = 'Une erreur est survenue lors de la traduction de votre CV.';
    const errorMessage = error.toString().toLowerCase();

    if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
      userMessage = "L'IA est très sollicitée. Réessayez dans quelques secondes !";
    } else if (errorMessage.includes('json') || errorMessage.includes('parse')) {
      userMessage = "L'IA a généré une traduction avec un format invalide. Veuillez réessayer.";
    }

    return NextResponse.json({ error: userMessage, details: errorMessage }, { status: 500 });
  }
}
