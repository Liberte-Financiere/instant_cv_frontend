import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { addCredits } from '@/lib/credits';

export async function GET(req: Request) {
  try {
    const session = await auth();
    // Vérification admin basée sur le rôle
    const isAdmin = session?.user?.role === 'ADMIN';
    
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    // Fetch users
    const usersList = await prisma.user.findMany({
        where: search ? { OR: [ { name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } } ] } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 50
    })
    
    // We fetch the full objects then map them securely
    const formattedUsers = usersList.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        credits: u.credits,
        role: u.role,
        isBanned: u.isBanned,
        createdAt: u.createdAt || new Date().toISOString()
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
    const isAdmin = session?.user?.role === 'ADMIN';
    
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
