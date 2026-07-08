import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { CREDIT_COSTS } from '@/lib/credits';

const REMBG_COST = CREDIT_COSTS.AI_REMOVE_BG;

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

    // Verify user has enough credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    if (!user || user.credits < REMBG_COST) {
      return NextResponse.json(
        { error: `Crédits insuffisants. Il vous faut ${REMBG_COST} crédits.` },
        { status: 402 }
      );
    }

    // Forward to Python Microservice
    const pythonFormData = new FormData();
    pythonFormData.append('file', file);

    const pythonRes = await fetch('http://127.0.0.1:3001/remove-bg', {
      method: 'POST',
      body: pythonFormData,
      // Timeout generous for first call (model download ~170MB), subsequent calls take 2-3s
      signal: AbortSignal.timeout(120_000), 
    });

    if (!pythonRes.ok) {
      console.error('[REMBG_PYTHON_ERROR]', await pythonRes.text());
      return new NextResponse("Service de détourage indisponible", { status: 503 });
    }

    const imageBuffer = await pythonRes.arrayBuffer();

    // Deduct credits only after successful generation
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: REMBG_COST } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId,
          amount: -REMBG_COST,
          type: 'USAGE',
          description: 'Détourage photo par IA (Rembg)',
        },
      }),
    ]);

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
