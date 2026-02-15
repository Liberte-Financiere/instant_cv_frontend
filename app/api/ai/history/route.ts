import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const history = await prisma.analysisHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, type, title, score, data, date } = body;

    // Use upsert to handle sync (if ID exists, update; else create)
    // Client generates ID (UUID), so we can respect it or let DB handle it.
    // If client generates ID, we should use it. Cuid is default but we can provide string ID.

    const entry = await prisma.analysisHistory.upsert({
      where: { id: id || '' }, // If ID is empty string, it won't be found, so it will create. But upsert requires valid where unique.
      
      create: {
        id: id, // Trust client ID
        userId: session.user.id,
        type,
        title,
        score,
        data: data,
        createdAt: new Date(date),
      },
      update: {
        type,
        title,
        score,
        data: data,
      },
      // Note: No second 'where' clause needed here
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error saving history:', error);
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
  }
}
