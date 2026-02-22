/**
 * Application Configuration
 * 
 * Centralized config for the app name and branding.
 * Change the name here and it will be reflected everywhere.
 */

export const APP_CONFIG = {
  /** The official name of the application */
  name: 'JobSira',

  /** Tagline / Slogan */
  tagline: 'Le Coach CV par l\'IA',

  /** Short description for SEO */
  description: 'Créez des CV et lettres de motivation professionnels avec l\'intelligence artificielle. Décrochez le job de vos rêves.',

  /** Contact email */
  email: 'contact@jobsira.com',

  /** Support email */
  supportEmail: 'support@jobsira.com',

  /** Base URL (production) */
  url: 'https://jobsira.com',

  /** WhatsApp admin phone */
  whatsappPhone: '22607997114',

  /** Cloudinary upload folder */
  uploadFolder: 'jobsira-cv-photos',

  /** PWA cache prefix */
  cachePrefix: 'jobsira',

  /** Zustand persist keys */
  storageKeys: {
    cv: 'jobsira-cv-storage',
    coverLetter: 'jobsira-cl-storage',
  },

  /** Copyright */
  copyright: `© ${new Date().getFullYear()} JobSira. Tous droits réservés.`,
} as const;
