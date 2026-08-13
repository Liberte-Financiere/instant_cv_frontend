import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const schools = await prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creditWallet: {
          select: { balance: true, totalBought: true, totalUsed: true },
        },
        _count: {
          select: { users: true, invitations: true, memberships: true },
        },
      },
    });

    return NextResponse.json({ schools });
  } catch (error) {
    console.error('[HQ-OPS/SCHOOLS] GET error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, contactEmail, logoUrl } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Le nom et le slug de l\'école sont obligatoires.' },
        { status: 400 }
      );
    }

    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Le slug ne doit contenir que des lettres minuscules, chiffres et tirets.' },
        { status: 400 }
      );
    }

    const existingSchool = await prisma.school.findUnique({ where: { slug } });
    if (existingSchool) {
      return NextResponse.json(
        { error: `Une école avec le slug "${slug}" existe déjà.` },
        { status: 409 }
      );
    }

    const school = await prisma.$transaction(async (tx) => {
      const newSchool = await tx.school.create({
        data: {
          name,
          slug,
          contactEmail: contactEmail || null,
          logoUrl: logoUrl || null,
        },
      });

      await tx.schoolCreditWallet.create({
        data: {
          schoolId: newSchool.id,
          balance: 0,
          totalBought: 0,
          totalUsed: 0,
        },
      });

      return tx.school.findUnique({
        where: { id: newSchool.id },
        include: {
          creditWallet: {
            select: { balance: true, totalBought: true, totalUsed: true },
          },
          _count: {
            select: { users: true, invitations: true, memberships: true },
          },
        },
      });
    });

    return NextResponse.json({ school }, { status: 201 });
  } catch (error) {
    console.error('[HQ-OPS/SCHOOLS] POST error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
