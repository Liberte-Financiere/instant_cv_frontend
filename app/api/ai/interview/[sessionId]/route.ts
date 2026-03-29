import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import {
  buildResponseSystemInstruction,
  buildSummarySystemInstruction,
  formatHistoryForGemini,
  generateInterviewResponse,
  INTERVIEW_CONFIG,
} from '@/lib/interview';

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
    const { answer } = await req.json();

    if (!answer?.trim()) {
      return NextResponse.json(
        { error: 'Veuillez écrire une réponse.' },
        { status: 400 }
      );
    }

    // Load session with messages
    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId, userId: session.user.id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!interviewSession) {
      return NextResponse.json({ error: 'Session introuvable.' }, { status: 404 });
    }

    if (interviewSession.status === 'completed') {
      return NextResponse.json(
        { error: 'Cette session est terminée.' },
        { status: 400 }
      );
    }

    const currentQuestionNumber = interviewSession.questionCount;
    const isLastQuestion = currentQuestionNumber >= INTERVIEW_CONFIG.maxQuestions;

    // Build conversation history for context
    const conversationHistory = interviewSession.messages.map((m) => ({
      role: m.role,
      content: m.content,
      score: m.score,
    }));

    // Generate feedback + next question
    const systemInstruction = buildResponseSystemInstruction(
      interviewSession.cvSummary,
      interviewSession.jobTitle,
      currentQuestionNumber,
      interviewSession.jobContext
    );
    const history = formatHistoryForGemini(conversationHistory);

    const aiResponse = await generateInterviewResponse('response', systemInstruction, answer.trim(), history);

    // Save messages in transaction
    await prisma.$transaction(async (tx) => {
      // Save candidate answer
      await tx.interviewMessage.create({
        data: {
          sessionId,
          role: 'candidate',
          content: answer.trim(),
        },
      });

      // Save feedback
      await tx.interviewMessage.create({
        data: {
          sessionId,
          role: 'feedback',
          content: aiResponse.feedback,
          score: aiResponse.score,
        },
      });

      // Save next question (if not last)
      if (aiResponse.nextQuestion) {
        await tx.interviewMessage.create({
          data: {
            sessionId,
            role: 'interviewer',
            content: aiResponse.nextQuestion,
          },
        });

        await tx.interviewSession.update({
          where: { id: sessionId },
          data: { questionCount: { increment: 1 } },
        });
      }
    });

    // If last question, generate summary
    if (isLastQuestion) {
      const updatedMessages = await prisma.interviewMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
      });

      const fullHistory = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
        score: m.score,
      }));

      const summaryInstruction = buildSummarySystemInstruction(
        interviewSession.cvSummary,
        interviewSession.jobTitle
      );

      const history = formatHistoryForGemini(fullHistory);
      const summaryResponse = await generateInterviewResponse('summary', summaryInstruction, "Génère le bilan global de cet entretien complet.", history);

      // Save summary message and update session
      await prisma.$transaction(async (tx) => {
        await tx.interviewMessage.create({
          data: {
            sessionId,
            role: 'summary',
            content: JSON.stringify(summaryResponse),
          },
        });

        await tx.interviewSession.update({
          where: { id: sessionId },
          data: {
            status: 'completed',
            totalScore: summaryResponse.totalScore,
            summary: summaryResponse.globalFeedback,
          },
        });
      });

      return NextResponse.json({
        feedback: aiResponse.feedback,
        score: aiResponse.score,
        nextQuestion: null,
        isComplete: true,
        summary: summaryResponse,
      });
    }

    return NextResponse.json({
      feedback: aiResponse.feedback,
      score: aiResponse.score,
      nextQuestion: aiResponse.nextQuestion,
      questionNumber: currentQuestionNumber + 1,
      isComplete: false,
    });
  } catch (error: any) {
    console.error('[INTERVIEW_RESPOND]', error);

    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return NextResponse.json(
        { error: "L'IA est très sollicitée. Réessayez dans quelques secondes." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors du traitement de votre réponse.' },
      { status: 500 }
    );
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { sessionId } = await params;

    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId, userId: session.user.id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!interviewSession) {
      return NextResponse.json({ error: 'Session introuvable.' }, { status: 404 });
    }

    return NextResponse.json(interviewSession);
  } catch (error) {
    console.error('[INTERVIEW_GET]', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement de la session.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { sessionId } = await params;
    const { action } = await req.json();

    if (action !== 'terminate') {
      return NextResponse.json({ error: 'Action invalide.' }, { status: 400 });
    }

    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId, userId: session.user.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!interviewSession) {
      return NextResponse.json({ error: 'Session introuvable.' }, { status: 404 });
    }

    if (interviewSession.status === 'completed') {
      return NextResponse.json({ success: true });
    }

    // Check if we have interview content to analyze (audio transcriptions or text messages)
    const interviewerMessages = interviewSession.messages.filter(
      (m) => m.role === 'interviewer'
    );
    const candidateMessages = interviewSession.messages.filter(
      (m) => m.role === 'candidate'
    );
    const feedbackMessages = interviewSession.messages.filter(
      (m) => m.role === 'feedback' && m.score !== null
    );

    const hasConversationContent = interviewerMessages.length > 0 || candidateMessages.length > 0;

    let summaryData: {
      totalScore: number;
      globalFeedback: string;
      strengths: string[];
      improvements: string[];
      recommendations: string[];
    };

    if (hasConversationContent) {
      // Generate a real AI-powered summary from the conversation
      try {
        const fullHistory = interviewSession.messages.map((m) => ({
          role: m.role,
          content: m.content,
          score: m.score,
        }));

        const summaryInstruction = buildSummarySystemInstruction(
          interviewSession.cvSummary,
          interviewSession.jobTitle
        );

        const history = formatHistoryForGemini(fullHistory);
        const summaryResponse = await generateInterviewResponse(
          'summary',
          summaryInstruction,
          "Génère le bilan global de cet entretien complet.",
          history
        );

        summaryData = {
          totalScore: summaryResponse.totalScore ?? 0,
          globalFeedback: summaryResponse.globalFeedback ?? 'Bilan généré automatiquement.',
          strengths: summaryResponse.strengths ?? [],
          improvements: summaryResponse.improvements ?? [],
          recommendations: summaryResponse.recommendations ?? [],
        };
      } catch (err: any) {
        console.error('[INTERVIEW_TERMINATE] AI summary generation failed:', err.message);
        // Fallback to partial score from feedback messages
        const partialScore = feedbackMessages.length > 0
          ? Math.round(
              feedbackMessages.reduce((sum, m) => sum + (m.score ?? 0), 0) /
              feedbackMessages.length * 10
            )
          : 0;

        summaryData = {
          totalScore: partialScore,
          globalFeedback: `Entretien terminé après ${interviewerMessages.length} échange(s). Le bilan détaillé n'a pas pu être généré.`,
          strengths: [],
          improvements: [],
          recommendations: [],
        };
      }
    } else {
      // No conversation content at all (terminated immediately)
      summaryData = {
        totalScore: 0,
        globalFeedback: `Entretien terminé sans échange.`,
        strengths: [],
        improvements: [],
        recommendations: [],
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.interviewMessage.create({
        data: {
          sessionId,
          role: 'summary',
          content: JSON.stringify(summaryData),
        },
      });

      await tx.interviewSession.update({
        where: { id: sessionId },
        data: {
          status: 'completed',
          totalScore: summaryData.totalScore,
          summary: summaryData.globalFeedback,
          questionCount: Math.max(interviewSession.questionCount, interviewerMessages.length),
        },
      });
    });

    return NextResponse.json({ success: true, totalScore: summaryData.totalScore });
  } catch (error) {
    console.error('[INTERVIEW_TERMINATE]', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { sessionId } = await params;

    // Verify ownership before deleting
    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId, userId: session.user.id },
      select: { id: true },
    });

    if (!interviewSession) {
      return NextResponse.json({ error: 'Session introuvable.' }, { status: 404 });
    }

    // Messages are cascade-deleted by Prisma via onDelete: Cascade on the relation
    await prisma.interviewSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[INTERVIEW_DELETE]', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

