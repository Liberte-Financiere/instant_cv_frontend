import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

import { checkAndConsumeCredits } from '@/lib/credits';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, title, content } = body;

    let isNew = false;
    if (id) {
       const existing = await prisma.coverLetter.findUnique({ where: { id } });
       if (!existing) isNew = true;
    } else {
       isNew = true;
    }

    if (isNew) {
      try {
        await checkAndConsumeCredits(session.user.id, 'CREATE_LETTER', 'Création d\'une lettre de motivation');
      } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Crédits insuffisants' }, { status: 403 });
      }
    }

    const cl = await prisma.coverLetter.create({
      data: {
        id: id,
        title: title || 'Nouvelle Lettre de Motivation',
        content: content || body,
        userId: session.user.id
      }
    });

    return NextResponse.json(cl);
  } catch (error) {
    console.error('[COVER_LETTER_POST]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cls = await prisma.coverLetter.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(cls);
  } catch (error) {
    console.error('[COVER_LETTER_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
