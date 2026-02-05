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
    
    // Ensure user owns the CV
    const cv = await prisma.cV.findUnique({
      where: { id, userId: session.user.id }
    });

    if (!cv) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(cv);
  } catch (error) {
    console.error('[CV_GET_ID]', error);
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
    
    // Check if CV exists
    const existingCV = await prisma.cV.findUnique({
      where: { id },
      select: { userId: true }
    });

    let cv;

    if (existingCV) {
      // If it exists, verify ownership
      if (existingCV.userId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 });
      }

      // Safe update
      cv = await prisma.cV.update({
        where: { id },
        data: {
          title: body.title || 'Mon CV',
          content: body,
          updatedAt: new Date(),
        }
      });
    } else {
      // Use create instead of upsert for new records
      cv = await prisma.cV.create({
        data: {
          id, // Keep the same ID from local storage
          title: body.title || 'Mon CV',
          content: body,
          userId: session.user.id,
        }
      });
    }

    return NextResponse.json(cv);
  } catch (error) {
    console.error('[CV_PUT]', error);
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
    
    await prisma.cV.delete({
      where: { id, userId: session.user.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CV_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
