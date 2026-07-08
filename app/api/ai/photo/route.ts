import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { CREDIT_COSTS } from '@/lib/credits';

const COST = CREDIT_COSTS.AI_PHOTO;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;

    // 1. Rate limiting
    const rateCheck = checkRateLimit(`${userId}:ai-photo`, RATE_LIMITS.AI_ANALYSIS);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.resetIn / 1000)) } }
      );
    }

    // 2. Vérification du solde
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    if (!user || user.credits < COST) {
      return NextResponse.json(
        { error: `Crédits insuffisants. Il vous faut ${COST} crédits.` },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { sourceUrl } = body;

    if (!sourceUrl) {
      return NextResponse.json({ error: 'L\'URL de l\'image source est requise.' }, { status: 400 });
    }

    // 3. Effectuer l'appel à OpenRouter (Gemini 3 Pro Image / Nano Banana Pro)
    const startTime = performance.now();
    let resultUrl = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"; // Fallback
    let apiSuccess = false;
    let apiErrorMsg = 'Unknown Error';

    try {
      console.log(`[AI_PHOTO] Fetching source image from Cloudinary...`);
      const imgRes = await fetch(sourceUrl);
      const imgBuffer = await imgRes.arrayBuffer();
      const base64Image = Buffer.from(imgBuffer).toString('base64');
      const base64DataUrl = `data:image/jpeg;base64,${base64Image}`;

      const payload = {
        model: 'google/gemini-3.1-flash-image', // Modèle Nano Banana 2 (Flash)
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Transform this selfie into a high-quality professional studio headshot. Maintain the exact identity, face, and features of the person. Use a neutral or blurred office background, professional lighting, and corporate attire. Return ONLY the URL of the generated image.'
              },
              {
                type: 'image_url',
                image_url: { url: base64DataUrl }
              }
            ]
          }
        ],
        modalities: ["image", "text"] // INDISPENSABLE pour générer une image via OpenRouter Gemini
      };

      console.log(`[AI_PHOTO] Sending request to OpenRouter with model: ${payload.model}`);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000', // Required by OpenRouter
          'X-Title': 'Jobsira Instant CV'
        },
        body: JSON.stringify(payload)
      });

      console.log(`[AI_PHOTO] OpenRouter responded with status: ${response.status}`);

      const data = await response.json();
      console.log(`[AI_PHOTO] OpenRouter Response Data:`, JSON.stringify(data, null, 2));

      // OpenRouter peut renvoyer une erreur 200 OK avec { error: { message: "..." } }
      if (data.error) {
        throw new Error(`Erreur OpenRouter: ${data.error.message || JSON.stringify(data.error)}`);
      }

      const message = data.choices?.[0]?.message;
      const content = message?.content;
      console.log(`[AI_PHOTO] Extracted Content:`, content);
      
      let extractedUrl: string | null = null;

      // Le nouveau format OpenRouter Gemini met l'image dans message.images !
      if (message?.images && Array.isArray(message.images) && message.images.length > 0) {
        const imgObj = message.images.find((img: any) => img.type === 'image_url');
        if (imgObj?.image_url?.url) {
          extractedUrl = imgObj.image_url.url;
        }
      }

      // Fallback 1: Si c'est dans content (Array Multimodal)
      if (!extractedUrl && content && Array.isArray(content)) {
        const imgBlock = content.find((c: any) => c.type === 'image_url');
        if (imgBlock?.image_url?.url) {
          extractedUrl = imgBlock.image_url.url;
        }
      } 
      
      // Fallback 2: Texte classique Markdown dans content
      if (!extractedUrl && typeof content === 'string') {
        const urlMatch = content.match(/(https?:\/\/[^\s\)]+)/);
        if (urlMatch && urlMatch[0]) {
          extractedUrl = urlMatch[0];
        }
      }
      
      // Fallback 3: vérifier le format de réponse de type DALL-E/Image (data.data[0].url)
      if (!extractedUrl && data.data && Array.isArray(data.data) && data.data[0]?.url) {
        extractedUrl = data.data[0].url;
      }

      if (extractedUrl) {
        resultUrl = extractedUrl;
        apiSuccess = true;
      } else {
        throw new Error('Aucune image trouvée dans: ' + JSON.stringify(data.choices?.[0]?.message).substring(0, 150));
      }
    } catch (err: any) {
      console.error('[AI_PHOTO_FETCH_ERROR]', err);
      apiErrorMsg = err.message || 'Unknown fetch error';
    }

    const latencyMs = performance.now() - startTime;

    // 4. Déduire les crédits et historiser (ou rembourser si échec total)
    if (apiSuccess) {
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: { credits: { decrement: COST } }
        });

        await tx.creditTransaction.create({
          data: {
            userId,
            amount: -COST,
            type: 'USAGE',
            description: 'Génération Photo Pro IA'
          }
        });
        
        await tx.aILog.create({
          data: {
            userId,
            type: 'photo-generation',
            model: 'gemini-3.1-flash-image',
            status: 'success',
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
            latencyMs
          }
        });
      });
    } else {
      // Échec de l'API : on logge l'erreur mais on ne débite pas l'utilisateur
      await prisma.aILog.create({
        data: {
          userId,
          type: 'photo-generation',
          model: 'gemini-3.1-flash-image',
          status: 'error',
          errorMessage: apiErrorMsg,
          latencyMs
        }
      });
      return NextResponse.json(
        { error: `Le service IA est temporairement indisponible. Veuillez réessayer.` },
        { status: 503 }
      );
    }

    return NextResponse.json({ resultUrl });

  } catch (error: any) {
    console.error('[AI_PHOTO_ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la photo.' },
      { status: 500 }
    );
  }
}
