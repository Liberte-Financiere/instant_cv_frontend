import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const jobOfferUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  company: z.string().min(2).optional(),
  location: z.string().optional(),
  type: z.enum(['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance']).optional(),
  description: z.string().min(10).optional(),
  requirements: z.array(z.string()).optional(),
  salary: z.string().optional(),
  applyMethod: z.enum(['URL', 'EMAIL', 'NATIVE']).optional(),
  applyUrlOrMail: z.string().nullable().optional().transform(v => v === null ? '' : v),
  maxApplications: z.number().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  requestedFiles: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'CLOSED']).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
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

    // Verify ownership
    const existingJob = await prisma.jobOffer.findUnique({
      where: { id },
      select: { recruiterId: true },
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 });
    }

    if (existingJob.recruiterId !== session.user.id && user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé à modifier cette offre' }, { status: 403 });
    }

    const json = await req.json();
    const result = jobOfferUpdateSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: 'Données invalides', details: result.error.format() }, { status: 400 });
    }

    const updatedJob = await prisma.jobOffer.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('[RECRUITER_JOBS_PATCH]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
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

    // Verify ownership
    const existingJob = await prisma.jobOffer.findUnique({
      where: { id },
      select: { recruiterId: true },
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 });
    }

    if (existingJob.recruiterId !== session.user.id && user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé à supprimer cette offre' }, { status: 403 });
    }

    await prisma.jobOffer.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[RECRUITER_JOBS_DELETE]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
