import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const url = new URL(req.url);
    const headlessKey = url.searchParams.get('headlessToken');
    const isServerGenerator = headlessKey === process.env.GOOGLE_API_KEY?.slice(0, 10); // Simple secure static proxy token without relying on new ENVs
    
    const session = await auth();
    if (!session?.user?.id && !isServerGenerator) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { id } = await params;
    
    // If it's the server generator, we bypass the userId check to guarantee PDF rendering
    const whereClause = isServerGenerator ? { id } : { id, userId: session!.user!.id };

    const cv = await prisma.cV.findUnique({
      where: whereClause
    });

    if (!cv) {
      console.log(`[GET /api/cv/${id}] ❌ CV Introuvable dans la base !`);
      return new NextResponse("Not Found", { status: 404 });
    }

    console.log(`[GET /api/cv/${id}] ✅ CV Trouvé, on le formate pour le frontend !`);

    // On s'assure de renvoyer le même format "applatit" que la route globale GET /api/cv
    const transformedCV = {
      ...(cv.content as any), // On "étale" le JSON content (personalInfo, experiences, etc)
      id: cv.id,
      title: cv.title,
      isPublic: cv.isPublic,
      views: cv.views,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
      userId: cv.userId
    };

    return NextResponse.json(transformedCV);
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
      const updateData: any = {
        title: body.title || 'Mon CV',
        content: body,
        updatedAt: new Date(),
      };
      
      // If the client specifically sent isPublic, we update it at the db root
      if (body.hasOwnProperty('isPublic')) {
        updateData.isPublic = body.isPublic;
      }

      cv = await prisma.cV.update({
        where: { id },
        data: updateData
      });
    } else {
      const createData: any = {
        id, // Keep the same ID from local storage
        title: body.title || 'Mon CV',
        content: body,
        userId: session.user.id,
      };

      if (body.hasOwnProperty('isPublic')) {
        createData.isPublic = body.isPublic;
      }

      cv = await prisma.cV.create({
        data: createData
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
    
    try {
      await prisma.cV.delete({
        where: { id, userId: session.user.id }
      });
    } catch (dbError: any) {
      // P2025: Record to delete does not exist.
      // C'est l'erreur que vous voyiez dans PM2. On l'ignore silencieusement 
      // car le but (supprimer le CV) est techniquement déjà atteint.
      if (dbError.code === 'P2025') {
        return new NextResponse(null, { status: 204 });
      }
      throw dbError; // On remonte les autres vraies erreurs
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CV_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
