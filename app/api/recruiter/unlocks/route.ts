/**
 * GET /api/recruiter/unlocks
 *
 * Authenticated endpoint: requires RECRUITER role.
 * Returns the list of profiles the recruiter has already unlocked,
 * with their real contact info and the anonymized professional data.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès réservé aux recruteurs.' },
        { status: 403 }
      );
    }

    const unlocks = await prisma.profileUnlock.findMany({
      where: { unlockerUserId: session.user.id },
      include: {
        candidateProfile: {
          select: {
            id: true,
            anonymousName: true,
            title: true,
            sector: true,
            skills: true,
            experienceYears: true,
            locationCity: true,
            locationCountry: true,
            completionScore: true,
            isActive: true,
            cv: {
              select: { content: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enrichedUnlocks = unlocks.map((unlock) => {
      const cvContent = unlock.candidateProfile.cv?.content as any;
      const personalInfo = cvContent?.personalInfo || {};

      return {
        id: unlock.id,
        creditsCost: unlock.creditsCost,
        unlockedAt: unlock.createdAt,
        profile: {
          id: unlock.candidateProfile.id,
          anonymousName: unlock.candidateProfile.anonymousName,
          title: unlock.candidateProfile.title,
          sector: unlock.candidateProfile.sector,
          skills: unlock.candidateProfile.skills,
          experienceYears: unlock.candidateProfile.experienceYears,
          locationCity: unlock.candidateProfile.locationCity,
          locationCountry: unlock.candidateProfile.locationCountry,
          completionScore: unlock.candidateProfile.completionScore,
          isActive: unlock.candidateProfile.isActive,
        },
        contactInfo: {
          firstName: personalInfo.firstName || '',
          lastName: personalInfo.lastName || '',
          email: personalInfo.email || '',
          phone: personalInfo.phone || '',
        },
      };
    });

    return NextResponse.json({ unlocks: enrichedUnlocks });
  } catch (error) {
    console.error('[RECRUITER_UNLOCKS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
