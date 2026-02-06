import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { text, action, option } = await req.json();

    if (!text || !action) {
      return NextResponse.json({ error: 'Text and action are required' }, { status: 400 });
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
