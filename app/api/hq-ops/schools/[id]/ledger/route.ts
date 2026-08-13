import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id: schoolId } = await context.params;

    const transactions = await prisma.schoolCreditTransaction.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        performedBy: {
          select: { name: true, email: true },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('[HQ-OPS/SCHOOLS/LEDGER] GET error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
