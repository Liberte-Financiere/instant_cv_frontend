import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { 
  sendAudioToGemini, 
  sendClientContentMessage, 
  endGeminiConnection,
  connections 
} from '@/lib/interview-audio';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { sessionId } = await params;

    // Verify that the active connection belongs to the authenticated user
    const conn = connections.get(sessionId);
    if (conn && conn.userId !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    // Reject oversized payloads before parsing (512KB max)
    // Normal audio chunk: ~21KB base64 for 500ms of 16kHz PCM16
    const MAX_BODY_BYTES = 512 * 1024;
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Payload trop volumineux' }, { status: 413 });
    }

    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Payload trop volumineux' }, { status: 413 });
    }

    const body = JSON.parse(rawBody);

    if (body.action === 'chunk' && body.pcmBase64) {
      sendAudioToGemini(sessionId, body.pcmBase64);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'clientContent' && body.text) {
      sendClientContentMessage(sessionId, body.text);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'close') {
      endGeminiConnection(sessionId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });

  } catch (error: any) {
    console.error('[INTERVIEW_CHUNK]', error.message);
    if (error.message === 'Connection active not found') {
      return NextResponse.json({ error: 'Connexion fermée ou expirée' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
