import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    if (!session || !session.user || session.user.role !== 'SCHOOL_ADMIN' || !session.user.schoolId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const schoolId = session.user.schoolId;
    const resolvedParams = await params;
    const invitationId = resolvedParams.id;

    // Fetch the invitation to verify ownership and status
    const invitation = await prisma.schoolInvitation.findUnique({
       where: { id: invitationId }
    });

    if (!invitation || invitation.schoolId !== schoolId) {
       return NextResponse.json({ error: 'Invitation introuvable' }, { status: 404 });
    }

    // A school admin should only be able to revoke PENDING invitations.
    // If ACCEPTED, they should use the student detach API.
    if (invitation.status !== 'PENDING') {
       return NextResponse.json({ error: 'Seules les invitations en attente peuvent être révoquées' }, { status: 400 });
    }

    const updatedInvitation = await prisma.schoolInvitation.update({
       where: { id: invitationId },
       data: { status: 'REVOKED' }
    });

    return NextResponse.json({ 
       message: 'Invitation révoquée avec succès',
       invitation: updatedInvitation
    });

  } catch (error) {
    console.error('[SCHOOL_ADMIN_INVOCATIONS_REVOKE]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
