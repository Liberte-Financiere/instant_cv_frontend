import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// Cache en mémoire pour les requêtes lourdes (VPS persistant)
const statsCache = new Map<string, { data: any; expiresAt: number }>();

function getCachedStats(key: string) {
  const entry = statsCache.get(key);
  if (entry && Date.now() < entry.expiresAt) return entry.data;
  return null;
}

function setCachedStats(key: string, data: any, ttlMinutes = 15) {
  statsCache.set(key, { data, expiresAt: Date.now() + ttlMinutes * 60 * 1000 });
}

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

    // Gestion du cache pour les KPIs et le total (valide 15 min)
    const CACHE_KEY = 'admin_ai_kpis';
    let kpiData = getCachedStats(CACHE_KEY);

    if (!kpiData) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const [
        totalLogsRaw,
        requests24hRaw,
        errors24hRaw,
        avgLatencyRaw,
        topModels
      ] = await Promise.all([
        prisma.aILog.count(),
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

      const errorRate24hRaw = requests24hRaw > 0 ? (errors24hRaw / requests24hRaw) * 100 : 0;
      const avgLatencyValue = avgLatencyRaw._avg.latencyMs || 0;
      const topModelRaw = topModels.length > 0 ? topModels[0].model : 'N/A';

      kpiData = {
        totalLogs: totalLogsRaw,
        kpis: {
          requests24h: requests24hRaw,
          errorRate24h: errorRate24hRaw,
          avgLatency: avgLatencyValue,
          topModel: topModelRaw
        }
      };

      setCachedStats(CACHE_KEY, kpiData, 15); // Cache de 15 minutes
    }

    return NextResponse.json({
      logs,
      pagination: {
        total: kpiData.totalLogs,
        limit,
        offset
      },
      kpis: kpiData.kpis
    });
  } catch (error: any) {
    console.error('[ADMIN_API] AI Logs Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
