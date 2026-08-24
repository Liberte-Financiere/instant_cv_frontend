import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ appId: string; docType: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { appId, docType } = await params;
    const userRole = session.user.role;

    // Fetch the application and its related job offer
    const application = await prisma.jobApplication.findUnique({
      where: { id: appId },
      include: {
        jobOffer: {
          select: { recruiterId: true }
        }
      }
    });

    if (!application) {
      return NextResponse.json({ error: 'Candidature non trouvée' }, { status: 404 });
    }

    // Security check: Only the recruiter of the job, the candidate themselves, or an ADMIN can view it
    const isRecruiter = application.jobOffer.recruiterId === session.user.id;
    const isCandidate = application.userId === session.user.id;
    const isAdmin = userRole === 'ADMIN';

    if (!isRecruiter && !isCandidate && !isAdmin) {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 });
    }

    // Determine which URL to fetch based on docType
    let targetUrl: string | null | undefined = null;
    const type = docType.toLowerCase();
    
    if (type === 'cv') targetUrl = application.cvUrl;
    else if (type === 'cover-letter') targetUrl = application.coverLetterUrl;
    else if (type === 'portfolio') targetUrl = application.portfolioUrl;
    else if (type === 'diploma') targetUrl = application.diplomaUrl;
    
    if (!targetUrl) {
      return NextResponse.json({ error: 'Document non fourni' }, { status: 404 });
    }

    console.log('[PROXY] Fetching URL:', targetUrl);
    // Fetch the file from Cloudinary (or whichever external host)
    const cloudinaryResponse = await fetch(targetUrl);
    
    if (!cloudinaryResponse.ok) {
      console.error('[PROXY] Cloudinary fetch failed:', cloudinaryResponse.status, cloudinaryResponse.statusText);
      const errorText = await cloudinaryResponse.text();
      console.error('[PROXY] Error details:', errorText);
      return NextResponse.json({ error: 'Erreur lors de la récupération du fichier distant' }, { status: 502 });
    }

    const buffer = await cloudinaryResponse.arrayBuffer();
    const contentType = cloudinaryResponse.headers.get('content-type') || 'application/octet-stream';

    // Extract extension to name the file properly if downloaded
    const urlObj = new URL(targetUrl);
    const extension = urlObj.pathname.includes('.') ? urlObj.pathname.substring(urlObj.pathname.lastIndexOf('.')) : '.pdf';

    // Return the file buffer with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
        'Content-Disposition': `inline; filename="${type}${extension}"`
      },
    });

  } catch (error) {
    console.error('[PROXY_GET_ERROR]', error);
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 });
  }
}
