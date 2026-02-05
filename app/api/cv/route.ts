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
    const { title, templateId, personalInfo, ...rest } = body;

    // Create CV in DB
    const cv = await prisma.cV.create({
      data: {
        title: title || 'Nouveau CV',
        content: body, // Store the full JSON
        userId: session.user.id
      }
    });

    return NextResponse.json(cv);
  } catch (error) {
    console.error('[CV_POST]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbCVs = await prisma.cV.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' }
    });

    // Transform DB format to frontend CV format
    // content contains the full CV data, we merge it with DB metadata
    const cvs = dbCVs.map(cv => ({
      ...(cv.content as object), // Spread the stored CV content
      id: cv.id,                 // Use DB id (source of truth)
      title: cv.title,           // Use DB title
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
    }));

    return NextResponse.json(cvs);
  } catch (error) {
    console.error('[CV_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
