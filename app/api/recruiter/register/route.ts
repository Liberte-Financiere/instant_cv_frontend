/**
 * POST /api/recruiter/register
 *
 * Authenticated endpoint: requires logged-in user.
 * Submits a recruiter registration dossier for manual Admin approval.
 *
 * Status lifecycle:
 *   NONE -> PENDING (upon registration)
 *   PENDING -> APPROVED (by Admin in HQ Ops)
 *   PENDING -> REJECTED (by Admin in HQ Ops with reason)
 *   REJECTED -> PENDING (upon re-submission)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const registerSchema = z.object({
  companyName: z.string().min(2, "Le nom de l'entreprise doit comporter au moins 2 caractères").max(100),
  companySector: z.string().min(2, "Le secteur d'activité est requis").max(100),
  companyPhone: z.string().min(6, "Le numéro de téléphone professionnel est requis").max(30),
  companyCity: z.string().min(2, "La ville est requise").max(100),
  companyCountry: z.string().min(2, "Le pays est requis").max(100),
  companyWebsite: z.string().optional().or(z.literal('')),
  companyTaxId: z.string().optional().or(z.literal('')), // RCCM / IFU optionnel
  companySize: z.string().optional().or(z.literal('')),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    // Admin cannot register as recruiter
    if (session.user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Un administrateur ne peut pas soumettre un dossier recruteur.' },
        { status: 403 }
      );
    }

    // Fetch current user from DB to check current state
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, recruiterStatus: true },
    });

    if (currentUser?.role === 'RECRUITER' && currentUser?.recruiterStatus === 'APPROVED') {
      return NextResponse.json(
        { error: 'Vous êtes déjà inscrit et validé en tant que recruteur.' },
        { status: 409 }
      );
    }

    if (currentUser?.recruiterStatus === 'PENDING') {
      return NextResponse.json(
        { error: 'Votre dossier est déjà en cours de vérification par nos équipes.' },
        { status: 409 }
      );
    }

    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || 'Données invalides';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = result.data;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        companyName: data.companyName.trim(),
        companySector: data.companySector.trim(),
        companyPhone: data.companyPhone.trim(),
        companyCity: data.companyCity.trim(),
        companyCountry: data.companyCountry.trim(),
        companyWebsite: data.companyWebsite?.trim() || null,
        companyTaxId: data.companyTaxId?.trim() || null,
        companySize: data.companySize?.trim() || null,
        recruiterStatus: 'PENDING',
        recruiterRejectionReason: null,
      },
      select: {
        id: true,
        companyName: true,
        recruiterStatus: true,
      },
    });

    return NextResponse.json({
      message: 'Votre dossier a été soumis avec succès. Notre équipe le valide sous 24h ouvrées.',
      user: updatedUser,
      status: 'PENDING',
    });
  } catch (error) {
    console.error('[RECRUITER_REGISTER]', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}
