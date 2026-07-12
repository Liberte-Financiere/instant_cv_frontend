/**
 * Credit cost constants for all AI and generation features.
 * 
 * This file is intentionally free of any server-side imports (Prisma, etc.)
 * so it can be safely imported in both server and client components.
 */

export const CREDIT_COSTS = {
  CREATE_CV: 2,
  CREATE_LETTER: 1,
  AI_ANALYZE: 2,
  AI_MATCH: 2,
  AI_GENERATE_LETTER: 2,

  AI_OPTIMIZE: 1,
  AI_REWRITE: 0.5,
  AI_CONTINUE: 0.5,
  AI_CORRECT: 0.5,

  AI_CV_TRANSLATE: 5,

  AI_INTERVIEW: 5,               // 5 credits for Text Mode (flat rate)
  AI_INTERVIEW_AUDIO_MINUTE: 1,  // 1 credit per minute for Audio Mode (dynamic rate)
  
  AI_PHOTO: 20,                  // 20 credits for Photo Studio Generation
  AI_REMOVE_BG: 1,               // 1 credit for Background Removal
  
  AI_BILAN: 2,                   // 2 credits for Bilan de Compétences
};

export type ActionType = keyof typeof CREDIT_COSTS;
