import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const jobOfferSchema = z.object({
  title: z.string().min(2, "Le titre doit faire au moins 2 caractères"),
  company: z.string().min(2, "L'entreprise doit faire au moins 2 caractères"),
  location: z.string().optional(),
  type: z.enum(['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance']),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  requirements: z.array(z.string()).default([]),
  salary: z.string().optional(),
  applyMethod: z.enum(['URL', 'EMAIL']),
  applyUrlOrMail: z.string().min(1, "Un lien ou un email est requis"),
  expiresAt: z.string().optional().transform(val => val ? new Date(val) : undefined),
});

// GET: Lister les annonces publiées par le recruteur
export async function GET() {
  try {
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

    const jobs = await prisma.jobOffer.findMany({
      where: { recruiterId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('[RECRUITER_JOBS_GET]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST: Créer une nouvelle offre d'emploi
export async function POST(req: Request) {
  try {
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

    const json = await req.json();
    const result = jobOfferSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: 'Données invalides', details: result.error.format() }, { status: 400 });
    }

    const jobOffer = await prisma.jobOffer.create({
      data: {
        ...result.data,
        recruiterId: session.user.id,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json(jobOffer, { status: 201 });
  } catch (error) {
    console.error('[RECRUITER_JOBS_POST]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
