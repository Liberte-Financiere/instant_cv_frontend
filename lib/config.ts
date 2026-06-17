/**
 * Application Configuration & Design Tokens
 * 
 * SINGLE SOURCE OF TRUTH for all business values.
 * Change anything here and it will be reflected everywhere.
 */

export const APP_CONFIG = {
  // ─── Brand ────────────────────────────────────────
  /** The official name of the application */
  name: 'JobSira',

  /** Tagline / Slogan */
  tagline: 'Le Coach CV par l\'IA',

  /** Short description for SEO */
  description: 'Créez des CV et lettres de motivation professionnels avec l\'intelligence artificielle. Décrochez le job de vos rêves.',

  /** Base URL (production) */
  url: 'https://jobsira.com',

  /** Copyright */
  copyright: `© ${new Date().getFullYear()} JobSira. Tous droits réservés.`,

  // ─── Contact ──────────────────────────────────────
  /** Contact email */
  email: 'contact@jobsira.com',

  /** Support email */
  supportEmail: 'support@jobsira.com',

  /** WhatsApp admin phone (international format, no +) */
  whatsappPhone: '22607997114',

  // ─── Credits & Pricing ────────────────────────────
  credits: {
    /** Credits gifted to new users on signup */
    signupBonus: 15,
    /** Credits gifted to the referrer when a referral signs up */
    referralReward: 10,
    /** Credits gifted to the referred user */
    referralBonus: 5,
  },

  pricing: {
    /** Currency code displayed on the pricing page */
    currency: 'FCFA',
    /** À la carte pricing (pay per credit) */
    alaCarte: {
      /** Price per credit in FCFA */
      pricePerCredit: 30,
      /** Minimum number of credits that can be purchased */
      minCredits: 5,
      /** Maximum number of credits to prevent integer overflow attacks */
      maxCredits: 5000,
    },
    /** Credit packs available for purchase */
    packs: [
      {
        id: 'standard',
        name: 'Pack Standard',
        credits: 35,
        price: 1_000,
        priceLabel: '1 000',
        description: "L'essentiel pour postuler.",
        features: [
          'Valable à vie',
          'Création et modifications libres',
          'Refonte IA de votre CV',
          'Lettres pour chaque offre',
        ],
        popular: false,
      },
      {
        id: 'premium',
        name: 'Pack Premium',
        credits: 80,
        price: 2_000,
        priceLabel: '2 000',
        description: 'Pour postuler activement.',
        features: [
          'Valable à vie',
          'Correction et traduction IA',
          'Analyse CV vs Offre IA',
          'Multiples versions de CV',
        ],
        popular: true,
      },
      {
        id: 'pro',
        name: 'Pack Pro',
        credits: 250,
        price: 5_000,
        priceLabel: '5 000',
        description: 'La tranquillité ultime.',
        features: [
          'Valable à vie',
          'Création sans limite',
          'Coach IA complet à disposition',
          'Toutes les options débloquées',
        ],
        popular: false,
      },
    ] as const,
  },

  /** Features included for free (displayed on pricing page) */
  freeFeatures: [
    'Export PDF illimité',
    'Design illimité',
    'Templates gratuits',
    'Crédits sans expiration',
  ],

  // ─── Infrastructure ───────────────────────────────
  /** Cloudinary upload folder */
  uploadFolder: 'jobsira-cv-photos',

  /** PWA cache prefix */
  cachePrefix: 'jobsira',

  // ─── AI Configuration ────────────────────────────
  ai: {
    models: {
      /** Modèle rapide et intelligent pour les tâches générales (Analyse, Match) */
      fast: 'gemini-3.5-flash',
      /** Modèle très léger et rapide pour les petites tâches (Correction, Génération de petites listes) */
      lite: 'gemini-3.1-flash-lite',

      /** Modèle Groq (très rapide) dédié à la reformulation et correction de texte en Français */
      groqReformulation: 'llama-3.3-70b-versatile',

      /** Modèle pour la traduction et les tâches complexes */
      pro: 'gemini-3.1-pro-preview',

      /** Modèle pour l'audio en live */
      audioLive: 'models/gemini-3.1-flash-live-preview',
      
      /** Modèles via OpenRouter */
      openrouter: {
        fast: 'google/gemini-3.5-flash',
        pro: 'google/gemini-3.1-pro-preview',
        assistant: 'google/gemini-2.5-flash',
      }
    },
    interview: {
      maxQuestions: 6,
    },
    voices: {
      male: ['Fenrir', 'Algieba'],
      female: ['Gacrux'],
      default: 'Fenrir',
    } as const,
    talentAssistant: {
      maxMessages: 20,
      rateLimit: {
        limit: 20, // max req per window
        windowMs: 60_000, // 1 min
      },
    },
  },

  /** Zustand persist keys */
  storageKeys: {
    cv: 'jobsira-cv-storage',
    coverLetter: 'jobsira-cl-storage',
  },
} as const;

/** Shortcut for the app name */
export const APP_NAME = APP_CONFIG.name;
