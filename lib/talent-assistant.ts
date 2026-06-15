/**
 * Jobsira Talent Assistant
 *
 * AI-powered conversational assistant for the recruiter portal.
 * Uses Google Gemini with function calling to search the candidate database
 * based on natural language recruiter requests.
 *
 * Architecture:
 *   1. Recruiter sends a message in natural language.
 *   2. Gemini interprets the need and decides whether to call search_candidates.
 *   3. If called, searchCandidatesInternal() queries Prisma directly (no HTTP round-trip).
 *   4. Results are fed back to Gemini as a tool response.
 *   5. Gemini produces a final human-readable reply with recommendations.
 *
 * The compatibility score is computed server-side using a deterministic weight grid,
 * not by the LLM, to ensure consistency across calls.
 */

import { streamText, tool } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { APP_CONFIG } from '@/lib/config';

// -- Constants ----------------------------------------------------------------

const MAX_SEARCH_RESULTS = 10;
const MAX_CONTEXT_CHARS = 30_000;

// -- Types --------------------------------------------------------------------

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ScoredCandidate {
  id: string;
  anonymousName: string;
  title: string;
  sector: string | null;
  skills: string[];
  experienceYears: number;
  locationCity: string | null;
  locationCountry: string | null;
  completionScore: number;
  compatibilityScore: number;
  lastCvUpdate: Date | string;
  companies?: string[];
}

export interface AssistantResponse {
  reply: string;
  candidates: ScoredCandidate[];
  searchPerformed: boolean;
  searchParams: Record<string, any> | null;
}

export interface StreamEvent {
  type: 'text' | 'candidates' | 'error';
  data: any;
}

interface SearchParams {
  query: string;
  sector?: string;
  experienceMin?: number;
  experienceMax?: number;
  locationCity?: string;
  locationCountry?: string;
  skills?: string[];
}

interface RecruiterContext {
  recruiterCredits: number;
  freeUnlocksRemaining: number;
  unlockedProfileIds: string[];
}

// -- System Prompt ------------------------------------------------------------

function buildSystemPrompt(ctx: RecruiterContext): string {
  return `Tu es **Jobsira Talent Assistant**, l'agent IA integre a la plateforme Jobsira Talent.
Tu aides les recruteurs a trouver les meilleurs candidats dans la base de profils Jobsira,
en comprenant leur besoin en langage naturel et en le traduisant en recherches precises.

## TON ROLE

Tu es a la fois :
- Un **chasseur de tetes expert** : tu comprends les besoins metier, tu poses les bonnes questions,
  et tu identifies les profils reellement pertinents au-dela des mots-cles.
- Un **conseiller en recrutement** : tu expliques pourquoi un profil est pertinent,
  tu signales les points d'attention, et tu guides le recruteur dans ses decisions.
- Un **interprete contextuel** : tu comprends le marche de l'emploi africain francophone
  (Burkina Faso, Cote d'Ivoire, Senegal, Mali, etc.) et ses realites locales.

## PHASE 1 -- COMPREHENSION DU BESOIN

Quand un recruteur decrit son besoin, tu dois extraire :

### Criteres obligatoires (a clarifier si absents)
- **Poste / titre recherche** : ex. "Developpeur React", "Comptable", "Commercial terrain"
- **Secteur d'activite** : ex. "Tech", "Finance", "Agriculture", "Sante", "BTP"
- **Localisation** : ville et/ou pays

### Criteres optionnels (a inferer ou demander)
- Experience (nombre d'annees min/max)
- Competences techniques specifiques
- Niveau de formation
- Langues
- Type de contrat souhaite

### Regle de clarification
- **Dès que tu as des résultats de recherche**, tu DOIS impérativement les présenter et les justifier en premier.
- Seulement **à la fin de ton message**, tu peux poser une question de clarification (ex: localisation manquante) pour affiner la prochaine recherche.
- **IMPORTANT** : Si la recherche ne retourne aucun profil ("Aucun profil trouvé"), **ne refais pas de recherche en boucle**. Informe simplement l'utilisateur qu'il n'y a pas de résultat et demande-lui d'élargir ses critères.

## PHASE 2 -- RECHERCHE

Quand tu as suffisamment d'informations, appelle l'outil search_candidates avec les criteres extraits.

### Regles de traduction intelligente
- Un "junior" = 0-2 ans d'experience. Un "senior" = 5+ ans. Un "confirme" = 3-5 ans.
- "Ouaga" -> "Ouagadougou". Comprends les abreviations locales courantes.
- Un "developpeur full-stack" -> inclure skills : ["JavaScript", "HTML", "CSS", "Node.js"] ou similaires.
- Toujours privilegier une recherche **large** au premier essai, puis affiner si trop de resultats.
- **IMPORTANT** : Ne filtre JAMAIS arbitrairement sur l'experience (experienceMin/experienceMax) ou la localisation si l'utilisateur ne l'a pas explicitement demande. Si l'utilisateur donne juste un titre (ex: "DevSecOps"), lance la recherche avec UNIQUEMENT le mot-cle. En cas de doute ou de requete trop floue, pose une ou deux questions de clarification avant de lancer la recherche.

## PHASE 3 -- PRESENTATION DES RESULTATS

Pour chaque candidat retourne, presente-le de maniere claire et structuree :
- Son titre, localisation, experience, competences principales
- Pourquoi il est pertinent pour ce poste (explication convaincante, pas juste des donnees brutes)
- Les points d'attention eventuels (gaps, informations manquantes)
- Ta recommandation (Fortement recommande / A considerer / Profil interessant mais...)

### Regles de presentation
- Presente les **3 meilleurs profils** par defaut, dans l'ordre decroissant de pertinence.
- Si plus de 3 profils disponibles -> propose de voir les suivants.
- Si aucun profil trouve -> reformule la recherche en elargissant les criteres et reessaye automatiquement.
- Si peu de resultats en ville -> mentionne les profils dans d'autres villes du meme pays.

## PHASE 4 -- ACTIONS ET SUGGESTIONS PROACTIVES

Apres avoir presente les resultats, tu peux conseiller a l'utilisateur de :
1. Cliquer sur le profil et utiliser le bouton "Debloquer" de l'interface pour voir les coordonnees. (IMPORTANT: Tu ne peux PAS debloquer les profils toi-meme. Ne propose JAMAIS "Voulez-vous que je le debloque pour vous ?". Invite toujours l'utilisateur a le faire manuellement via l'interface du site).
2. Affiner la recherche avec toi.
3. Voir des profils similaires dans d'autres localisations.

## REGLES DE COMPORTEMENT

- Ne jamais reveler le nom, email ou telephone d'un profil non debloque.
- Ne pas poser plus de 2 questions de clarification d'affilee.
- Etre honnete sur les gaps d'un profil.
- Ne pas inciter a debloquer des profils non pertinents.
- Ton professionnel mais accessible, direct et oriente action.
- Utilise le vouvoiement par defaut.

## CONTEXTE RECRUTEUR ACTUEL

- Credits disponibles : ${ctx.recruiterCredits}
- Deblocages gratuits restants : ${ctx.freeUnlocksRemaining}
- Nombre de profils deja debloques : ${ctx.unlockedProfileIds.length}`;
}

