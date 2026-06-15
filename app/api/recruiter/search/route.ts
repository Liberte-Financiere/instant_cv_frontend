/**
 * GET /api/recruiter/search
 *
 * Public endpoint: no authentication required.
 * Searches the CandidateProfile table with filters and pagination.
 * Returns anonymized results only (no PII).
 *
 * Rate-limited by IP to prevent scraping.
 *
 * Query params:
 *   q         - Free text search (matched against title, skills, sector)
 *   sector    - Filter by sector (exact match)
 *   minExp    - Minimum years of experience
 *   maxExp    - Maximum years of experience
 *   minScore  - Minimum completion score (0-100)
 *   city      - Filter by city (case-insensitive contains)
 *   country   - Filter by country (case-insensitive contains)
 *   skills    - Comma-separated skill names (at least one must match)
 *   page      - Page number (1-indexed, default: 1)
 *   limit     - Results per page (default: 20, max: 50)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

const SEARCH_RATE_LIMIT = { limit: 30, windowMs: 60_000 };
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export async function GET(req: Request) {
  try {
    // Rate limit by IP
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const rateLimitKey = `recruiter-search:${ip}`;
    const rateCheck = checkRateLimit(rateLimitKey, SEARCH_RATE_LIMIT);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez dans quelques secondes.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil(rateCheck.resetIn / 1000)) },
        }
      );
    }

    const { searchParams } = new URL(req.url);

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10)));
    const skip = (page - 1) * limit;

    // Build Prisma where clause
    const where: any = { isActive: true };

    // Sector filter
    const sector = searchParams.get('sector');
    if (sector) {
      where.sector = { equals: sector, mode: 'insensitive' };
    }

    // Experience range
    const minExp = searchParams.get('minExp');
    const maxExp = searchParams.get('maxExp');
    if (minExp || maxExp) {
      where.experienceYears = {};
      if (minExp) where.experienceYears.gte = parseInt(minExp, 10);
      if (maxExp) where.experienceYears.lte = parseInt(maxExp, 10);
    }

    // Minimum completion score
    const minScore = searchParams.get('minScore');
    if (minScore) {
      where.completionScore = { gte: parseInt(minScore, 10) };
    }

    // City filter
    const city = searchParams.get('city');
    if (city) {
      where.locationCity = { contains: city, mode: 'insensitive' };
    }

    // Country filter
    const country = searchParams.get('country');
    if (country) {
      where.locationCountry = { contains: country, mode: 'insensitive' };
    }

    // Skills filter (at least one must match)
    const skillsParam = searchParams.get('skills');
    if (skillsParam) {
      const skillList = skillsParam.split(',').map(s => s.trim()).filter(Boolean);
      if (skillList.length > 0) {
        where.skills = { hasSome: skillList };
      }
    }

    // Free text search (title, sector, projects) + Vector Semantic Search
    const query = searchParams.get('q');
    if (query) {
      const ftsQuery = query.trim().split(/\s+/).filter(Boolean).join(' | ');
      
      // 1. Semantic Search (Vecteurs)
      let closestIds: string[] = [];
      try {
        const { generateEmbedding } = await import('@/lib/ai/embeddings');
        const vector = await generateEmbedding(query);
        const vectorString = `[${vector.join(',')}]`;

        // Récupérer les 100 profils les plus sémantiquement proches (distance cosine < 0.55)
        const results = await prisma.$queryRawUnsafe<Array<{id: string, distance: number}>>(
          `SELECT "id", ("embedding" <=> '${vectorString}'::vector) as distance FROM "CandidateProfile" WHERE "isActive" = true ORDER BY distance ASC LIMIT 100`
        );
        
        closestIds = results.filter(r => r.distance < 0.55).map(r => r.id);
      } catch (err) {
        console.error("[HYBRID_SEARCH] Erreur lors de la génération du vecteur pour la recherche :", err);
      }

      // 2. Hybrid combinaison (Full Text Search classique OU Sémantique)
      const orConditions: any[] = [];
      
      if (ftsQuery) {
        orConditions.push({ title: { search: ftsQuery } });
        orConditions.push({ sector: { search: ftsQuery } });
        orConditions.push({ anonymousName: { search: ftsQuery } });
        orConditions.push({
          anonymousData: {
            path: ['projects'],
            string_contains: query,
          },
        });
      }
      
      if (closestIds.length > 0) {
        orConditions.push({ id: { in: closestIds } });
      }

      if (orConditions.length > 0) {
        where.OR = orConditions;
      }
    }

    // Execute query with count
    const [profiles, total] = await Promise.all([
      prisma.candidateProfile.findMany({
        where,
        select: {
          id: true,
          anonymousName: true,
          title: true,
          sector: true,
          skills: true,
          experienceYears: true,
          locationCity: true,
          locationCountry: true,
          completionScore: true,
          lastCvUpdate: true,
          createdAt: true,
          anonymousData: true,
        },
        orderBy: [
          { completionScore: 'desc' },
          { lastCvUpdate: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.candidateProfile.count({ where }),
    ]);

    const formattedProfiles = profiles.map((profile) => {
      const data = profile.anonymousData as any;
      const rawProjects = Array.isArray(data?.projects) ? data.projects : [];
      const projects = rawProjects.map((proj: any) => ({
        name: proj.name || '',
        description: proj.description || '',
        technologies: proj.technologies || '',
        url: proj.url || undefined,
        github: proj.github || undefined,
      }));

      return {
        id: profile.id,
        anonymousName: profile.anonymousName,
        title: profile.title,
        sector: profile.sector,
        skills: profile.skills,
        experienceYears: profile.experienceYears,
        locationCity: profile.locationCity,
        locationCountry: profile.locationCountry,
        completionScore: profile.completionScore,
        lastCvUpdate: profile.lastCvUpdate,
        createdAt: profile.createdAt,
        projects,
      };
    });

    return NextResponse.json({
      profiles: formattedProfiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[RECRUITER_SEARCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
