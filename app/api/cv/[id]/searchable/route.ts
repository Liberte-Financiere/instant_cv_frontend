/**
 * POST /api/cv/[id]/searchable
 *
 * Toggles the isSearchable flag on a CV.
 * When enabled: syncs a CandidateProfile for the recruiter talent pool.
 * When disabled: deactivates the CandidateProfile.
 *
 * Request body: { isSearchable: boolean }
 *
 * Returns the quality report if the CV does not meet the threshold.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import {
  syncCandidateProfile,
  removeCandidateProfile,
  evaluateQuality,
} from '@/lib/candidate-profile';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const isSearchable = !!body.isSearchable;

    // Verify ownership
    const cv = await prisma.cV.findUnique({
      where: { id },
      select: { userId: true, isPublic: true, content: true, updatedAt: true },
    });

    if (!cv || cv.userId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // If enabling, check quality and maximum limit first
    if (isSearchable) {
      // Check maximum limit of 2 searchable CVs
      const activeCount = await prisma.cV.count({
        where: { userId: session.user.id, isSearchable: true }
      });
      
      if (activeCount >= 2) {
        return NextResponse.json({
          success: false,
          error: 'Vous avez atteint la limite. Vous ne pouvez avoir que 2 CVs visibles par les recruteurs en même temps.',
        }, { status: 422 });
      }

      const quality = evaluateQuality(cv.content as any, cv.updatedAt);

      if (!quality.passes) {
        return NextResponse.json({
          success: false,
          error: 'Votre CV ne remplit pas les critères minimum pour être visible par les recruteurs.',
          qualityReport: quality,
        }, { status: 422 });
      }

      // Must also be public
      if (!cv.isPublic) {
        return NextResponse.json({
          success: false,
          error: 'Votre CV doit être public pour être visible par les recruteurs. Activez d\'abord la visibilité publique.',
        }, { status: 422 });
      }
    }

    // Update the flag
    await prisma.cV.update({
      where: { id },
      data: { isSearchable },
    });

    // Sync or remove the candidate profile
    if (isSearchable) {
      await syncCandidateProfile(id);
    } else {
      await removeCandidateProfile(id);
    }

    return NextResponse.json({ success: true, isSearchable });
  } catch (error) {
    console.error('[CV_SEARCHABLE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
