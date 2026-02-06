import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

import { cvSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // Validate body (we use partial because helper IDs or extra UI states might not be in schema, 
    // or we can use .passthrough() if we want to allow extras. 
    // Ideally we strictly validate key structure.)
    // Note: dates are strings in JSON, schema allows string | date.
    
    // For creation, we expect at least a title and some structure.
    const validation = cvSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse("Invalid CV Data: " + JSON.stringify(validation.error.format()), { status: 400 });
    }

    const validData = validation.data;
    const { id, title, ...rest } = validData;

    // Create CV in DB with the same ID as frontend
    const cv = await prisma.cV.create({
      data: {
        id: id, 
        title: title || 'Nouveau CV',
        // Zod validated data is a strict object, satisfying InputJsonValue
        content: validData, 
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

    const { searchParams } = new URL(req.url);
    const summary = searchParams.get('summary') === 'true';

    // Retrieve CVs using selection if summary is requested
    const dbCVs = await prisma.cV.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      select: summary ? {
         id: true,
         title: true,
         createdAt: true,
         updatedAt: true,
         isPublic: true,
         views: true,
         // content is excluded by default when using select
      } : undefined
    });

    // Transform DB format to frontend CV format
    const cvs = dbCVs.map(cv => {
      if (summary) {
        return {
          id: cv.id,
          title: cv.title,
          updatedAt: cv.updatedAt,
          createdAt: cv.createdAt,
          isPublic: cv.isPublic,
          views: cv.views,
          // Minimal mock content to satisfy type if needed, or handle partial type in frontend
          templateId: 'modern', // Default for summary list
          personalInfo: {}, 
        };
      }
      
      // Full fetch
      // Content is now automatically typed by Prisma extension
      const content = cv.content; 

      return {
        ...(content as any), // Spread content (typed but spread needs check)
        id: cv.id,
        title: cv.title,
        updatedAt: cv.updatedAt,
        createdAt: cv.createdAt,
        isPublic: cv.isPublic,
        views: cv.views,
      };
    });

    return NextResponse.json(cvs);
  } catch (error) {
    console.error('[CV_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
