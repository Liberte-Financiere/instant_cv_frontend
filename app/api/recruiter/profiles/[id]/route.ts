/**
 * GET /api/recruiter/profiles/[id]
 *
 * Candidate profile detail endpoint.
 * Returns the detailed anonymized view of a single candidate profile.
 * Includes anonymized experiences, education, languages, certifications.
 *
 * If the requesting user is authenticated and has unlocked this profile
 * (or is the profile owner / admin), also returns the real contactInfo (PII).
 * Otherwise, contactInfo is null and no PII is returned.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { anonymizeProfile } from '@/lib/anonymize';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const currentUserId = session?.user?.id;

    const profile = await prisma.candidateProfile.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        anonymousName: true,
        title: true,
        sector: true,
        skills: true,
        experienceYears: true,
        locationCity: true,
        locationCountry: true,
        completionScore: true,
        lastCvUpdate: true,
        isActive: true,
        anonymousData: true,
        cv: {
          select: { content: true },
        },
        ...(currentUserId
          ? {
              unlocks: {
                where: { unlockerUserId: currentUserId },
                select: { id: true },
                take: 1,
              },
            }
          : {}),
      },
    });

    if (!profile || !profile.isActive) {
      return new NextResponse('Profil introuvable', { status: 404 });
    }

    if (!profile.cv) {
      return new NextResponse('Profil introuvable', { status: 404 });
    }

    // Utiliser la version pré-calculée en priorité, sinon anonymiser à la volée (pour les anciens profils)
    const anonymized = profile.anonymousData 
      ? (profile.anonymousData as any) 
      : anonymizeProfile(profile.cv.content);

    const isUnlocked = Boolean(
      currentUserId &&
        (profile.userId === currentUserId ||
          session?.user?.role === 'ADMIN' ||
          ((profile as any).unlocks && (profile as any).unlocks.length > 0))
    );

    let contactInfo = null;
    if (isUnlocked && profile.cv?.content) {
      const cvContent = profile.cv.content as any;
      const personalInfo = cvContent?.personalInfo || {};
      contactInfo = {
        firstName: personalInfo.firstName || '',
        lastName: personalInfo.lastName || '',
        email: personalInfo.email || '',
        phone: personalInfo.phone || '',
        address: personalInfo.address || '',
      };
    }

    return NextResponse.json({
      id: profile.id,
      ...anonymized,
      lastCvUpdate: profile.lastCvUpdate,
      isUnlocked,
      contactInfo,
    });
  } catch (error) {
    console.error('[RECRUITER_PROFILE_DETAIL]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
