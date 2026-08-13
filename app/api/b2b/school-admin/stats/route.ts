import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user || session.user.role !== 'SCHOOL_ADMIN' || !session.user.schoolId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const schoolId = session.user.schoolId;

    // Fetch school info & wallet
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        creditWallet: true
      }
    });

    if (!school) {
      return NextResponse.json({ error: 'École introuvable' }, { status: 404 });
    }

    // Fetch stats
    const [totalStudents, pendingInvitations, acceptedInvitations] = await Promise.all([
      prisma.user.count({ where: { schoolId } }),
      prisma.schoolInvitation.count({ where: { schoolId, status: 'PENDING' } }),
      prisma.schoolInvitation.count({ where: { schoolId, status: 'ACCEPTED' } })
    ]);

    return NextResponse.json({
      school: {
        id: school.id,
        name: school.name,
      },
      wallet: {
        balance: school.creditWallet?.balance.toNumber() || 0,
      },
      stats: {
        totalStudents,
        pendingInvitations,
        acceptedInvitations
      }
    });

  } catch (error) {
    console.error('[SCHOOL_ADMIN_STATS_GET]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
