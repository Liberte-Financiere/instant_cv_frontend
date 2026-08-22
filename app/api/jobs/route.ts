import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const location = searchParams.get('location') || '';

    const whereClause: any = {
      status: 'ACTIVE',
      AND: [
        {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      ]
    };

    if (search) {
      whereClause.AND.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      });
    }

    if (type) {
      whereClause.type = type;
    }

    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' };
    }

    const jobs = await prisma.jobOffer.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        type: true,
        salary: true,
        createdAt: true,
        expiresAt: true,
        // We do NOT select applyUrlOrMail in the list, they have to click on the job to see it.
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('[PUBLIC_JOBS_GET]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
