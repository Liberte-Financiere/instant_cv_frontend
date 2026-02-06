import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
    
    const { id } = await params;
    
    const cl = await prisma.coverLetter.findUnique({
      where: { id, userId: session.user.id }
    });

    if (!cl) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(cl);
  } catch (error) {
    console.error('[COVER_LETTER_GET_ID]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const body = await req.json();
    
    const existingCL = await prisma.coverLetter.findUnique({
      where: { id },
      select: { userId: true }
    });

    let cl;

    if (existingCL) {
      if (existingCL.userId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 });
      }

      cl = await prisma.coverLetter.update({
        where: { id },
        data: {
          title: body.title,
          content: body.content || body,
          updatedAt: new Date(),
        }
      });
    } else {
      cl = await prisma.coverLetter.create({
        data: {
          id,
          title: body.title || 'Ma Lettre',
          content: body.content || body,
          userId: session.user.id,
        }
      });
    }

    return NextResponse.json(cl);
  } catch (error) {
    console.error('[COVER_LETTER_PUT]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    
    await prisma.coverLetter.delete({
      where: { id, userId: session.user.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[COVER_LETTER_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
