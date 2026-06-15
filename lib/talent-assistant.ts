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

import {
  GoogleGenerativeAI,
  SchemaType,
  Content,
  FunctionDeclaration,
  Tool,
  FunctionCallingMode,
} from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { APP_CONFIG } from '@/lib/config';

// Global genAI removed

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
- Si le besoin est **suffisamment clair** (poste + localisation identifies) -> lance la recherche directement.
- Si le besoin est **trop vague** -> pose au maximum **2 questions ciblees** avant de lancer la recherche.

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

// -- Gemini Tool Declaration --------------------------------------------------

const SEARCH_CANDIDATES_DECLARATION: FunctionDeclaration = {
  name: 'search_candidates',
  description:
    'Recherche des candidats dans la base de profils Jobsira selon des criteres structures. ' +
    'Utilise cet outil quand tu as suffisamment d\'informations pour lancer une recherche.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      query: {
        type: SchemaType.STRING,
        description: 'Mots-cles principaux pour la recherche textuelle (titre, secteur, projets)',
      },
      sector: {
        type: SchemaType.STRING,
        description: 'Secteur d\'activite exact (ex: Tech, Finance, Sante, BTP, Agriculture)',
      },
      experienceMin: {
        type: SchemaType.INTEGER,
        description: 'Nombre minimum d\'annees d\'experience',
      },
      experienceMax: {
        type: SchemaType.INTEGER,
        description: 'Nombre maximum d\'annees d\'experience',
      },
      locationCity: {
        type: SchemaType.STRING,
        description: 'Ville de localisation (recherche partielle, ex: Ouagadougou, Abidjan)',
      },
      locationCountry: {
        type: SchemaType.STRING,
        description: 'Pays de localisation (ex: Burkina Faso, Cote d\'Ivoire)',
      },
      skills: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: 'Liste de competences techniques recherchees',
      },
    },
    required: ['query'],
  },
};

