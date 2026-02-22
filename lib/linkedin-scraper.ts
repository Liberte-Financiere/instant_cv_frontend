/**
 * LinkedIn Profile Scraper using Third-Party API
 * 
 * Supports multiple providers:
 * - RapidAPI Fresh LinkedIn Profile Data (default, has free tier)
 * - Scrapingdog (paid)
 * - LinkdAPI (paid)
 * 
 * Configure via environment variables:
 * - LINKEDIN_SCRAPER_PROVIDER: 'rapidapi' | 'scrapingdog' | 'linkdapi'
 * - LINKEDIN_SCRAPER_API_KEY: Your API key for the chosen provider
 */

import type { 
  PersonalInfo, 
  Experience, 
  Education, 
  Skill, 
  Language,
  Certification,
  Project,
  SocialLink
} from '@/types/cv';
import { generateId } from '@/lib/utils';

// Types for LinkedIn profile data from scraping APIs
interface LinkedInProfileRaw {
  firstName?: string;
  lastName?: string;
  headline?: string;
  summary?: string;
  profilePicture?: string;
  email?: string;
  phone?: string;
  location?: string;
  positions?: LinkedInPosition[];
  educations?: LinkedInEducation[];
  skills?: string[];
  languages?: LinkedInLanguage[];
  certifications?: LinkedInCertification[];
  projects?: LinkedInProject[];
}

interface LinkedInPosition {
  title?: string;
  companyName?: string;
  description?: string;
  startDate?: { month?: number; year?: number };
  endDate?: { month?: number; year?: number };
  current?: boolean;
}

interface LinkedInEducation {
  schoolName?: string;
  degreeName?: string;
  fieldOfStudy?: string;
  startDate?: { year?: number };
  endDate?: { year?: number };
}

interface LinkedInLanguage {
  name?: string;
  proficiency?: string;
}

interface LinkedInCertification {
  name?: string;
  authority?: string;
  startDate?: { month?: number; year?: number };
  url?: string;
}

interface LinkedInProject {
  title?: string;
  description?: string;
  url?: string;
}

// Result type
export interface LinkedInImportResult {
  success: boolean;
  data?: {
    personalInfo: Partial<PersonalInfo>;
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    languages: Language[];
    certifications: Certification[];
    projects: Project[];
    socialLinks: SocialLink[];
  };
  error?: string;
}

/**
 * Extract LinkedIn username from various URL formats
 */
export function extractLinkedInUsername(url: string): string | null {
  // Support various LinkedIn URL formats:
  // https://linkedin.com/in/username
  // https://www.linkedin.com/in/username
  // https://ci.linkedin.com/in/username (country-specific)
  // linkedin.com/in/username
  const patterns = [
    /linkedin\.com\/in\/([a-zA-Z0-9\-_%]+)/i,
    /^([a-zA-Z0-9\-]+)$/  // Just the username
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      // Decode URL-encoded characters and clean up
      return decodeURIComponent(match[1]).replace(/\/$/, '');
    }
  }

  return null;
}

/**
 * Format date from LinkedIn date object
 */
function formatDate(date?: { month?: number; year?: number }): string {
  if (!date?.year) return '';
  if (date.month) {
    return `${date.year}-${String(date.month).padStart(2, '0')}`;
  }
  return String(date.year);
}

/**
 * Map LinkedIn proficiency to our language level
 */
function mapLanguageLevel(proficiency?: string): Language['level'] {
  if (!proficiency) return 'Intermédiaire';
  
  const lower = proficiency.toLowerCase();
  if (lower.includes('native') || lower.includes('fluent') || lower.includes('natif')) {
    return 'Natif';
  }
  if (lower.includes('professional') || lower.includes('advanced') || lower.includes('avancé')) {
    return 'Avancé';
  }
  if (lower.includes('elementary') || lower.includes('basic') || lower.includes('débutant')) {
    return 'Débutant';
  }
  return 'Intermédiaire';
}

/**
 * Fetch LinkedIn profile data using RapidAPI
 */
