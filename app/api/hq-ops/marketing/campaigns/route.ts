import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const campaigns = await prisma.marketingCampaign.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Erreur API Marketing Campaigns GET:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const data = await req.json();
    const { name, subject, preheader, content, type, status, targetAudience, externalEmails } = data;

    if (!name || !subject || !content) {
      return NextResponse.json({ error: 'Nom, sujet et contenu requis' }, { status: 400 });
    }

    const campaign = await prisma.marketingCampaign.create({
      data: {
        name,
        subject,
        preheader,
        content,
        type: type || 'Newsletter',
        status: status || 'draft',
        targetAudience: targetAudience || 'all',
        externalEmails: externalEmails || [],
      }
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error('Erreur API Marketing Campaigns POST:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de la création' }, { status: 500 });
  }
}
