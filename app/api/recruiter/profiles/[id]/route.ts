/**
 * GET /api/recruiter/profiles/[id]
 *
 * Public endpoint: no authentication required.
 * Returns the detailed anonymized view of a single candidate profile.
 * Includes anonymized experiences, education, languages, certifications.
 *
 * Never returns PII (email, phone, full name, address).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { anonymizeProfile } from '@/lib/anonymize';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const profile = await prisma.candidateProfile.findUnique({
      where: { id },
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
        lastCvUpdate: true,
        isActive: true,
        anonymousData: true,
        cv: {
          select: { content: true },
        },
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

    return NextResponse.json({
      id: profile.id,
      ...anonymized,
      lastCvUpdate: profile.lastCvUpdate,
    });
  } catch (error) {
    console.error('[RECRUITER_PROFILE_DETAIL]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