const SEARCH_TOOL: Tool = {
  functionDeclarations: [SEARCH_CANDIDATES_DECLARATION],
};

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
    const ftsQuery = params.query.trim().split(/\s+/).filter(Boolean).join(' | ');
    if (ftsQuery) {
      where.OR = [
        { title: { search: ftsQuery } },
        { sector: { search: ftsQuery } },
        { anonymousName: { search: ftsQuery } },
        {
          anonymousData: {
            path: ['projects'],
            string_contains: params.query,
          },
        },
      ];
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

// -- Conversation History Formatting ------------------------------------------

/**
 * Truncates conversation history to stay within a character budget.
 * Keeps the most recent messages, discarding older ones first.
 */
function truncateHistory(messages: ChatMessage[]): Content[] {
  const contents: Content[] = [];
  let totalChars = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const charCount = msg.content.length;

    if (totalChars + charCount > MAX_CONTEXT_CHARS) {
      break;
    }

    totalChars += charCount;
    contents.unshift({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  }

  // Gemini expects history to start with a user message
  if (contents.length > 0 && contents[0].role === 'model') {
    contents.shift();
  }

  return contents;
}

// -- Main Chat Function -------------------------------------------------------

export async function* chatWithAssistant(
  message: string,
  history: ChatMessage[],
  recruiterContext: RecruiterContext
): AsyncGenerator<StreamEvent> {
  console.log('[GEMINI] Démarrage de chatWithAssistant. Initialisation du modèle...');
  const systemInstruction = buildSystemPrompt(recruiterContext);
  const apiKey = process.env.MY_GEMINI_KEY || process.env.GOOGLE_API_KEY || '';
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: APP_CONFIG.ai.models.fast,
    systemInstruction,
    tools: [SEARCH_TOOL],
    toolConfig: {
      functionCallingConfig: {
        mode: FunctionCallingMode.AUTO,
      },
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  });

  const formattedHistory = truncateHistory(history);
  console.log(`[GEMINI] Historique tronqué. Envoi de ${formattedHistory.length} éléments de contexte au modèle.`);
  const chat = model.startChat({ history: formattedHistory });

  let currentStream;
  console.log('[GEMINI] Envoi de la requête de flux initiale pour le message :', message.substring(0, 50) + '...');
  try {
    currentStream = await chat.sendMessageStream(message);
    console.log('[GEMINI] Requête de flux initiale réussie.');
  } catch (error: any) {
    console.error('[GEMINI_QUOTA_ERROR] Échec du flux initial :', error);
    if (error?.status === 429 || error?.message?.includes('429')) {
      yield { type: 'error', data: "Notre assistant IA est actuellement très sollicité. Veuillez réessayer dans quelques instants." };
      return;
    }
    throw error;
  }

  let iteration = 0;
  const MAX_ITERATIONS = 3;
  let allCandidates: ScoredCandidate[] = [];

  while (true) {
    iteration++;
    let functionCallFound: any = null;

    console.log(`[GEMINI] Lecture des morceaux du flux (itération ${iteration})...`);
    for await (const chunk of currentStream.stream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.functionCall) {
            console.log(`[GEMINI] Appel de fonction détecté : ${part.functionCall.name}`);
            functionCallFound = part.functionCall;
          } else if (part.text) {
            yield { type: 'text', data: part.text };
          }
        }
      }
    }

    console.log(`[GEMINI] Lecture du flux terminée (itération ${iteration}). En attente de la résolution de la promesse finale...`);
    try {
      await currentStream.response;
      console.log(`[GEMINI] Promesse de réponse finale résolue avec succès (itération ${iteration}).`);
    } catch (e) {
      console.error(`[GEMINI] Erreur lors de l'attente de la réponse (itération ${iteration}) :`, e);
    }

    if (!functionCallFound) {
      // No more function calls, the model has finished its response.
      break;
    }

    if (iteration >= MAX_ITERATIONS) {
      console.log('[GEMINI] Limite d\'itérations atteinte pour les appels de fonctions.');
      if (allCandidates.length > 0) {
        yield { type: 'text', data: "\n\n*J'ai arrêté d'approfondir la recherche. Voici les meilleurs profils trouvés ci-dessus.*" };
      } else {
        yield { type: 'text', data: "\n\n*Je n'ai pas pu trouver de profils précis après plusieurs recherches successives. N'hésitez pas à élargir vos critères.*" };
      }
      break;
    }

    if (functionCallFound.name === 'search_candidates') {
      console.log('[GEMINI] Analyse des arguments de search_candidates :', JSON.stringify(functionCallFound.args));
      const searchParams: SearchParams = {
        query: (functionCallFound.args as any).query || '',
        sector: (functionCallFound.args as any).sector || undefined,
        experienceMin: (functionCallFound.args as any).experienceMin ?? undefined,
        experienceMax: (functionCallFound.args as any).experienceMax ?? undefined,
        locationCity: (functionCallFound.args as any).locationCity || undefined,
        locationCountry: (functionCallFound.args as any).locationCountry || undefined,
        skills: (functionCallFound.args as any).skills || undefined,
      };

      console.log(`[GEMINI] Exécution de la recherche DB en interne avec la requête : "${searchParams.query}"`);
      const { candidates, total } = await searchCandidatesInternal(searchParams);
      console.log(`[GEMINI] La recherche DB a retourné ${candidates.length} résultats sur ${total} correspondances totales.`);

      // Accumulate candidates, avoiding duplicates by ID
      for (const c of candidates) {
        if (!allCandidates.find((existing) => existing.id === c.id)) {
          allCandidates.push(c);
        }
      }

      // Yield all accumulated candidates to the client
      yield { type: 'candidates', data: allCandidates };
      console.log(`[GEMINI] ${allCandidates.length} candidats cumulés envoyés au flux client.`);

      // Build a text summary for the model based ONLY on the current search results
      // so the model knows what *this specific* search returned.
      const resultSummary =
        candidates.length === 0
          ? 'Aucun profil trouve avec ces criteres.'
          : `${total} profils trouves pour cette requete. Voici les resultats :\n\n` +
            candidates
              .map(
                (c, i) =>
                  `Profil #${i + 1} (ID: ${c.id}):\n` +
                  `  Titre: ${c.title}\n` +
                  `  Initiales: ${c.anonymousName}\n` +
                  `  Secteur: ${c.sector || 'Non renseigne'}\n` +
                  `  Experience: ${c.experienceYears} ans\n` +
                  `  Localisation: ${c.locationCity || '?'}, ${c.locationCountry || '?'}\n` +
                  `  Competences: ${c.skills.slice(0, 8).join(', ')}${c.skills.length > 8 ? '...' : ''}\n` +
                  (c.companies && c.companies.length > 0 ? `  Entreprises passees: ${c.companies.join(', ')}\n` : '') +
                  `  Completude du profil: ${c.completionScore}%\n` +
                  `  Score de compatibilite: ${c.compatibilityScore}/100`
              )
              .join('\n\n');

      console.log('[GEMINI] Envoi de la requête de flux de suivi avec la réponse de la fonction (functionResponse)...');
      try {
        currentStream = await chat.sendMessageStream([
          {
            functionResponse: {
              name: 'search_candidates',
              response: { result: resultSummary },
            },
          },
        ]);
        console.log('[GEMINI] Requête de flux de suivi réussie.');
      } catch (error: any) {
        console.error('[GEMINI_QUOTA_ERROR] Échec du flux de suivi :', error);
        if (error?.status === 429 || error?.message?.includes('429')) {
           yield { type: 'error', data: "\n\n(L'analyse a été interrompue car l'assistant est très sollicité, mais les profils trouvés sont affichés ci-dessus)." };
           return;
        }
        throw error;
      }
    } else {
      // If there's an unknown function call, just break to avoid infinite loop
      console.warn(`[GEMINI] Unknown function call: ${functionCallFound.name}`);
      break;
    }
  }
}
