import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    // Verification Admin
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { targetUserId, isBanned } = await req.json();

    if (!targetUserId || typeof isBanned !== 'boolean') {
      return NextResponse.json({ error: 'Missing targetUserId or isBanned flag.' }, { status: 400 });
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { isBanned },
      select: { isBanned: true }
    });

    return NextResponse.json({ success: true, isBanned: updatedUser.isBanned });
  } catch (error) {
    console.error('[ADMIN_BAN_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
