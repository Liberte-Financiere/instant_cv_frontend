import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const sessions = await prisma.interviewSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        jobTitle: true,
        status: true,
        totalScore: true,
        questionCount: true,
        createdAt: true,
      },
      take: 20,
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('[INTERVIEW_HISTORY]', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement de l\'historique.' },
      { status: 500 }
    );
  }
}
