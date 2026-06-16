import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Fetch the latest logs
    const logs = await prisma.aILog.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });

    const totalLogs = await prisma.aILog.count();

    // Fetch KPIs (Last 24h & Global)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      requests24h,
      errors24h,
      avgLatencyRaw,
      topModels
    ] = await Promise.all([
      prisma.aILog.count({ where: { createdAt: { gte: yesterday } } }),
      prisma.aILog.count({ where: { createdAt: { gte: yesterday }, status: 'error' } }),
      prisma.aILog.aggregate({
        _avg: { latencyMs: true },
        where: { status: 'success' }
      }),
      prisma.aILog.groupBy({
        by: ['model'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1
      })
    ]);

    const errorRate24h = requests24h > 0 ? (errors24h / requests24h) * 100 : 0;
    const avgLatency = avgLatencyRaw._avg.latencyMs || 0;
    const topModel = topModels.length > 0 ? topModels[0].model : 'N/A';

    return NextResponse.json({
      logs,
      pagination: {
        total: totalLogs,
        limit,
        offset
      },
      kpis: {
        requests24h,
        errorRate24h,
        avgLatency,
        topModel
      }
    });
  } catch (error: any) {
    console.error('[ADMIN_API] AI Logs Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
