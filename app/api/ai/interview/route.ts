import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { checkAndConsumeCredits } from '@/lib/credits';
import { CVService } from '@/services/cvService';
import {
  buildCVSummary,
  buildFirstQuestionSystemInstruction,
  generateInterviewResponse,
} from '@/lib/interview';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { cvId, jobTitle, jobContext, format = 'text', voicePreference } = await req.json();

    if (!cvId || !jobTitle?.trim()) {
      return NextResponse.json(
        { error: 'Le CV et le poste visé sont requis.' },
        { status: 400 }
      );
    }

    // Fetch full CV
    const cv = await prisma.cV.findUnique({
      where: { id: cvId, userId: session.user.id },
    });

    if (!cv) {
      return NextResponse.json({ error: 'CV introuvable.' }, { status: 404 });
    }

    // Consume credits based on format
    try {
      if (format === 'text') {
        // Text mode: 5 credits per session (flat)
        await checkAndConsumeCredits(
          session.user.id,
          'AI_INTERVIEW',
          `Simulation d'entretien écrit pour ${jobTitle}`
        );
      } else if (format === 'audio') {
        // Audio mode: 1 credit for the 1st minute (billed dynamically afterwards)
        await checkAndConsumeCredits(
          session.user.id,
          'AI_INTERVIEW_AUDIO_MINUTE',
          `1ère minute d'entretien vocal pour ${jobTitle}`
        );
      }
    } catch (e: any) {
      return NextResponse.json(
        { error: e.message || 'Crédits insuffisants' },
        { status: 403 }
      );
    }

    // Build CV summary for the AI
    const cvContent = cv.content as Record<string, any>;
    const cvSummary = buildCVSummary(cvContent);

    // Generate first question ONLY if it's a text interview
    let aiResponse = { question: "Cliquez sur le micro pour commencer l'entretien.", questionType: "intro" };
    
    if (format === 'text') {
      const systemInstruction = buildFirstQuestionSystemInstruction(cvSummary, jobTitle.trim(), jobContext);
      aiResponse = await generateInterviewResponse('first', systemInstruction, "Commence l'entretien par la première question.");
    }

    // Create session + first message in a transaction
    const interviewSession = await prisma.$transaction(async (tx) => {
      const newSession = await tx.interviewSession.create({
        data: {
          userId: session.user!.id!,
          jobTitle: jobTitle.trim(),
          jobContext: jobContext?.trim() || null,
          cvSummary,
          format, // "text" or "audio"
          voicePreference: format === 'audio' ? (voicePreference || null) : null,
          questionCount: format === 'audio' ? 0 : 1,
        },
      });

      if (format === 'text') {
        await tx.interviewMessage.create({
          data: {
            sessionId: newSession.id,
            role: 'interviewer',
            content: aiResponse.question,
          },
        });
      }

      return newSession;
    });

    return NextResponse.json({
      sessionId: interviewSession.id,
      question: aiResponse.question,
      questionType: aiResponse.questionType,
      questionNumber: format === 'audio' ? 0 : 1,
    });
  } catch (error: any) {
    console.error('[INTERVIEW_START]', error);

    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return NextResponse.json(
        { error: "L'IA est très sollicitée. Réessayez dans quelques secondes." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors du démarrage de l\'entretien.' },
      { status: 500 }
    );
  }
}
