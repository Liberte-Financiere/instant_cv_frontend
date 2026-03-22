import { NextResponse } from 'next/server';
import { auth } from '@/auth';

import { APP_CONFIG } from '@/lib/config';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Added this import as it's used later

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: APP_CONFIG.ai.models.lite });

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });



    const { text, action, option } = await req.json();

    if (!text || !action) {
      return NextResponse.json({ error: 'Text and action are required' }, { status: 400 });
    }

    // Determine cost and label based on action
    const { checkAndConsumeCredits } = await import('@/lib/credits');
    let creditAction: any = 'AI_REWRITE';
    let label = 'Reformulation de texte (IA)';
    
    if (action === 'correct') {
        creditAction = 'AI_CORRECT';
        label = 'Correction orthographique (IA)';
    } else if (action === 'translate') {
        creditAction = 'AI_TRANSLATE';
        label = 'Traduction de texte (IA)';
    }

    try {
      await checkAndConsumeCredits(session.user.id, creditAction, label);
    } catch (e: any) {
      return NextResponse.json({ error: e.message || 'Crédits insuffisants' }, { status: 403 });
    }

    let prompt = '';

    switch (action) {
      case 'rewrite':
        prompt = `Reformule le texte suivant pour une lettre de motivation.
        Ton : ${option || 'Professionnel'}.
        Texte : "${text}"
        Retourne UNIQUEMENT le texte reformulé, sans guillemets ni intro.`;
        break;
      
      case 'correct':
        prompt = `Corrige les fautes d'orthographe et de grammaire du texte suivant, sans changer le sens ni le style.
        Texte : "${text}"
        Retourne UNIQUEMENT le texte corrigé.`;
        break;
      
      case 'translate':
        const targetLang = option === 'en' ? 'Anglais' : 'Français';
        prompt = `Traduis le texte suivant en ${targetLang}. Garde un ton professionnel adapté à une lettre de motivation.
        Texte : "${text}"
        Retourne UNIQUEMENT la traduction.`;
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const refinedText = response.text().trim();

    return NextResponse.json({ result: refinedText });

  } catch (error: any) {
    console.error('AI Refine Error:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors du traitement IA.' }, { status: 500 });
  }
}
