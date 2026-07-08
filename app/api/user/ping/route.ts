import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    // We fetch the current user to verify if the last activity was updated less than 24 hours ago
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastActivity: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const now = new Date();
    // 24 hours throttle server-side
    if (user.lastActivity) {
      const timeDiffMs = now.getTime() - user.lastActivity.getTime();
      const hoursDiff = timeDiffMs / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        // Activity already recorded in the last 24h, return early
        return NextResponse.json({ success: true, status: 'throttled' });
      }
    }

    // Update the lastActivity field
    await prisma.user.update({
      where: { id: userId },
      data: { lastActivity: now },
    });

    return NextResponse.json({ success: true, status: 'updated' });
  } catch (error) {
    console.error('[USER_ACTIVITY_PING]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
