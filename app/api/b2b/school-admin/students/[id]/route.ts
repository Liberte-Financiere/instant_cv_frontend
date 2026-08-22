import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, schoolId: true }
    });

    if (!adminUser || adminUser.role !== 'SCHOOL_ADMIN' || !adminUser.schoolId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id: studentId } = await params;
    const schoolId = adminUser.schoolId;

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        lastLogin: true,
        schoolId: true,
        _count: {
          select: {
            cvs: true,
            coverLetters: true,
            interviewSessions: true
          }
        },
        schoolCreditTransactions: {
          where: { schoolId }, // only show transactions related to this school
          select: {
            id: true,
            amount: true,
            type: true,
            description: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!student || student.schoolId !== schoolId) {
      return NextResponse.json({ error: 'Étudiant introuvable dans votre établissement' }, { status: 404 });
    }

    // Calculate consumed credits
    const consumedCredits = student.schoolCreditTransactions.reduce((acc, tx) => {
      return acc + (tx.amount.toNumber() < 0 ? Math.abs(tx.amount.toNumber()) : 0);
    }, 0);

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        image: student.image,
        joinedAt: student.createdAt,
        lastLogin: student.lastLogin,
        cvCount: student._count.cvs,
        coverLetterCount: student._count.coverLetters,
        interviewCount: student._count.interviewSessions,
        consumedCredits,
        transactions: student.schoolCreditTransactions
      }
    });

  } catch (error) {
    console.error('[SCHOOL_ADMIN_STUDENT_DETAILS_GET]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
