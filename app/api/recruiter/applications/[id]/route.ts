import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateApplicationSchema = z.object({
  status: z.enum(['NEW', 'REVIEWING', 'RETAINED', 'REJECTED']).optional(),
  isRead: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'RECRUITER' && user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès réservé aux recruteurs' }, { status: 403 });
    }



    // Retrieve application to check ownership of the related job offer
    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        jobOffer: {
          select: { recruiterId: true },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Candidature non trouvée' }, { status: 404 });
    }

    if (application.jobOffer.recruiterId !== session.user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Action non autorisée' }, { status: 403 });
    }

    const json = await req.json();
    const result = updateApplicationSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: 'Données invalides', details: result.error.format() }, { status: 400 });
    }

    // Update application
    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('[RECRUITER_APPLICATIONS_PATCH]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
