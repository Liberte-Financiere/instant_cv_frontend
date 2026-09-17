import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/recruiter/status
 *
 * Checks the live recruiter verification status of the current user from PostgreSQL.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        recruiterStatus: true,
        recruiterRejectionReason: true,
        companyName: true,
        companySector: true,
        companyCity: true,
        companyCountry: true,
        companyPhone: true,
        companyWebsite: true,
        companyTaxId: true,
        companySize: true,
        companyDescription: true,
        companyDocumentUrl: true,
        freeUnlocksUsed: true,
        recruiterCredits: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    return NextResponse.json({
      status: user.recruiterStatus || 'NONE',
      role: user.role,
      rejectionReason: user.recruiterRejectionReason,
      freeUnlocksRemaining: Math.max(0, 3 - (user.freeUnlocksUsed || 0)),
      recruiterCredits: user.recruiterCredits || 0,
      company: {
        name: user.companyName,
        sector: user.companySector,
        city: user.companyCity,
        country: user.companyCountry,
        phone: user.companyPhone,
        website: user.companyWebsite,
        taxId: user.companyTaxId,
        size: user.companySize,
        description: user.companyDescription,
        documentUrl: user.companyDocumentUrl,
      },
    });
  } catch (error) {
    console.error('[RECRUITER_STATUS_ERROR]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
