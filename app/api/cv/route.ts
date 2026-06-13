import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

import { cvSchema } from '@/lib/schemas';

import { checkAndConsumeCredits } from '@/lib/credits';
import { sanitizeCVData } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const sanitizedBody = sanitizeCVData(body);
    const validation = cvSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      return new NextResponse("Invalid CV Data: " + JSON.stringify(validation.error.format()), { status: 400 });
    }

    const validData = validation.data;
    const { id, title, ...rest } = validData;

    // Check if CV already exists (meaning it's an update, not a creation)
    // We only consume credits ON CREATION
    let isNew = false;
    if (id) {
       const existing = await prisma.cV.findUnique({ where: { id } });
       if (!existing) isNew = true;
    } else {
       isNew = true;
    }

    if (isNew) {
      try {
        await checkAndConsumeCredits(session.user.id, 'CREATE_CV', 'Création d\'un nouveau CV');
      } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Crédits insuffisants' }, { status: 403 });
      }
    }

    // Create CV in DB with the same ID as frontend
    const cv = await prisma.cV.create({
      data: {
        id: id, 
        title: title || 'Nouveau CV',
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

    // Always fetch content to extract minimal data like templateId and personalInfo.firstName/title
    const dbCVs = await prisma.cV.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' }
    });

    // Transform DB format to frontend CV format
    const cvs = dbCVs.map(cv => {
      const content = (cv.content as any) || {};

      if (summary) {
        // Strip out heavy arrays and base64 strings
        const {
          experiences,
          education,
          projects,
          certifications,
          skills,
          languages,
          references,
          hobbies,
          qualities,
          ...lightweightContent
        } = content;

        // Remove potentially large base64 strings from personalInfo and footer
        const minimalPersonalInfo = { ...lightweightContent.personalInfo };
        delete minimalPersonalInfo.photoUrl;

        const minimalFooter = { ...lightweightContent.footer };
        delete minimalFooter.signatureUrl;

        return {
          ...lightweightContent,
          personalInfo: minimalPersonalInfo,
          footer: minimalFooter,
          id: cv.id,
          title: cv.title,
          updatedAt: cv.updatedAt,
          createdAt: cv.createdAt,
          isPublic: cv.isPublic,
          isSearchable: cv.isSearchable,
          views: cv.views,
        };
      }
      
      // Full fetch
      return {
        ...content,
        id: cv.id,
        title: cv.title,
        updatedAt: cv.updatedAt,
        createdAt: cv.createdAt,
        isPublic: cv.isPublic,
        isSearchable: cv.isSearchable,
        views: cv.views,
      };
    });

    return NextResponse.json(cvs);
  } catch (error) {
    console.error('[CV_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
