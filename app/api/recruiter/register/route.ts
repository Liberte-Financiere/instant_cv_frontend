/**
 * POST /api/recruiter/register
 *
 * Authenticated endpoint: requires USER role.
 * Upgrades a standard user account to RECRUITER.
 *
 * Request body:
 *   { companyName: string }
 *
 * Side effects:
 *   - Sets role to RECRUITER
 *   - Sets companyName
 *   - Resets freeUnlocksUsed to 0 (3 free unlocks available)
 *   - Initializes recruiterCredits to 0
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Prevent double registration
    if (session.user.role === 'RECRUITER') {
      return NextResponse.json(
        { error: 'Vous êtes déjà inscrit en tant que recruteur.' },
        { status: 409 }
      );
    }

    // Admin cannot downgrade to recruiter
    if (session.user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Un administrateur ne peut pas devenir recruteur.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const companyName = body.companyName?.trim();

    if (!companyName || companyName.length < 2) {
      return NextResponse.json(
        { error: 'Le nom de l\'entreprise est requis (minimum 2 caractères).' },
        { status: 400 }
      );
    }

    if (companyName.length > 100) {
      return NextResponse.json(
        { error: 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères.' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role: 'RECRUITER',
        companyName,
        recruiterCredits: 0,
        freeUnlocksUsed: 0,
      },
      select: {
        id: true,
        role: true,
        companyName: true,
        recruiterCredits: true,
        freeUnlocksUsed: true,
      },
    });

    return NextResponse.json({
      message: 'Inscription recruteur réussie. Vous disposez de 3 déblocages gratuits.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('[RECRUITER_REGISTER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