async function fetchFromRapidAPI(username: string): Promise<LinkedInProfileRaw> {
  const apiKey = process.env.LINKEDIN_SCRAPER_API_KEY;
  if (!apiKey) {
    throw new Error('LINKEDIN_SCRAPER_API_KEY is not configured');
  }

  // Using "Fresh LinkedIn Profile Data" API from RapidAPI
  // https://rapidapi.com/freshdata-freshdata-default/api/fresh-linkedin-profile-data
  const response = await fetch(
    `https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile?linkedin_url=https://linkedin.com/in/${encodeURIComponent(username)}`,
    {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'fresh-linkedin-profile-data.p.rapidapi.com'
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[LinkedIn Scraper] RapidAPI Error:', response.status, errorText);
    
    if (response.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    if (response.status === 404) {
      throw new Error('LinkedIn profile not found. Please check the URL.');
    }
    throw new Error(`Failed to fetch LinkedIn profile: ${response.status}`);
  }

  const data = await response.json();
  
  // Map RapidAPI response to our internal format
  return {
    firstName: data.first_name,
    lastName: data.last_name,
    headline: data.headline,
    summary: data.about || data.summary,
    profilePicture: data.profile_pic_url,
    location: data.location?.default || data.city,
    positions: data.experiences?.map((exp: any) => ({
      title: exp.title,
      companyName: exp.company,
      description: exp.description,
      startDate: exp.starts_at,
      endDate: exp.ends_at,
      current: !exp.ends_at
    })),
    educations: data.education?.map((edu: any) => ({
      schoolName: edu.school,
      degreeName: edu.degree_name,
      fieldOfStudy: edu.field_of_study,
      startDate: edu.starts_at,
      endDate: edu.ends_at
    })),
    skills: data.skills,
    languages: data.languages?.map((lang: any) => ({
      name: lang.name || lang,
      proficiency: lang.proficiency
    })),
    certifications: data.certifications?.map((cert: any) => ({
      name: cert.name,
      authority: cert.authority,
      startDate: cert.starts_at,
      url: cert.url
    })),
    projects: data.accomplishment_projects?.map((proj: any) => ({
      title: proj.title,
      description: proj.description,
      url: proj.url
    }))
  };
}

/**
 * Transform raw LinkedIn data to CV format
 */
function transformToCV(profile: LinkedInProfileRaw, linkedInUrl: string): LinkedInImportResult['data'] {
  return {
    personalInfo: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      address: profile.location || '',
      photoUrl: profile.profilePicture,
      title: profile.headline || '',
      summary: profile.summary || ''
    },
    experiences: (profile.positions || []).map(pos => ({
      id: generateId(),
      company: pos.companyName || '',
      position: pos.title || '',
      startDate: formatDate(pos.startDate),
      endDate: pos.current ? '' : formatDate(pos.endDate),
      current: pos.current || false,
      description: pos.description || ''
    })),
    education: (profile.educations || []).map(edu => ({
      id: generateId(),
      institution: edu.schoolName || '',
      degree: edu.degreeName || '',
      field: edu.fieldOfStudy || '',
      startDate: formatDate(edu.startDate),
      endDate: formatDate(edu.endDate)
    })),
    skills: (profile.skills || []).map(skill => ({
      id: generateId(),
      name: typeof skill === 'string' ? skill : skill,
      level: 3 // Default level
    })),
    languages: (profile.languages || []).map(lang => ({
      id: generateId(),
      name: lang.name || '',
      level: mapLanguageLevel(lang.proficiency)
    })),
    certifications: (profile.certifications || []).map(cert => ({
      id: generateId(),
      name: cert.name || '',
      organization: cert.authority || '',
      date: formatDate(cert.startDate),
      url: cert.url,
      credentialUrl: cert.url
    })),
    projects: (profile.projects || []).map(proj => ({
      id: generateId(),
      name: proj.title || '',
      description: proj.description || '',
      url: proj.url,
      github: '',
      technologies: ''
    })),
    socialLinks: [
      {
        id: generateId(),
        platform: 'linkedin' as const,
        url: linkedInUrl,
        label: 'LinkedIn'
      }
    ]
  };
}

/**
 * Main function to scrape LinkedIn profile
 */
export async function scrapeLinkedInProfile(urlOrUsername: string): Promise<LinkedInImportResult> {
  try {
    // Extract username from URL
    const username = extractLinkedInUsername(urlOrUsername);
    if (!username) {
      return {
        success: false,
        error: 'Invalid LinkedIn URL format. Please use a URL like: https://linkedin.com/in/username'
      };
    }



    // Fetch from configured provider (default: RapidAPI)
    const provider = process.env.LINKEDIN_SCRAPER_PROVIDER || 'rapidapi';
    
    let profileData: LinkedInProfileRaw;
    
    switch (provider) {
      case 'rapidapi':
      default:
        profileData = await fetchFromRapidAPI(username);
        break;
      // Add other providers here as needed
      // case 'scrapingdog':
      //   profileData = await fetchFromScrapingdog(username);
      //   break;
    }

    // Build the full LinkedIn URL for storing
    const linkedInUrl = `https://linkedin.com/in/${username}`;
    
    // Transform to CV format
    const cvData = transformToCV(profileData, linkedInUrl);



    return {
      success: true,
      data: cvData
    };

  } catch (error: any) {
    console.error('[LinkedIn Scraper] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch LinkedIn profile'
    };
  }
}
