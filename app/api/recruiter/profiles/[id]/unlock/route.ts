/**
 * POST /api/recruiter/profiles/[id]/unlock
 *
 * Authenticated endpoint: requires RECRUITER role.
 * Unlocks a candidate profile, revealing their real contact info.
 *
 * Flow:
 *   1. Verify auth + RECRUITER role.
 *   2. Call unlockProfile() (handles free tier, credits, idempotency).
 *   3. If unlock succeeds, fetch real PII from the CV and return it.
 *   4. If the unlocked profile has no usable contact info (empty email
 *      AND empty phone), auto-refund the credits.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import {
  unlockProfile,
  InsufficientRecruiterCreditsError,
} from '@/lib/recruiter-credits';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify recruiter role
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès réservé aux recruteurs. Inscrivez-vous en tant que recruteur.' },
        { status: 403 }
      );
    }

    const { id: candidateProfileId } = await params;

    // Execute unlock (atomic transaction inside)
    const result = await unlockProfile(session.user.id, candidateProfileId);

    // Fetch the real contact info from the CV
    const profile = await prisma.candidateProfile.findUnique({
      where: { id: candidateProfileId },
      select: {
        cvId: true,
        anonymousName: true,
        title: true,
      },
    });

    if (!profile) {
      return new NextResponse('Profil introuvable', { status: 404 });
    }

    const cv = await prisma.cV.findUnique({
      where: { id: profile.cvId },
      select: { content: true },
    });

    const cvContent = cv?.content as any;
    const personalInfo = cvContent?.personalInfo || {};

    const contactInfo = {
      firstName: personalInfo.firstName || '',
      lastName: personalInfo.lastName || '',
      email: personalInfo.email || '',
      phone: personalInfo.phone || '',
      address: personalInfo.address || '',
    };

    // Guarantee: if no usable contact info, auto-refund
    const hasUsableContact = contactInfo.email || contactInfo.phone;
    if (!hasUsableContact && result.status === 'unlocked' && !result.wasFree) {
      // Refund the credits
      await prisma.$transaction([
        prisma.user.update({
          where: { id: session.user.id },
          data: { recruiterCredits: { increment: result.creditsCost } },
        }),
        prisma.creditTransaction.create({
          data: {
            userId: session.user.id,
            amount: result.creditsCost,
            type: 'RECRUITER_REFUND',
            description: `Remboursement auto: profil ${candidateProfileId} sans coordonnées exploitables`,
          },
        }),
      ]);

      return NextResponse.json({
        ...result,
        contactInfo,
        refunded: true,
        refundReason: 'Le profil ne contient ni email ni téléphone. Vos crédits ont été remboursés.',
        remainingCredits: result.remainingCredits + result.creditsCost,
      });
    }

    return NextResponse.json({
      ...result,
      contactInfo,
      refunded: false,
    });
  } catch (error) {
    if (error instanceof InsufficientRecruiterCreditsError) {
      return NextResponse.json({ error: error.message }, { status: 402 });
    }

    if (error instanceof Error) {
      // Known business errors (own profile, inactive profile, etc.)
      if (
        error.message.includes('introuvable') ||
        error.message.includes('inactif') ||
        error.message.includes('propre profil')
      ) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    console.error('[RECRUITER_UNLOCK]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
