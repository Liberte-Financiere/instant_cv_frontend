import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/recruiter/analytics
 *
 * Dedicated SQL aggregation endpoint for recruiter performance metrics.
 * Offloads sum/count operations to PostgreSQL instead of in-memory JS processing.
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const userId = session.user.id;

    // Parallel SQL execution for fast analytics aggregation
    const [jobAggregates, activeJobs, totalApplications, topJobs] = await Promise.all([
      // 1. Total jobs count, sum of views and clicks
      prisma.jobOffer.aggregate({
        where: { recruiterId: userId },
        _count: { id: true },
        _sum: { viewsCount: true, clicksCount: true },
      }),
      // 2. Count of currently active job offers
      prisma.jobOffer.count({
        where: { recruiterId: userId, status: 'ACTIVE' },
      }),
      // 3. Count of all candidate applications received across user's jobs
      prisma.jobApplication.count({
        where: { jobOffer: { recruiterId: userId } },
      }),
      // 4. Top 5 performing jobs by views with deterministic fallback sort
      prisma.jobOffer.findMany({
        where: { recruiterId: userId },
        orderBy: [{ viewsCount: 'desc' }, { id: 'desc' }],
        take: 5,
        select: {
          id: true,
          title: true,
          viewsCount: true,
          clicksCount: true,
          status: true,
        },
      }),
    ]);

    const totalJobs = jobAggregates._count.id || 0;
    const totalViews = jobAggregates._sum.viewsCount || 0;
    const totalClicks = jobAggregates._sum.clicksCount || 0;
    const conversionRate = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;

    return NextResponse.json({
      totalJobs,
      activeJobs,
      totalViews,
      totalClicks,
      totalApplications,
      conversionRate,
      topJobs,
    });
  } catch (error) {
    console.error('[RECRUITER_ANALYTICS_ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
