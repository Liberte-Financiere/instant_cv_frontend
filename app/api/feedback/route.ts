import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const feedbackSchema = z.object({
  content: z.string().min(10, 'Le commentaire doit comporter au moins 10 caractères').max(1000, 'Le commentaire est trop long'),
  rating: z.number().int().min(1).max(5).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // Rate limit: 1 feedback per minute
  const rateCheck = checkRateLimit(`${session.user.id}:feedback-submit`, { limit: 1, windowMs: 60_000 });
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Veuillez patienter avant de soumettre un autre avis.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const validatedData = feedbackSchema.parse(body);

    const feedback = await prisma.platformFeedback.create({
      data: {
        userId: session.user.id,
        content: validatedData.content,
        rating: validatedData.rating,
        // isVisible defaults to false
      },
    });

    return NextResponse.json({ success: true, feedback }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const zodErr = error as any;
      return NextResponse.json({ error: zodErr.errors[0].message }, { status: 400 });
    }
    console.error('[Feedback API] Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la soumission de l avis' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const visibleOnly = searchParams.get('all') !== 'true'; // Set all=true to get everything (admin only)

    // For public testimonials, we want to fetch the ones that are marked as visible.
    // If we want all and it's an admin requesting (need to verify role), we can return more.
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';

    // If a non-admin requests `all=true`, we force visibility filter anyway.
    const shouldFetchAll = isAdmin && !visibleOnly;

    const feedbacks = await prisma.platformFeedback.findMany({
      where: shouldFetchAll ? {} : { isVisible: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            jobTitle: true,
            sector: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    console.error('[Feedback API] Fetch Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des avis' }, { status: 500 });
  }
}
