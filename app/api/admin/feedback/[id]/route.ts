import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { isVisible } = await req.json();

    if (typeof isVisible !== 'boolean') {
      return NextResponse.json({ error: 'Valeur isVisible invalide' }, { status: 400 });
    }

    const updatedFeedback = await prisma.platformFeedback.update({
      where: { id },
      data: { isVisible },
    });

    return NextResponse.json({ success: true, feedback: updatedFeedback });
  } catch (error) {
    console.error('[Admin Feedback API] Update Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de l avis' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.platformFeedback.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Admin Feedback API] Delete Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression de l avis' }, { status: 500 });
  }
}
