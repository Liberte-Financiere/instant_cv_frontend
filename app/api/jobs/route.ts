import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to map Go API types to human readable labels
const getJobTypeLabel = (type: string) => {
  switch (type) {
    case 'JOB_LOCAL': return 'Emploi Local';
    case 'JOB_INTERNATIONAL': return 'Emploi International';
    case 'INTERNSHIP': return 'Stage';
    case 'SCHOLARSHIP': return 'Bourse';
    case 'CALL_FOR_TENDERS': return 'Appel d\'offres';
    default: return type || 'Autre';
  }
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const location = searchParams.get('location') || '';
    const sector = searchParams.get('sector') || '';
    
    // Pagination params
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    // 1. FETCH FROM PRISMA (Native / Premium Jobs)
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

    if (type && !['JOB_LOCAL', 'JOB_INTERNATIONAL', 'INTERNSHIP', 'SCHOLARSHIP', 'CALL_FOR_TENDERS'].includes(type)) {
       whereClause.type = type;
    }

    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' };
    }

    const prismaJobs = await prisma.jobOffer.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        type: true,
        salary: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    const nativeJobs = prismaJobs.map(job => ({
      ...job,
      source: 'NATIVE'
    }));

    // 2. FETCH FROM GO MICROSERVICE (Scraped Jobs)
    let goJobs: any[] = [];
    try {
      const goParams = new URLSearchParams();
      if (search) goParams.append('search', search); 
      if (type) goParams.append('type', type);
      if (location) goParams.append('location', location);
      if (sector) goParams.append('sector', sector);
      
      goParams.append('page', page.toString());
      goParams.append('limit', limit.toString());

      const goRes = await fetch(`http://127.0.0.1:8080/api/v1/opportunities?${goParams.toString()}`, {
        cache: 'no-store'
      });
      
      if (goRes.ok) {
        const goData = await goRes.json();
        if (goData.data) {
          goJobs = goData.data.map((job: any) => ({
            id: `ext-${job.id}`,
            title: job.title,
            company: job.organization || 'Non spécifié',
            location: job.city ? `${job.city}, ${job.country}` : (job.country || 'Non spécifié'),
            type: getJobTypeLabel(job.opportunity_type),
            salary: null,
            createdAt: job.published_at,
            expiresAt: job.deadline, 
            source: 'SCRAPED',
            workMode: job.work_mode
          }));
        }
      }
    } catch (goError) {
      console.error('[PUBLIC_JOBS_GET] Go API Error:', goError);
    }

    // 3. MERGE AND RETURN (Native jobs first)
    const allJobs = [...nativeJobs, ...goJobs];

    return NextResponse.json({
      data: allJobs,
      page,
      limit,
      hasMore: nativeJobs.length === limit || goJobs.length === limit
    });
  } catch (error) {
    console.error('[PUBLIC_JOBS_GET]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
