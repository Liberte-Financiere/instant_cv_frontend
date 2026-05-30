/**
 * GET /api/recruiter/me
 *
 * Authenticated endpoint: requires RECRUITER role.
 * Returns the recruiter's current account status:
 *   - Company name
 *   - Credits balance
 *   - Free unlocks used / remaining
 *   - Total profiles unlocked
 */

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getRecruiterStatus } from '@/lib/recruiter-credits';

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

    const status = await getRecruiterStatus(session.user.id);

    if (!status) {
      return new NextResponse('Compte introuvable', { status: 404 });
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('[RECRUITER_ME]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
