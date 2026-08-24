import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
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



    // Verify ownership of the job offer
    const jobOffer = await prisma.jobOffer.findUnique({
      where: { id },
      select: { recruiterId: true },
    });

    if (!jobOffer) {
      return NextResponse.json({ error: 'Offre non trouvée' }, { status: 404 });
    }

    if (jobOffer.recruiterId !== session.user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Action non autorisée' }, { status: 403 });
    }

    // Fetch applications
    const applications = await prisma.jobApplication.findMany({
      where: { jobOfferId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('[RECRUITER_APPLICATIONS_GET]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
