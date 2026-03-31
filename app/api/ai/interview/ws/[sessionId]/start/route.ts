import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkAndConsumeCredits } from '@/lib/credits';
import { createGeminiLiveConnection, connections } from '@/lib/interview-audio';

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
    console.log('[SSE Start] Requête reçue pour session:', sessionId);

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
Commence TOUJOURS par te présenter et accueillir le candidat dès le début de la conversation, sans attendre qu'il parle.
Sois concis, naturel, et interactif. Pose une question à la fois.
Si le candidat te demande de répéter, répète. S'il hésite, encourage-le.`;

        try {
          // Close any existing connection for this session to prevent resource leaks
          const existingConn = connections.get(sessionId);
          if (existingConn) {
            existingConn.terminateBilling?.();
            try { existingConn.ws.close(); } catch {}
            connections.delete(sessionId);
          }

          // Keep-alive interval for SSE
          const keepAlive = setInterval(() => {
            controller.enqueue(encoder.encode(': keepalive\n\n'));
          }, 15000);

          let wsClosed = false;

          // Billing interval for Audio Mode (1 credit / min)
          let billingInterval: NodeJS.Timeout | null = null;
          if (interviewSession.format === 'audio') {
            billingInterval = setInterval(async () => {
              if (wsClosed) return;
              try {
                // Must explicitly specify non-null assertion since session.user.id was already checked at route start
                await checkAndConsumeCredits(
                  session.user!.id!,
                  'AI_INTERVIEW_AUDIO_MINUTE',
                  `Minute audio supplémentaire pour ${interviewSession.jobTitle}`
                );
                console.log(`[SSE Billing] Billed 1 credit for minute on session ${sessionId}`);
              } catch (e: any) {
                console.error(`[SSE Billing] Out of credits for session ${sessionId}. Closing connection.`);
                wsClosed = true;
                if (billingInterval) clearInterval(billingInterval);
                clearInterval(keepAlive);
                
                // Signal client that the stream is dead due to billing
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Crédits épuisés. L\'entretien a été interrompu.' })}\n\n`));
                try { controller.close(); } catch (err) {}
              }
            }, 60000); // 60 seconds
          }

          // Buffer to accumulate AI text transcriptions across streamed chunks
          let transcriptBuffer = '';

          const ws = createGeminiLiveConnection(
            sessionId,
            sessionId,
            session.user!.id!,
            systemInstruction,
            (data) => {
              if (wsClosed) return;

              // Accumulate text transcriptions from Gemini model turns
              if (data.serverContent?.modelTurn?.parts) {
                for (const part of data.serverContent.modelTurn.parts) {
                  if (part.text) {
                    transcriptBuffer += part.text;
                  }
                }
              }

              // When the AI finishes speaking, persist the transcript to the database
              if (data.serverContent?.turnComplete && transcriptBuffer.trim()) {
                const textToSave = transcriptBuffer.trim();
                transcriptBuffer = '';
                prisma.interviewMessage.create({
                  data: {
                    sessionId,
                    role: 'interviewer',
                    content: textToSave,
                  },
                }).catch((err: any) => {
                  console.error('[SSE] Failed to save transcript:', err.message);
                });
              }

              // Forward Gemini payload to client via SSE
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            },
            () => {
              wsClosed = true;
              clearInterval(keepAlive);
              if (billingInterval) clearInterval(billingInterval);
              try { controller.close(); } catch (e) {}
            },
            (err) => {
              wsClosed = true;
              clearInterval(keepAlive);
              if (billingInterval) clearInterval(billingInterval);
              try { controller.error(err); } catch (e) {}
            }
          );

          // Register billing terminator on the connection so endGeminiConnection can stop billing
          // This is the authoritative fix: AudioControls.cleanup() sends { action: 'close' } to the
          // chunk route, which calls endGeminiConnection, which invokes terminateBilling.
          const connEntry = connections.get(sessionId);
          if (connEntry && billingInterval) {
            connEntry.terminateBilling = () => {
              wsClosed = true;
              clearInterval(keepAlive);
              clearInterval(billingInterval!);
              try { controller.close(); } catch (e) {}
            };
          }

          // Handle client disconnect (best effort — req.signal is unreliable in Next.js SSE)
          req.signal.addEventListener('abort', () => {
            wsClosed = true;
            clearInterval(keepAlive);
            if (billingInterval) clearInterval(billingInterval);
            ws.close();
          });

        } catch (err: any) {
          console.error('[SSE_START_ERROR]', err);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
          controller.close();
        }
      }
    });

    console.log('[SSE Start] Stream créé, envoi au client...');
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
