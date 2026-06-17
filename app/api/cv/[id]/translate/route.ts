import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { checkAndConsumeCredits } from '@/lib/credits';
import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { APP_CONFIG } from '@/lib/config';
import { logAIUsage } from '@/lib/ai/logger';

// Instanciation déplacée dans POST

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let session: any;
  try {
    session = await auth();
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
4. Ne traduis PAS les noms propres : noms de pays (Burkina Faso, France...), noms de villes (Ouagadougou, Paris...), noms d'entreprises, noms d'écoles, noms de personnes. Garde-les exactement comme dans l'original.
5. Ne traduis pas les emails, les numéros de téléphone, les URLs.
6. Ne rajoute aucun nouveau champ, ne supprime aucun champ. Si un tableau est vide, laisse-le vide.
7. Le format de sortie doit être un JSON pur, sans markdown autour (pas de \`\`\`json).
8. TRÈS IMPORTANT: L'IA NE DOIT INVENTER AUCUNE DONNÉE (pas de nouvelles compétences, pas de nouvelles expériences). TRADUIS UNIQUEMENT LE CONTENU EXISTANT SANS BOUCLER.

Contenu original à traduire :
${JSON.stringify(cvContentToTranslate, null, 2)}`;

    console.log(`[TRANSLATE] Target Language: ${targetLanguage}, Original Length: ${JSON.stringify(cvContentToTranslate).length} characters`);

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'Configuration IA manquante (OpenRouter)' }, { status: 500 });
    }
    const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

    const startTime = performance.now();
    const { text: generatedText, usage } = await generateText({
      model: openrouter(APP_CONFIG.ai.models.openrouter.fast),
      prompt: prompt,
      temperature: 0.1,
    });
    
    logAIUsage({
      type: 'translation',
      model: APP_CONFIG.ai.models.openrouter.fast,
      status: 'success',
      promptTokens: (usage as any)?.promptTokens || (usage as any)?.inputTokens || 0,
      completionTokens: (usage as any)?.completionTokens || (usage as any)?.outputTokens || 0,
      latencyMs: performance.now() - startTime,
      userId: session.user.id
    });
    
    console.log(`[TRANSLATE] Generation Complete. Output Length: ${generatedText.length} characters`);
    console.log(`[TRANSLATE] Raw Output Preview:`, generatedText.substring(0, 150) + '...', '...[END]...', generatedText.substring(generatedText.length - 150));

    // Clean up potential markdown blocks robustly
    let jsonString = generatedText;
    const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
        jsonString = match[1].trim();
    } else {
        jsonString = jsonString.replace(/^```json/i, '').replace(/```$/, '').trim();
    }

    let translatedContent;
    try {
      translatedContent = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("[TRANSLATE] JSON Parse Error. The model returned invalid or truncated JSON.");
      // We log a large chunk of the end to see where it got cut off
      console.error("[TRANSLATE] End of generated string:", jsonString.substring(jsonString.length - 300));
      throw new Error(`Invalid JSON format returned by AI: ${parseError}`);
    }
    
    // Set a new ID for the content object
    const newContentId = crypto.randomUUID();
    translatedContent.id = newContentId;

    // 4. Determine new Title
    let newTitle = originalCV.title || "CV Traduit";
    const langSuffix = ` - ${targetLanguage.toUpperCase()}`;
    if (!newTitle.endsWith(langSuffix)) {
        newTitle = `${newTitle}${langSuffix}`;
    }

    // Ensure settings exist and inject language
    translatedContent.settings = {
        ...(translatedContent.settings || {}),
        language: targetLanguage.toLowerCase()
    };

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
    console.error('[TRANSLATE] Error during translation:', error);

    logAIUsage({
      type: 'translation',
      model: APP_CONFIG.ai.models.openrouter.fast,
      status: 'error',
      errorMessage: error?.message || 'Erreur inconnue',
      userId: session?.user?.id
    });
    
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
