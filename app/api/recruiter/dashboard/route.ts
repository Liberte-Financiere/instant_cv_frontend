import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const userId = session.user.id;

    // Execute all queries in parallel to drastically reduce network latency
    const [activeJobs, totalApplications, unlockedProfiles, user] = await Promise.all([
      // 1. Offres actives
      prisma.jobOffer.count({
        where: { recruiterId: userId, status: 'ACTIVE' },
      }),
      // 2. Total des candidatures
      prisma.jobApplication.count({
        where: { jobOffer: { recruiterId: userId } },
      }),
      // 3. Profils débloqués
      prisma.profileUnlock.count({
        where: { unlockerUserId: userId },
      }),
      // 4. Crédits restants
      prisma.user.findUnique({
        where: { id: userId },
        select: { recruiterCredits: true },
      })
    ]);

    return NextResponse.json({
      activeJobs,
      totalApplications,
      unlockedProfiles,
      credits: user?.recruiterCredits || 0,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des stats du tableau de bord:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
