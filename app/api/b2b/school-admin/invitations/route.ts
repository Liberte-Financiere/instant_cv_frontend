import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user || session.user.role !== 'SCHOOL_ADMIN' || !session.user.schoolId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const schoolId = session.user.schoolId;

    const invitations = await prisma.schoolInvitation.findMany({
      where: { schoolId },
      include: {
        acceptedByUser: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ invitations });

  } catch (error) {
    console.error('[SCHOOL_ADMIN_INVITATIONS_GET]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user || session.user.role !== 'SCHOOL_ADMIN' || !session.user.schoolId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const schoolId = session.user.schoolId;
    const { email } = await req.json();

    if (!email) {
       return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    // Check if a PENDING invitation already exists for this email
    const existingPending = await prisma.schoolInvitation.findFirst({
       where: {
          schoolId,
          email,
          status: 'PENDING'
       }
    });

    if (existingPending) {
       return NextResponse.json({ error: 'Une invitation en attente existe déjà pour cet email' }, { status: 409 });
    }

    // Generate clear code
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const clearCode = `JBS-${randomSuffix}`;

    // Hash the code
    const hashedCode = crypto.createHash('sha256').update(clearCode).digest('hex');

    // Store in DB
    const invitation = await prisma.schoolInvitation.create({
       data: {
          schoolId,
          codeHash: hashedCode,
          email,
          status: 'PENDING',
          // Default expiry 30 days
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
       }
    });

    return NextResponse.json({ 
       message: 'Invitation générée avec succès',
       clearCode, // ONLY RETURNED ONCE
       invitation
    });

  } catch (error) {
    console.error('[SCHOOL_ADMIN_INVITATIONS_POST]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
