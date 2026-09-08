import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generateAnnouncementEmail } from '@/lib/email-templates';
import { sendEmailViaService } from '@/lib/email-client';

/**
 * GET /api/admin/recruiters
 * List recruiter applications (Pending, Approved, Rejected)
 *
 * PATCH /api/admin/recruiters
 * Approve or Reject a recruiter application
 */

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status') || 'PENDING';

    const where: any = {};
    if (statusFilter !== 'ALL') {
      where.recruiterStatus = statusFilter;
    } else {
      where.recruiterStatus = { in: ['PENDING', 'APPROVED', 'REJECTED'] };
    }

    const recruiters = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        companySector: true,
        companyPhone: true,
        companyCity: true,
        companyCountry: true,
        companyWebsite: true,
        companyTaxId: true,
        companySize: true,
        recruiterStatus: true,
        recruiterRejectionReason: true,
        recruiterVerifiedAt: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ recruiters });
  } catch (error) {
    console.error('[ADMIN_RECRUITERS_GET]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, action, reason } = body;

    if (!userId || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, companyName: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    if (action === 'APPROVE') {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          role: 'RECRUITER',
          recruiterStatus: 'APPROVED',
          recruiterVerifiedAt: new Date(),
          recruiterRejectionReason: null,
          freeUnlocksUsed: 0,
        },
        select: { id: true, role: true, recruiterStatus: true, companyName: true },
      });

      // Send transactional notification email (asynchronous, non-blocking)
      if (targetUser.email) {
        try {
          const siteUrl = process.env.NEXTAUTH_URL || 'https://jobsira.com';
          const emailHtml = generateAnnouncementEmail({
            subject: 'Félicitations ! Votre compte recruteur Jobsira est validé',
            message: `Bonjour ${targetUser.name || ''},\n\nVotre dossier d'entreprise pour **${targetUser.companyName || 'votre société'}** a été validé avec succès par notre équipe.\n\nVous disposez dès maintenant de **3 déblocages de profils candidats offerts** pour tester la plateforme et entrer en contact avec les meilleurs talents.\n\n*Conseil :* Veuillez vous déconnecter puis vous reconnecter pour actualiser instantanément vos accès au portail recruteur.`,
            buttonText: 'Se connecter à mon espace',
            buttonUrl: `${siteUrl}/login?message=recruiter_approved`,
          });

          await sendEmailViaService({
            recipient: { email: targetUser.email, name: targetUser.name || undefined },
            subject: 'Félicitations ! Votre compte recruteur Jobsira est validé',
            html: emailHtml,
          });
        } catch (mailError) {
          console.error('[RECRUITER_APPROVAL_EMAIL_ERROR]', mailError);
        }
      }

      // Record audit log
      try {
        await prisma.auditLog.create({
          data: {
            adminId: session.user.id,
            targetId: userId,
            action: 'RECRUITER_APPROVE',
          },
        });
      } catch (auditErr) {
        console.error('[AUDIT_LOG_ERROR]', auditErr);
      }

      return NextResponse.json({
        message: 'Recruteur approuvé avec succès.',
        user: updated,
      });
    }

    if (action === 'REJECT') {
      const rejectionReason = reason?.trim() || "Informations d'entreprise incomplètes ou non vérifiables.";

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          role: 'USER',
          recruiterStatus: 'REJECTED',
          recruiterRejectionReason: rejectionReason,
        },
        select: { id: true, role: true, recruiterStatus: true },
      });

      // Send transactional rejection notification email
      if (targetUser.email) {
        try {
          const siteUrl = process.env.NEXTAUTH_URL || 'https://jobsira.com';
          const emailHtml = generateAnnouncementEmail({
            subject: 'Mise à jour concernant votre demande recruteur Jobsira',
            message: `Bonjour ${targetUser.name || ''},\n\nNous avons examiné votre demande d'accès au portail recruteur pour **${targetUser.companyName || 'votre structure'}**.\n\nNotre équipe n'a pas pu valider votre dossier pour le motif suivant :\n\n> *${rejectionReason}*\n\nVous pouvez corriger vos informations et soumettre à nouveau votre dossier en cliquant sur le lien ci-dessous.`,
            buttonText: 'Corriger mon dossier',
            buttonUrl: `${siteUrl}/recruiter/register`,
          });

          await sendEmailViaService({
            recipient: { email: targetUser.email, name: targetUser.name || undefined },
            subject: 'Mise à jour concernant votre demande recruteur Jobsira',
            html: emailHtml,
          });
        } catch (mailError) {
          console.error('[RECRUITER_REJECTION_EMAIL_ERROR]', mailError);
        }
      }

      // Record audit log
      try {
        await prisma.auditLog.create({
          data: {
            adminId: session.user.id,
            targetId: userId,
            action: 'RECRUITER_REJECT',
          },
        });
      } catch (auditErr) {
        console.error('[AUDIT_LOG_ERROR]', auditErr);
      }

      return NextResponse.json({
        message: 'Dossier recruteur rejeté.',
        user: updated,
      });
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
  } catch (error) {
    console.error('[ADMIN_RECRUITERS_PATCH]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
