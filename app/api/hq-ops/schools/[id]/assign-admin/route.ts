import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id: schoolId } = await context.params;
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'L\'adresse email est obligatoire.' },
        { status: 400 }
      );
    }

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { id: true, name: true, isActive: true },
    });

    if (!school) {
      return NextResponse.json({ error: 'École introuvable.' }, { status: 404 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: `Aucun utilisateur Jobsira trouvé avec l'email "${email}". L'utilisateur doit d'abord créer un compte.` },
        { status: 404 }
      );
    }

    const existingMembership = await prisma.schoolMembership.findUnique({
      where: {
        userId_schoolId: {
          userId: targetUser.id,
          schoolId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: `${targetUser.email} est déjà administrateur de cette école.` },
        { status: 409 }
      );
    }

    const otherMembership = await prisma.schoolMembership.findFirst({
      where: {
        userId: targetUser.id,
        schoolId: { not: schoolId },
      },
      include: {
        school: { select: { name: true } },
      },
    });

    if (otherMembership) {
      return NextResponse.json(
        { error: `${targetUser.email} est déjà affilié à une autre école (${otherMembership.school.name}). Retirez-le d'abord avant de le réaffecter.` },
        { status: 409 }
      );
    }

    const membership = await prisma.$transaction(async (tx) => {
      const newMembership = await tx.schoolMembership.create({
        data: {
          userId: targetUser.id,
          schoolId,
          role: 'SCHOOL_ADMIN',
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          school: { select: { id: true, name: true } },
        },
      });

      await tx.user.update({
        where: { id: targetUser.id },
        data: {
          role: 'SCHOOL_ADMIN',
          schoolId,
        },
      });

      return newMembership;
    });

    return NextResponse.json({ membership }, { status: 201 });
  } catch (error) {
    console.error('[HQ-OPS/SCHOOLS/ASSIGN-ADMIN] POST error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
