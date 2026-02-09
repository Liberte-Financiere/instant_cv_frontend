import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { scrapeLinkedInProfile, extractLinkedInUsername } from '@/lib/linkedin-scraper';
import { z } from 'zod';

// Request validation schema
const requestSchema = z.object({
  linkedInUrl: z.string().min(1, 'LinkedIn URL is required')
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse and validate request body
    const body = await req.json();
    const validation = requestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { linkedInUrl } = validation.data;

    // Validate LinkedIn URL format
    const username = extractLinkedInUsername(linkedInUrl);
    if (!username) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn URL. Please use a URL like: https://linkedin.com/in/username' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.LINKEDIN_SCRAPER_API_KEY) {
      console.error('[LinkedIn Import] API key not configured');
      return NextResponse.json(
        { 
          error: 'LinkedIn import is not configured. Please contact support.',
          code: 'API_NOT_CONFIGURED'
        },
        { status: 503 }
      );
    }

    console.log('[LinkedIn Import] Processing URL:', linkedInUrl, '-> username:', username);

    // Scrape the profile
    const result = await scrapeLinkedInProfile(linkedInUrl);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log('[LinkedIn Import] Successfully fetched profile data');

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error: any) {
    console.error('[LinkedIn Import] Error:', error);
    
    // Handle rate limiting
    if (error.message?.includes('429') || error.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to import LinkedIn profile. Please try again.' },
      { status: 500 }
    );
  }
}
