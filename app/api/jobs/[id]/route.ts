import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await prisma.jobOffer.findUnique({
      where: { 
        id,
        status: 'ACTIVE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      // We return the full details, including applyUrlOrMail
    });

    if (!job) {
      return NextResponse.json({ error: 'Offre introuvable ou fermée' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('[PUBLIC_JOB_GET]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
