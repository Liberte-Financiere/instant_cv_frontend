/**
 * POST /api/recruiter/chat
 *
 * Authenticated endpoint: requires RECRUITER role.
 * Processes a recruiter message through the Talent Assistant AI,
 * which may perform candidate searches via function calling.
 *
 * Request body:
 *   message  - The new message from the recruiter
 *   history  - Previous conversation messages [{role, content}]
 *
 * Response:
 *   reply           - The assistant's markdown response
 *   candidates      - Array of scored candidate profiles (if search was performed)
 *   searchPerformed  - Whether a search was executed
 *   searchParams    - The search parameters used (for transparency)
 */

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { chatWithAssistant, ChatMessage } from '@/lib/talent-assistant';
import { FREE_UNLOCK_LIMIT } from '@/lib/recruiter-credits';
import { prisma } from '@/lib/prisma';
import { APP_CONFIG } from '@/lib/config';

const { rateLimit: CHAT_RATE_LIMIT } = APP_CONFIG.ai.talentAssistant;
const MAX_HISTORY_MESSAGES = APP_CONFIG.ai.talentAssistant.maxMessages;

export async function POST(req: Request) {
  try {
    console.log('[CHAT_API] Requête reçue');
    const session = await auth();
    if (!session?.user?.id) {
      console.log('[CHAT_API] Requête non autorisée (Pas de session ou d\'ID utilisateur)');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      console.log(`[CHAT_API] Requête refusée (Rôle : ${session.user.role}, UserID : ${session.user.id})`);
      return NextResponse.json(
        { error: 'Acces reserve aux recruteurs.' },
        { status: 403 }
      );
    }

    // Rate limit by userId (not IP -- corporate proxy protection)
    const rateLimitKey = `talent-chat:${session.user.id}`;
    const rateCheck = checkRateLimit(rateLimitKey, CHAT_RATE_LIMIT);

    if (!rateCheck.allowed) {
      console.log(`[CHAT_API] Limite de requêtes dépassée pour le UserID : ${session.user.id}`);
      return NextResponse.json(
        { error: 'Trop de requetes. Veuillez patienter quelques instants.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil(rateCheck.resetIn / 1000)) },
        }
      );
    }

    const body = await req.json();
    const { message, history } = body;
    console.log(`[CHAT_API] Corps de la requête analysé pour le UserID : ${session.user.id}. Longueur du message : ${message?.length || 0}`);

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.log('[CHAT_API] Message vide invalide');
      return NextResponse.json(
        { error: 'Le message ne peut pas etre vide.' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      console.log('[CHAT_API] Message trop long');
      return NextResponse.json(
        { error: 'Le message est trop long (2000 caracteres maximum).' },
        { status: 400 }
      );
    }

    // Validate and truncate history
    const validHistory: ChatMessage[] = Array.isArray(history)
      ? history
          .filter(
            (msg: any) =>
              msg &&
              typeof msg.role === 'string' &&
              typeof msg.content === 'string' &&
              (msg.role === 'user' || msg.role === 'assistant')
          )
          .slice(-MAX_HISTORY_MESSAGES)
      : [];
    console.log(`[CHAT_API] Historique validé. ${validHistory.length} messages précédents conservés.`);

    // Fetch recruiter context for the system prompt
    console.log(`[CHAT_API] Récupération du contexte recruteur pour le UserID : ${session.user.id}`);
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        recruiterCredits: true,
        freeUnlocksUsed: true,
        _count: { select: { profileUnlocks: true } },
      },
    });

    if (!user) {
      console.log('[CHAT_API] Utilisateur introuvable en base de données');
      return new NextResponse('Compte introuvable', { status: 404 });
    }

    // Fetch IDs of already unlocked profiles
    const unlockedProfiles = await prisma.profileUnlock.findMany({
      where: { unlockerUserId: session.user.id },
      select: { candidateProfileId: true },
    });
    console.log(`[CHAT_API] Contexte récupéré avec succès. Profils débloqués : ${unlockedProfiles.length}`);

    const recruiterContext = {
      recruiterCredits: user.recruiterCredits,
      freeUnlocksRemaining: Math.max(0, FREE_UNLOCK_LIMIT - user.freeUnlocksUsed),
      unlockedProfileIds: unlockedProfiles.map((u) => u.candidateProfileId),
      userId: session.user.id,
    };

    console.log(`[CHAT_API] Initialisation du flux SSE pour le UserID : ${session.user.id}`);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log(`[CHAT_API] Flux démarré. Invocation du générateur chatWithAssistant.`);
          const generator = chatWithAssistant(message.trim(), validHistory, recruiterContext);
          for await (const event of generator) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          }
          console.log(`[CHAT_API] Flux terminé normalement.`);
        } catch (error: any) {
          console.error('[TALENT_CHAT_STREAM]', error);
          
          let errorMsg = "Désolé, une erreur technique est survenue.";
          
          if (error.message?.includes('SAFETY')) {
            errorMsg = "Je ne peux pas répondre à cette requête. Veuillez reformuler votre demande.";
          } else if (error.status === 429 || error.message?.includes('429')) {
            errorMsg = "L'assistant IA est actuellement très sollicité. Veuillez réessayer dans un instant.";
          }
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', data: errorMsg })}\n\n`));
        } finally {
          controller.close();
          console.log(`[CHAT_API] Flux fermé.`);
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[TALENT_CHAT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
