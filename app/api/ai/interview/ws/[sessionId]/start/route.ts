import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { createGeminiLiveConnection } from '@/lib/interview-audio';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Required for long-lived streams and generic EventEmitter

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { sessionId } = await params;

    // Verify session belongs to user and is active
    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId, userId: session.user.id }
    });

    if (!interviewSession || interviewSession.status === 'completed') {
      return new NextResponse('Session invalide ou terminée', { status: 400 });
    }

    // Prepare SSE response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Build system prompt based on session
        const systemInstruction = `Tu es un recruteur professionnel. L'entretien se fait à l'oral.
PROFIL: ${interviewSession.cvSummary}
POSTE: ${interviewSession.jobTitle}
Sois concis, naturel, et interactif. Pose une question à la fois.
Si le candidat te demande de répéter, répète. S'il hésite, encourage-le.`;

        try {
          // Keep-alive interval for SSE
          const keepAlive = setInterval(() => {
            controller.enqueue(encoder.encode(': keepalive\n\n'));
          }, 15000);

          let wsClosed = false;

          const ws = createGeminiLiveConnection(
            sessionId,
            sessionId,
            session.user!.id!,
            systemInstruction,
            (data) => {
              if (wsClosed) return;
              // Forward Gemini payload to client via SSE
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            },
            () => {
              wsClosed = true;
              clearInterval(keepAlive);
              try { controller.close(); } catch (e) {}
            },
            (err) => {
              wsClosed = true;
              clearInterval(keepAlive);
              try { controller.error(err); } catch (e) {}
            }
          );

          // Handle client disconnect
          req.signal.addEventListener('abort', () => {
            wsClosed = true;
            clearInterval(keepAlive);
            ws.close();
          });

        } catch (err: any) {
          console.error('[SSE_START_ERROR]', err);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
          controller.close();
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Content-Encoding': 'none',
        'X-Accel-Buffering': 'no'
      },
    });

  } catch (error) {
    console.error('[INTERVIEW_SSE_INIT]', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}
