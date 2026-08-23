import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to map Go API types to human readable labels
const getJobTypeLabel = (type: string) => {
  switch (type) {
    case 'JOB_LOCAL': return 'Emploi Local';
    case 'JOB_INTERNATIONAL': return 'Emploi International';
    case 'INTERNSHIP': return 'Stage';
    case 'SCHOLARSHIP': return 'Bourse';
    case 'CALL_FOR_TENDERS': return 'Appel d\'offres';
    default: return type || 'Autre';
  }
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Check if it's a scraped job from the Go Microservice
    if (id.startsWith('ext-')) {
      const goId = id.replace('ext-', '');
      const res = await fetch(`http://127.0.0.1:8080/api/v1/opportunities/${goId}`, {
        cache: 'no-store'
      });
      
      if (!res.ok) {
        return NextResponse.json({ error: 'Offre introuvable' }, { status: res.status });
      }

      const goData = await res.json();
      const job = goData.data;

      // Handle dual application links
      const applicationEmail = job.application_email || null;
      const applicationUrl = job.application_url || job.source_url || null;

      // Legacy fallback
      const applyMethod = applicationEmail ? 'EMAIL' : 'URL';
      const applyUrlOrMail = applicationEmail || applicationUrl || '';

      const mappedJob = {
        id: `ext-${job.id}`,
        title: job.title,
        company: job.organization || 'Non spécifié',
        location: job.location || (job.city ? `${job.city}, ${job.country}` : job.country) || 'Non spécifié',
        type: getJobTypeLabel(job.opportunity_type),
        salary: null,
        description: job.description_text || job.description_html || 'Pas de description.',
        requirements: [], 
        applyMethod,
        applyUrlOrMail,
        applicationEmail, // New: explicit email
        applicationUrl,   // New: explicit url
        createdAt: job.published_at,
        expiresAt: job.closing_date,
        source: 'SCRAPED',
        workMode: job.work_mode
      };

      // Trigger tracking view in the background (fire and forget)
      fetch(`http://127.0.0.1:8080/api/v1/opportunities/${goId}/view`, { method: 'POST' }).catch(() => {});

      return NextResponse.json(mappedJob);
    }

    // 2. Fetch from Prisma (Native Jobs)
    const job = await prisma.jobOffer.findUnique({
      where: { 
        id,
        status: 'ACTIVE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Offre introuvable ou fermée' }, { status: 404 });
    }

    // Incrémenter les vues pour les offres natives en arrière-plan
    prisma.jobOffer.update({
      where: { id },
      data: { viewsCount: { increment: 1 } }
    }).catch((err) => console.error('[NATIVE_JOB_VIEW_TRACKING_ERROR]', err));

    return NextResponse.json({ ...job, source: 'NATIVE' });
  } catch (error) {
    console.error('[PUBLIC_JOB_GET]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Only scraped jobs have external click tracking implemented via Go right now
    if (id.startsWith('ext-')) {
      const goId = id.replace('ext-', '');
      // Fire and forget
      fetch(`http://127.0.0.1:8080/api/v1/opportunities/${goId}/click`, { method: 'POST' }).catch(() => {});
    } else {
      // Incrémenter les clics pour les offres natives
      prisma.jobOffer.update({
        where: { id },
        data: { clicksCount: { increment: 1 } }
      }).catch((err) => console.error('[NATIVE_JOB_CLICK_TRACKING_ERROR]', err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
