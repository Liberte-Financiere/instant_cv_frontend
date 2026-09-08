import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'RECRUITER' && user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès réservé aux recruteurs' }, { status: 403 });
    }



    // Verify ownership of the job offer
    const jobOffer = await prisma.jobOffer.findUnique({
      where: { id },
      select: { recruiterId: true },
    });

    if (!jobOffer) {
      return NextResponse.json({ error: 'Offre non trouvée' }, { status: 404 });
    }

    if (jobOffer.recruiterId !== session.user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Action non autorisée' }, { status: 403 });
    }

    // URL query parameters for pagination & filtering
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const statusParam = searchParams.get('status');
    const searchParam = (searchParams.get('q') || searchParams.get('search') || '').trim();
    const expParam = searchParams.get('exp');
    const dateParam = searchParams.get('date');

    const where: any = { jobOfferId: id };

    // Filter by status
    if (statusParam && ['NEW', 'REVIEWING', 'RETAINED', 'REJECTED'].includes(statusParam)) {
      where.status = statusParam;
    }

    // Filter by name or email
    if (searchParam) {
      where.OR = [
        { firstName: { contains: searchParam, mode: 'insensitive' } },
        { lastName: { contains: searchParam, mode: 'insensitive' } },
        { email: { contains: searchParam, mode: 'insensitive' } },
      ];
    }

    // Filter by experience level
    if (expParam === 'JUNIOR') {
      where.experienceYears = { lte: 2 };
    } else if (expParam === 'MED') {
      where.experienceYears = { gte: 3, lte: 5 };
    } else if (expParam === 'SENIOR') {
      where.experienceYears = { gt: 5 };
    }

    // Filter by submission date
    if (dateParam === 'TODAY') {
      where.createdAt = { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };
    } else if (dateParam === 'WEEK') {
      where.createdAt = { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    } else if (dateParam === 'MONTH') {
      where.createdAt = { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    // Fetch paginated applications and total count concurrently
    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        orderBy: [
          { createdAt: 'desc' },
          { id: 'desc' },
        ],
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              image: true,
            },
          },
        },
      }),
      prisma.jobApplication.count({ where }),
    ]);

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('[RECRUITER_APPLICATIONS_GET]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
