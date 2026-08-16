import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmailViaService } from '@/lib/email-client';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Sécurité
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
    }

    // 2. Fetch les emails QUEUED ou FAILED (attempts < 3) avec un emailCode non null
    const invitationsToProcess = await prisma.schoolInvitation.findMany({
      where: {
        OR: [
          { emailStatus: 'QUEUED' },
          { 
            emailStatus: 'FAILED',
            emailAttempts: { lt: 3 }
          }
        ],
        email: { not: null },
        emailCode: { not: null }
      },
      include: {
        school: true
      },
      take: 50,
    });

    if (invitationsToProcess.length === 0) {
      return NextResponse.json({ status: 'ok', message: 'No emails to process' });
    }

    // 3. Marquer comme SENDING pour bloquer les autres workers
    const ids = invitationsToProcess.map(inv => inv.id);
    await prisma.schoolInvitation.updateMany({
        where: { id: { in: ids } },
        data: { emailStatus: 'SENDING' }
    });

    let sentCount = 0;
    let failedCount = 0;

    // 4. Process each email
    for (const invitation of invitationsToProcess) {
       try {
           if (!invitation.email || !invitation.emailCode) continue;

           // Call the email microservice
           await sendEmailViaService({
               recipient: {
                   email: invitation.email,
                   name: `${invitation.firstName || ''} ${invitation.lastName || ''}`.trim() || undefined
               },
               templateId: 'b2b_invitation',
               data: {
                   nom: invitation.lastName || '',
                   prenom: invitation.firstName || '',
                   school_name: invitation.school.name,
                   code: invitation.emailCode,
                   url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://jobsira.com'}/register`
               }
           });

           // Si l'envoi réussit :
           await prisma.schoolInvitation.update({
               where: { id: invitation.id },
               data: {
                   emailStatus: 'SENT',
                   emailSentAt: new Date(),
                   emailCode: null, // On supprime le secret en clair !
                   emailError: null
               }
           });
           
           sentCount++;
           
       } catch (error: any) {
           console.error(`Failed to send email for invitation ${invitation.id}:`, error);
           // Update failure status
           await prisma.schoolInvitation.update({
               where: { id: invitation.id },
               data: {
                   emailStatus: 'FAILED',
                   emailAttempts: { increment: 1 },
                   emailError: error.message || String(error)
               }
           });
           failedCount++;
       }
    }

    // Optional: Récupération des SENDING bloqués depuis trop longtemps (> 10 mins)
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    await prisma.schoolInvitation.updateMany({
        where: {
            emailStatus: 'SENDING',
            updatedAt: { lt: tenMinsAgo }
        },
        data: {
            emailStatus: 'QUEUED'
        }
    });

    return NextResponse.json({ status: 'ok', sent: sentCount, failed: failedCount });

  } catch (error) {
    console.error('Process emails cron error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
