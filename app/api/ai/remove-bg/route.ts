import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { checkAndConsumeCredits, refundCredits } from '@/lib/credits';
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
    const userId = session.user.id;

    // Rate limiting
    const rateCheck = checkRateLimit(`${userId}:ai_bg`, RATE_LIMITS.AI_ANALYSIS);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez patienter.' },
        { status: 429 }
      );
    }

    // Extract file
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // SECURITE : Validation du poids et du type (Éviter l'épuisement RAM sur le serveur Python)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop volumineux (Max: 5MB)' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
    }

    // Verify user has enough credits and consume them
    let creditResult;
    try {
      creditResult = await checkAndConsumeCredits(userId, 'AI_REMOVE_BG', 'Détourage photo par IA (Rembg)');
    } catch (e: any) {
      return NextResponse.json(
        { error: e.message || 'Crédits insuffisants.' },
        { status: 402 }
      );
    }

    // Forward to Python Microservice
    const pythonFormData = new FormData();
    pythonFormData.append('file', file);

    const pythonBaseUrl = process.env.PYTHON_MICROSERVICE_URL || 'http://127.0.0.1:3001';
    const pythonRes = await fetch(`${pythonBaseUrl}/remove-bg`, {
      method: 'POST',
      body: pythonFormData,
      // Timeout generous for first call (model download ~170MB), subsequent calls take 2-3s
      signal: AbortSignal.timeout(120_000), 
    });

    if (!pythonRes.ok) {
      console.error('[REMBG_PYTHON_ERROR]', await pythonRes.text());
      if (!creditResult.isFree) {
        await refundCredits(userId, 'AI_REMOVE_BG', 'Remboursement: Échec détourage photo');
      }
      return new NextResponse("Service de détourage indisponible", { status: 503 });
    }

    const imageBuffer = await pythonRes.arrayBuffer();

    // Return the transparent PNG image directly
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });

  } catch (error) {
    console.error('[AI_REMOVE_BG_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