// Tools are now defined directly in chatWithAssistant using Vercel AI SDK

// -- Compatibility Scoring (server-side, deterministic) -----------------------

/**
 * Computes a compatibility score (0-100) between a candidate profile
 * and the search parameters used by the recruiter.
 *
 * Weight grid:
 *   - Title/query match:   30 pts
 *   - Experience range:    20 pts
 *   - Skills overlap:      25 pts
 *   - Location match:      15 pts
 *   - Profile completeness: 10 pts
 */
function computeCompatibilityScore(
  candidate: {
    title: string;
    skills: string[];
    experienceYears: number;
    locationCity: string | null;
    locationCountry: string | null;
    completionScore: number;
  },
  params: SearchParams
): number {
  let score = 0;

  // Title/query match (30 pts)
  if (params.query) {
    const queryTerms = params.query.toLowerCase().split(/\s+/).filter(Boolean);
    const titleLower = candidate.title.toLowerCase();
    const matchCount = queryTerms.filter((term) => titleLower.includes(term)).length;
    const matchRatio = queryTerms.length > 0 ? matchCount / queryTerms.length : 0;
    score += Math.round(30 * matchRatio);
  } else {
    score += 15;
  }

  // Experience range (20 pts)
  if (params.experienceMin !== undefined || params.experienceMax !== undefined) {
    const min = params.experienceMin ?? 0;
    const max = params.experienceMax ?? 99;
    if (candidate.experienceYears >= min && candidate.experienceYears <= max) {
      score += 20;
    } else {
      const distance = candidate.experienceYears < min
        ? min - candidate.experienceYears
        : candidate.experienceYears - max;
      score += Math.max(0, 20 - distance * 5);
    }
  } else {
    score += 10;
  }

  // Skills overlap (25 pts)
  if (params.skills && params.skills.length > 0) {
    const candidateSkillsLower = candidate.skills.map((s) => s.toLowerCase());
    const matchedSkills = params.skills.filter((s) =>
      candidateSkillsLower.some((cs) => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs))
    );
    const overlapRatio = matchedSkills.length / params.skills.length;
    score += Math.round(25 * overlapRatio);
  } else {
    score += 12;
  }

  // Location match (15 pts)
  if (params.locationCity || params.locationCountry) {
    const cityMatch =
      params.locationCity &&
      candidate.locationCity &&
      candidate.locationCity.toLowerCase().includes(params.locationCity.toLowerCase());
    const countryMatch =
      params.locationCountry &&
      candidate.locationCountry &&
      candidate.locationCountry.toLowerCase().includes(params.locationCountry.toLowerCase());

    if (cityMatch) {
      score += 15;
    } else if (countryMatch) {
      score += 8;
    }
  } else {
    score += 7;
  }

  // Profile completeness (10 pts)
  score += Math.round((candidate.completionScore / 100) * 10);

  return Math.min(100, Math.max(0, score));
}

