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

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        creditWallet: {
          select: { balance: true, totalBought: true, totalUsed: true },
        },
        _count: {
          select: { users: true, invitations: true, memberships: true },
        },
      },
    });

    if (!school) {
      return NextResponse.json({ error: 'École introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ school });
  } catch (error) {
    console.error('[HQ-OPS/SCHOOLS/[id]] GET error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
