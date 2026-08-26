import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import { sendEmailViaService } from '@/lib/email-client';

const applicationSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(5, "Numéro de téléphone requis"),
  cvUrl: z.string().url("Le lien du CV est invalide").optional(), // Making optional in Zod because we check manually below
  coverLetter: z.string().optional(),
  coverLetterUrl: z.string().url("Lien de lettre invalide").optional(),
  portfolioUrl: z.string().url("Lien de portfolio invalide").optional(),
  diplomaUrl: z.string().url("Lien de diplôme invalide").optional(),
  availability: z.string().min(2, "La disponibilité est requise"),
  salaryExpectation: z.string().optional(),
  experienceYears: z.number().int().min(0).optional(),
  profileSummary: z.string().optional(),
  hasConsent: z.literal(true, {
    message: "Vous devez accepter les conditions pour postuler"
  })
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    // Validate the job offer
    const jobOffer = await prisma.jobOffer.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!jobOffer) {
      return NextResponse.json({ error: 'Offre non trouvée' }, { status: 404 });
    }

    if (jobOffer.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Cette offre n\'accepte plus de candidatures' }, { status: 400 });
    }

    if (jobOffer.maxApplications && jobOffer._count.applications >= jobOffer.maxApplications) {
      return NextResponse.json({ error: 'Le nombre maximum de candidatures pour cette offre a été atteint' }, { status: 400 });
    }

    const json = await req.json();
    const result = applicationSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: 'Données invalides', details: result.error.format() }, { status: 400 });
    }

    const { hasConsent, ...applicationData } = result.data;

    // Strict validation against requestedFiles
    const requested = jobOffer.requestedFiles || [];
    if (requested.includes('CV') && !applicationData.cvUrl) {
      return NextResponse.json({ error: 'Le CV est obligatoire pour cette offre.' }, { status: 400 });
    }
    if (requested.includes('COVER_LETTER') && !applicationData.coverLetterUrl) {
      return NextResponse.json({ error: 'La lettre de motivation est obligatoire.' }, { status: 400 });
    }
    if (requested.includes('PORTFOLIO') && !applicationData.portfolioUrl) {
      return NextResponse.json({ error: 'Le portfolio est obligatoire.' }, { status: 400 });
    }
    if (requested.includes('DIPLOMA') && !applicationData.diplomaUrl) {
      return NextResponse.json({ error: 'Le diplôme est obligatoire.' }, { status: 400 });
    }

    // Check if user already applied with this email
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobOfferId: id,
        email: applicationData.email
      }
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'Vous avez déjà postulé à cette offre avec cette adresse email.' }, { status: 400 });
    }

    const application = await prisma.jobApplication.create({
      data: {
        ...applicationData,
        cvUrl: applicationData.cvUrl || '', // Fallback to empty string if no CV is required
        jobOfferId: id,
        userId: session?.user?.id || null,
        hasConsent: true,
      },
    });

    // Auto-désactivation de l'offre si le quota est atteint
    if (jobOffer.maxApplications && jobOffer._count.applications + 1 >= jobOffer.maxApplications) {
      await prisma.jobOffer.update({
        where: { id },
        data: { status: 'CLOSED' }
      });
    }

    // Send confirmation email asynchronously (no await or ignoring result so it doesn't block response)
    sendEmailViaService({
      recipient: { email: application.email, name: application.firstName },
      subject: `Confirmation de candidature - ${jobOffer.title}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Bonjour ${application.firstName},</h2>
          <p>Nous vous confirmons la bonne réception de votre candidature pour le poste de <strong>${jobOffer.title}</strong> chez <strong>${jobOffer.company}</strong>.</p>
          <p>Le recruteur a été notifié et étudiera votre profil avec attention. Si votre candidature est retenue, il vous contactera directement.</p>
          <br/>
          <p>L'équipe JobSira</p>
        </div>
      `
    }).catch(console.error);

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('[APPLY_POST]', error);
    
    // Check for Prisma Unique Constraint Violation (P2002)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Vous avez déjà postulé à cette offre avec cette adresse email.' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
