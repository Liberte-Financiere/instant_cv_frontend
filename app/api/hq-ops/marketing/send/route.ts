import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getHtmlForTemplate } from '@/lib/email-templates';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const count = await prisma.user.count({
      where: { acceptsMarketing: true, email: { not: null } }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Erreur API Marketing GET:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { subject, message, templateId = 'annonce', targetAudience = 'all', buttonText, buttonUrl, externalEmails = [] } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ error: 'Sujet et message requis' }, { status: 400 });
    }

    const htmlContent = getHtmlForTemplate(templateId, { subject, message, buttonText, buttonUrl });

    // 1. Récupérer les emails des abonnés Jobsira (opt-in) seulement si on ne cible pas le segment de test
    let dbEmails: string[] = [];
    if (targetAudience !== 'test') {
      const users = await prisma.user.findMany({
        where: { acceptsMarketing: true, email: { not: null } },
        select: { email: true }
      });
      dbEmails = users.map(u => u.email).filter(Boolean) as string[];
    }

    // 2. Fusionner et dé-dupliquer (DB + Externes)
    const allEmails = Array.from(new Set([...dbEmails, ...externalEmails]));

    if (allEmails.length === 0) {
      return NextResponse.json({ error: 'Aucun destinataire valide trouvé. Veuillez ajouter des emails personnalisés si vous êtes en mode test.' }, { status: 400 });
    }

    // 1. Récupération de la clé API depuis .env
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      return NextResponse.json({ error: "La clé BREVO_API_KEY n'est pas configurée sur le serveur." }, { status: 500 });
    }

    // 2. Envoi des emails via l'API Brevo (Sendinblue)
    // Pour ne pas que les utilisateurs voient les adresses des autres,
    // on s'envoie le mail à nous-mêmes (to) et on met tout le monde en copie cachée (bcc).
    // Note : Brevo limite souvent le nombre de destinataires par requête, 
    // pour de grandes listes il faudra faire un système de lots (batches) ou utiliser l'API Campagnes.
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify({
        sender: { name: 'Jobsira', email: 'contact@jobsira.com' },
        to: [{ email: 'contact@jobsira.com', name: 'L\'équipe Jobsira' }],
        bcc: allEmails.map(email => ({ email })),
        subject: subject,
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur Brevo API:', errorData);
      return NextResponse.json({ error: 'Erreur lors de la communication avec Brevo' }, { status: 500 });
    }

    // 3. Sauvegarder l'historique dans la base de données
    await prisma.marketingCampaign.create({
      data: {
        name: subject, // On utilise le sujet comme nom par défaut s'il n'est pas fourni
        subject: subject,
        content: message,
        type: 'Newsletter',
        status: 'sent',
        targetAudience: 'all',
        externalEmails: externalEmails,
        sentAt: new Date(),
        recipientsCount: allEmails.length
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Campagne envoyée avec succès à ${allEmails.length} abonné(s) !` 
    });

  } catch (error) {
    console.error('Erreur API Marketing POST:', error);
    return NextResponse.json({ error: "Erreur serveur lors de l'envoi" }, { status: 500 });
  }
}