// -- Internal Search (direct Prisma, no HTTP) ---------------------------------

async function searchCandidatesInternal(
  params: SearchParams
): Promise<{ candidates: ScoredCandidate[]; total: number }> {
  const where: any = { isActive: true };

  if (params.sector) {
    where.sector = { equals: params.sector, mode: 'insensitive' };
  }

  if (params.experienceMin !== undefined || params.experienceMax !== undefined) {
    where.experienceYears = {};
    if (params.experienceMin !== undefined) where.experienceYears.gte = params.experienceMin;
    if (params.experienceMax !== undefined) where.experienceYears.lte = params.experienceMax;
  }

  if (params.locationCity) {
    where.locationCity = { contains: params.locationCity, mode: 'insensitive' };
  }

  if (params.locationCountry) {
    where.locationCountry = { contains: params.locationCountry, mode: 'insensitive' };
  }

  if (params.skills && params.skills.length > 0) {
    where.skills = { hasSome: params.skills };
  }

  if (params.query) {
    let closestIds: string[] = [];
    try {
      const { generateEmbedding } = await import('@/lib/ai/embeddings');
      const vector = await generateEmbedding(params.query);
      const vectorString = `[${vector.join(',')}]`;

      // Récupérer les profils sémantiquement proches
      const results = await prisma.$queryRawUnsafe<Array<{id: string, distance: number}>>(
        `SELECT "id", ("embedding" <=> '${vectorString}'::vector) as distance FROM "CandidateProfile" WHERE "isActive" = true ORDER BY distance ASC LIMIT 50`
      );
      
      closestIds = results.filter(r => r.distance < 0.40).map(r => r.id);
    } catch (err) {
      console.error("[HYBRID_SEARCH_BOT] Erreur lors de la génération du vecteur :", err);
    }

    const ftsQuery = params.query.trim().split(/\s+/).filter(Boolean).join(' | ');
    const orConditions: any[] = [];

    if (ftsQuery) {
      orConditions.push({ title: { search: ftsQuery } });
      orConditions.push({ sector: { search: ftsQuery } });
      orConditions.push({ anonymousName: { search: ftsQuery } });
      orConditions.push({
        anonymousData: {
          path: ['projects'],
          string_contains: params.query,
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
        anonymousData: true,
      },
      orderBy: [{ completionScore: 'desc' }, { lastCvUpdate: 'desc' }],
      take: MAX_SEARCH_RESULTS,
    }),
    prisma.candidateProfile.count({ where }),
  ]);

  const candidates: ScoredCandidate[] = profiles
    .map((profile) => {
      const data = profile.anonymousData as any;
      const experiences = Array.isArray(data?.experiences) ? data.experiences : [];
      const companies = experiences.map((e: any) => e.company).filter(Boolean);
      
      return {
        ...profile,
        companies,
        compatibilityScore: computeCompatibilityScore(profile, params),
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return { candidates, total };
}

// Truncate function simplified
function truncateHistory(messages: ChatMessage[]): { role: 'user' | 'assistant'; content: string }[] {
  // Keep the last 10 messages to avoid token bloat
  const recent = messages.slice(-10);
  return recent.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
}

// -- Main Chat Function -------------------------------------------------------

export async function* chatWithAssistant(
  message: string,
  history: ChatMessage[],
  recruiterContext: RecruiterContext
): AsyncGenerator<StreamEvent> {
  console.log('[GEMINI] Démarrage de chatWithAssistant via Vercel AI SDK.');
  const systemInstruction = buildSystemPrompt(recruiterContext);
  const apiKey = process.env.MY_GEMINI_KEY || process.env.GOOGLE_API_KEY || '';
  const google = createGoogleGenerativeAI({ apiKey });

  const formattedHistory = truncateHistory(history);
  let currentMessages: any[] = [...formattedHistory, { role: 'user', content: message }];
  let iteration = 0;
  const MAX_ITERATIONS = 3;

  try {
    while (iteration < MAX_ITERATIONS) {
      iteration++;
      console.log(`[GEMINI] Démarrage de l'itération ${iteration}...`);
      
      let allCandidates: ScoredCandidate[] = [];
      let toolCallDetected = false;
      let currentToolCallId = '';
      let currentToolArgs = {};
      let currentToolProviderOptions: any = undefined;
      let currentToolSummary = '';

      const result = streamText({
        model: google(APP_CONFIG.ai.models.fast),
        system: systemInstruction,
        messages: currentMessages,
        temperature: 0.7,
        tools: {
          search_candidates: {
            description: 'Recherche des candidats dans la base de profils Jobsira selon des criteres structures.',
            inputSchema: z.object({
              query: z.string().describe('Mots-cles principaux pour la recherche textuelle'),
              sector: z.string().optional().describe('Secteur d\'activite exact'),
              experienceMin: z.number().optional().describe('Experience minimum en annees'),
              experienceMax: z.number().optional().describe('Experience maximum en annees'),
              locationCity: z.string().optional().describe('Ville (ex: Abidjan, Dakar)'),
              locationCountry: z.string().optional().describe('Pays'),
              skills: z.array(z.string()).optional().describe('Liste des competences techniques'),
            }),
            execute: async (params: any) => {
              console.log(`[GEMINI] Exécution de la recherche DB avec : ${JSON.stringify(params)}`);
              const { candidates, total } = await searchCandidatesInternal(params as SearchParams);
              
              for (const c of candidates) {
                if (!allCandidates.find((existing) => existing.id === c.id)) {
                  allCandidates.push(c);
                }
              }

              const resultSummary = candidates.length === 0
                ? 'Aucun profil trouvé avec ces critères.'
                : `${total} profils trouvés pour cette requête. Voici les résultats :\n\n` +
                  candidates.map((c, i) =>
                    `Profil #${i + 1} (ID: ${c.id}):\n` +
                    `  Titre: ${c.title}\n` +
                    `  Secteur: ${c.sector || 'Non renseigné'}\n` +
                    `  Experience: ${c.experienceYears} ans\n` +
                    `  Localisation: ${c.locationCity || '?'}, ${c.locationCountry || '?'}\n` +
                    `  Competences: ${c.skills.slice(0, 8).join(', ')}\n` +
                    `  Score: ${c.compatibilityScore}/100`
                  ).join('\n\n');

              return { summary: resultSummary, newCandidates: allCandidates };
            }
          }
        }
      });

      for await (const part of result.fullStream) {
        if (part.type === 'text-delta') {
          yield { type: 'text', data: (part as any).textDelta || (part as any).text };
        } else if (part.type === 'tool-call') {
          toolCallDetected = true;
          currentToolCallId = part.toolCallId;
          currentToolArgs = (part as any).args || (part as any).input;
          currentToolProviderOptions = (part as any).providerOptions;
        } else if (part.type === 'tool-result' && part.toolName === 'search_candidates') {
          const toolOutput = (part as any).result || (part as any).output;
          currentToolSummary = toolOutput?.summary || '';
          const candidatesToYield = toolOutput?.newCandidates || [];
          
          if (candidatesToYield.length > 0) {
             yield { type: 'candidates', data: candidatesToYield };
          }
        } else if (part.type === 'error') {
          console.error('[GEMINI] Stream error part:', part.error);
          yield { type: 'error', data: "Erreur inattendue de l'IA." };
          return;
        }
      }

      if (toolCallDetected) {
        const toolCallPart: any = {
          type: 'tool-call',
          toolCallId: currentToolCallId,
          toolName: 'search_candidates',
          args: currentToolArgs,
          input: currentToolArgs
        };
        if (currentToolProviderOptions) {
          toolCallPart.providerOptions = currentToolProviderOptions;
        }

        currentMessages.push({
          role: 'assistant',
          content: [toolCallPart]
        });
        currentMessages.push({
          role: 'tool',
          content: [{
            type: 'tool-result',
            toolCallId: currentToolCallId,
            toolName: 'search_candidates',
            result: currentToolSummary,
            output: { type: 'text', value: currentToolSummary }
          }]
        });
      } else {
        // No tool called, generation is complete
        break;
      }
    }
  } catch (error: any) {
    console.error('[GEMINI_QUOTA_ERROR] Échec :', error);
    if (error?.status === 429 || error?.message?.includes('429')) {
      yield { type: 'error', data: "\n\nNotre assistant IA est actuellement très sollicité. Veuillez réessayer." };
    } else {
      throw error;
    }
  }
}
