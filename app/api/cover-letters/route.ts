import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, title, content } = body;

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
