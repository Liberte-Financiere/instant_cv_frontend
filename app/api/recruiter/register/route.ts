/**
 * POST /api/recruiter/register
 *
 * Authenticated endpoint: requires logged-in user.
 * Submits a recruiter registration dossier for manual Admin approval.
 *
 * Supports both multipart/form-data (with direct document upload)
 * and application/json (legacy & automated tests).
 *
 * Status lifecycle:
 *   NONE -> PENDING (upon registration)
 *   PENDING -> APPROVED (by Admin in HQ Ops)
 *   PENDING -> REJECTED (by Admin in HQ Ops with reason)
 *   REJECTED -> PENDING (upon re-submission)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import { APP_CONFIG } from '@/lib/config';
import { uploadBufferToCloudinary } from '@/lib/cloudinary';
import { generateAnnouncementEmail } from '@/lib/email-templates';
import { sendEmailViaService } from '@/lib/email-client';

const registerSchema = z.object({
  companyName: z.string().min(2, "Le nom de l'entreprise doit comporter au moins 2 caractères").max(100),
  companySector: z.string().min(2, "Le secteur d'activité est requis").max(100),
  companyPhone: z.string().min(6, "Le numéro de téléphone professionnel est requis").max(30),
  companyCity: z.string().min(2, "La ville est requise").max(100),
  companyCountry: z.string().min(2, "Le pays est requis").max(100),
  companyWebsite: z.string().optional().or(z.literal('')).refine(
    (val) => !val || /^https?:\/\//i.test(val),
    { message: "L'adresse du site web doit commencer par http:// ou https://" }
  ),
  companyTaxId: z.string().optional().or(z.literal('')), // RCCM / IFU optionnel
  companySize: z.string().optional().or(z.literal('')),
  companyDescription: z.string().max(500, "La description ne doit pas dépasser 500 caractères").optional().or(z.literal('')),
  companyDocumentUrl: z.string().optional().or(z.literal('')),
});

const ALLOWED_DOCUMENT_MIMES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5 Mo

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    // Admin cannot register as recruiter
    if (session.user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Un administrateur ne peut pas soumettre un dossier recruteur.' },
        { status: 403 }
      );
    }

    // Fetch current user from DB to check current state
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        recruiterStatus: true,
        companyDocumentUrl: true,
        name: true,
        email: true,
      },
    });

    if (currentUser?.role === 'RECRUITER' && currentUser?.recruiterStatus === 'APPROVED') {
      return NextResponse.json(
        { error: 'Vous êtes déjà inscrit et validé en tant que recruteur.' },
        { status: 409 }
      );
    }

    if (currentUser?.recruiterStatus === 'PENDING') {
      return NextResponse.json(
        { error: 'Votre dossier est déjà en cours de vérification par nos équipes.' },
        { status: 409 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    let rawPayload: Record<string, any> = {};
    let newlyUploadedDocUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      rawPayload = {
        companyName: (formData.get('companyName') as string) || '',
        companySector: (formData.get('companySector') as string) || '',
        companyPhone: (formData.get('companyPhone') as string) || '',
        companyCity: (formData.get('companyCity') as string) || '',
        companyCountry: (formData.get('companyCountry') as string) || '',
        companyWebsite: (formData.get('companyWebsite') as string) || '',
        companyTaxId: (formData.get('companyTaxId') as string) || '',
        companySize: (formData.get('companySize') as string) || '',
        companyDescription: (formData.get('companyDescription') as string) || '',
      };

      const documentFile = formData.get('companyDocument') as File | null;
      if (documentFile && typeof documentFile === 'object' && documentFile.size > 0) {
        // Validate MIME type
        if (!ALLOWED_DOCUMENT_MIMES.includes(documentFile.type)) {
          return NextResponse.json(
            { error: 'Format de document non autorisé. Formats acceptés : PDF, JPEG, PNG, WebP.' },
            { status: 400 }
          );
        }

        // Validate file size
        if (documentFile.size > MAX_DOCUMENT_SIZE) {
          return NextResponse.json(
            { error: 'Le document justificatif est trop volumineux (maximum 5 Mo).' },
            { status: 400 }
          );
        }

        // Stream direct to Cloudinary in company documents folder
        const arrayBuffer = await documentFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await uploadBufferToCloudinary(
          buffer,
          APP_CONFIG.uploadFolders.companyDocuments,
          'auto'
        );
        newlyUploadedDocUrl = uploadResult.secure_url;
      }
    } else {
      // JSON body (automated tests & direct API calls)
      const body = await req.json();
      rawPayload = body || {};
      if (typeof rawPayload.companyDocumentUrl === 'string' && rawPayload.companyDocumentUrl.trim().length > 0) {
        newlyUploadedDocUrl = rawPayload.companyDocumentUrl.trim();
      }
    }

    const result = registerSchema.safeParse(rawPayload);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || 'Données invalides';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = result.data;
    const finalDocumentUrl = newlyUploadedDocUrl || currentUser?.companyDocumentUrl || null;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        companyName: data.companyName.trim(),
        companySector: data.companySector.trim(),
        companyPhone: data.companyPhone.trim(),
        companyCity: data.companyCity.trim(),
        companyCountry: data.companyCountry.trim(),
        companyWebsite: data.companyWebsite?.trim() || null,
        companyTaxId: data.companyTaxId?.trim() || null,
        companySize: data.companySize?.trim() || null,
        companyDescription: data.companyDescription?.trim() || null,
        companyDocumentUrl: finalDocumentUrl,
        recruiterStatus: 'PENDING',
        recruiterRejectionReason: null,
      },
      select: {
        id: true,
        companyName: true,
        recruiterStatus: true,
        companyDescription: true,
        companyDocumentUrl: true,
      },
    });

    // Notify Jobsira HQ Ops team asynchronously (fire-and-forget, non-blocking)
    try {
      const siteUrl = process.env.NEXTAUTH_URL || 'https://jobsira.com';
      const opsEmail = process.env.OPS_NOTIFICATION_EMAIL || process.env.SUPPORT_EMAIL || 'admin@jobsira.com';
      const applicantName = currentUser?.name || session.user.name || 'Utilisateur';
      const applicantEmail = currentUser?.email || session.user.email || 'Email non renseigné';

      const emailHtml = generateAnnouncementEmail({
        subject: `Nouveau dossier recruteur déposé : ${data.companyName}`,
        message: `Un nouveau dossier de compte recruteur vient d'être soumis sur Jobsira et attend votre validation dans HQ Ops :\n\n- **Entreprise :** ${data.companyName}\n- **Secteur :** ${data.companySector}\n- **Localisation :** ${data.companyCity}, ${data.companyCountry}\n- **Téléphone pro :** ${data.companyPhone}\n- **Demandeur :** ${applicantName} (${applicantEmail})\n- **Justificatif légal :** ${finalDocumentUrl ? 'Document joint fourni' : 'Non joint'}\n\nCliquez sur le bouton ci-dessous pour examiner les pièces et statuer sur ce dossier.`,
        buttonText: 'Examiner le dossier dans HQ Ops',
        buttonUrl: `${siteUrl}/dashboard/hq-ops/recruiters`,
      });

      sendEmailViaService({
        recipient: { email: opsEmail, name: 'Jobsira HQ Ops' },
        subject: `[HQ Ops] Nouveau dossier recruteur : ${data.companyName}`,
        html: emailHtml,
      }).catch((err) => console.error('[OPS_REGISTRATION_EMAIL_ERROR]', err));
    } catch (notificationErr) {
      console.error('[OPS_NOTIFICATION_PREPARE_ERROR]', notificationErr);
    }

    return NextResponse.json({
      message: 'Votre dossier a été soumis avec succès. Notre équipe le valide sous 24h ouvrées.',
      user: updatedUser,
      status: 'PENDING',
    });
  } catch (error) {
    console.error('[RECRUITER_REGISTER]', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}
