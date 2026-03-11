import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { addCredits } from '@/lib/credits';

export async function GET(req: Request) {
  try {
    const session = await auth();
    // Véfirication admin basée sur le rôle ou l'email admin
    const isAdmin = session?.user?.role === 'ADMIN' || ['m9bikienga@gmail.com', 'optijob18@gmail.com'].includes(session?.user?.email || '');
    
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    // Fetch users
    const users = await prisma.user.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        // Using string keys logic instead of directly asking 'createdAt' if it causes TS bugs on  local build
      },
      take: 50 // Limit to 50 for performance
    });

    // Add a basic formatting for the date since select does not return native date on this schema apparently
    const usersList = await prisma.user.findMany({
        where: search ? { OR: [ { name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } } ] } : undefined,
        orderBy: { id: 'desc' },
        take: 50
    })
    
    // We fetch the full objects then map them securely
    const formattedUsers = usersList.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        credits: u.credits,
        createdAt: (u as any).createdAt || new Date().toISOString()
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('[ADMIN_USERS_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN' || ['m9bikienga@gmail.com', 'optijob18@gmail.com'].includes(session?.user?.email || '');
    
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { targetUserId, amount, type, description } = body;

    if (!targetUserId || !amount || !type) {
        return new NextResponse("Missing required fields", { status: 400 });
    }

    const result = await addCredits(targetUserId, Number(amount), type as any, description || 'Recharge Manuelle (Admin)');

    if (!result.success) {
         return new NextResponse("Failed to add credits", { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[ADMIN_CREDITS_POST]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
