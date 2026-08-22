import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { clear } from 'idb-keyval';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LOCALE_MAP: Record<string, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  zh: 'zh-CN',
};

export function formatDate(date: string | Date, lang: string = 'fr'): string {
  if (!date) return '';
  
  if (typeof date === 'string') {
    const trimmed = date.trim();
    // Si c'est juste une année (ex: "2024") ou si ça contient des lettres (ex: "Sept 2024"), on ne formate pas
    if (/^\d{4}$/.test(trimmed) || /[a-zA-Z]/.test(trimmed)) {
      return trimmed;
    }
    // On ne formate que si c'est un format standard YYYY-MM-DD ou YYYY-MM
    if (!/^\d{4}-\d{2}(-\d{2})?$/.test(trimmed) && !/^\d{4}\/\d{2}(\/\d{2})?$/.test(trimmed)) {
      return trimmed;
    }
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  
  const locale = LOCALE_MAP[lang] || 'fr-FR';
  
  // Si on a un format YYYY-MM (sans jour), on n'affiche pas le jour
  const isMonthOnly = typeof date === 'string' && /^\d{4}-\d{2}$/.test(date.trim());
  
  return d.toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long',
    ...(isMonthOnly ? {} : { day: 'numeric' })
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Securise la déconnexion en supprimant toutes les données locales
 * (IndexedDB pour Zustand, LocalStorage, etc.)
 */
export async function clearAllLocalData() {
  try {
    await clear(); // Vider toute la base de données IndexedDB (CVs hors ligne, etc.)
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    console.error('Erreur lors du nettoyage des données locales:', error);
  }
}

/**
 * Nettoie, normalise et sécurise les données d'un CV importé ou généré par l'IA
 * pour s'assurer qu'elles respectent parfaitement le schéma Zod de la base de données.
 */
export function sanitizeCVData(data: any): any {
  if (!data || typeof data !== 'object') return data;
  
  const cleanData = { ...data };

  // Générer un ID principal unique si manquant
  if (!cleanData.id) {
    cleanData.id = generateId();
  }

  // Configuration par défaut si manquante
  if (!cleanData.settings || typeof cleanData.settings !== 'object') {
    cleanData.settings = {
      accentColor: '#2563eb',
      sidebarColor: '#0f172a',
      fontFamily: 'sans',
    };
  }

  // Footer par défaut si manquant
  if (!cleanData.footer || typeof cleanData.footer !== 'object') {
    cleanData.footer = {
      showFooter: false,
      madeAt: '',
      madeDate: '',
      signatureUrl: '',
    };
  } else {
    cleanData.footer = {
      showFooter: !!cleanData.footer.showFooter,
      madeAt: cleanData.footer.madeAt || '',
      madeDate: cleanData.footer.madeDate || '',
      signatureUrl: cleanData.footer.signatureUrl || '',
    };
  }

  // Ordre des sections par défaut si manquant
  const DEFAULT_SECTION_ORDER = [
    'summary', 'experience', 'education', 'skills', 'languages', 
    'hobbies', 'certifications', 'projects', 'references', 'qualities', 'divers'
  ];
  if (!Array.isArray(cleanData.sectionOrder)) {
    cleanData.sectionOrder = [...DEFAULT_SECTION_ORDER];
  } else {
    // Filtrer les valeurs invalides
    cleanData.sectionOrder = cleanData.sectionOrder.filter((sec: any) => 
      DEFAULT_SECTION_ORDER.includes(sec)
    );
    // Assurer la présence de toutes les sections
    DEFAULT_SECTION_ORDER.forEach((sec) => {
      if (!cleanData.sectionOrder.includes(sec)) {
        cleanData.sectionOrder.push(sec);
      }
    });
  }

  // Choix du template (modern par défaut)
  const validTemplates = ['modern', 'professional', 'executive', 'creative', 'tech'];
  if (!cleanData.templateId || !validTemplates.includes(cleanData.templateId)) {
    cleanData.templateId = 'modern';
  }

  // 1. Informations Personnelles (nettoyage de l'email)
  if (!cleanData.personalInfo || typeof cleanData.personalInfo !== 'object') {
    cleanData.personalInfo = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      title: '',
      summary: '',
    };
  } else {
    const p = cleanData.personalInfo;
    const email = p.email;
    let cleanEmail = '';
    if (email && typeof email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email.trim())) {
        cleanEmail = email.trim();
      }
    }
    cleanData.personalInfo = {
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      email: cleanEmail,
      phone: p.phone || '',
      address: p.address || '',
      title: p.title || '',
      summary: p.summary || '',
    };
  }

  // Assistant de nettoyage pour les tableaux
  const sanitizeArray = (arr: any, itemSanitizer: (item: any) => any) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => {
      if (!item || typeof item !== 'object') return null;
      const cleanItem = itemSanitizer(item);
      return {
        ...cleanItem,
        id: item.id || generateId(),
      };
    }).filter(Boolean);
  };

  // 2. Expériences professionnelles
  cleanData.experiences = sanitizeArray(cleanData.experiences, (exp) => ({
    company: exp.company || 'Entreprise',
    position: exp.position || 'Poste',
    startDate: exp.startDate || '',
    endDate: exp.endDate || '',
    current: !!exp.current,
    description: exp.description || '',
  }));

  // 3. Éducation
  cleanData.education = sanitizeArray(cleanData.education, (edu) => ({
    institution: edu.institution || 'Institution',
    degree: edu.degree || '',
    field: edu.field || '',
    startDate: edu.startDate || '',
    endDate: edu.endDate || '',
    current: !!edu.current,
  }));

  // 4. Compétences (validation du niveau de 1 à 5)
  cleanData.skills = sanitizeArray(cleanData.skills, (skill) => {
    let level = undefined;
    if (skill.level !== undefined && skill.level !== null) {
      const parsed = parseInt(String(skill.level), 10);
      if (!isNaN(parsed)) {
        level = Math.max(1, Math.min(5, parsed));
      }
    }
    return {
      name: skill.name || 'Compétence',
      level,
    };
  });

  // 5. Langues (mappage des niveaux français/anglais vers l'énumération Zod)
  const languageLevelMap: Record<string, 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Natif'> = {
    'débutant': 'Débutant', 'beginner': 'Débutant', 'elementary': 'Débutant', 'a1': 'Débutant', 'a2': 'Débutant', 'notions': 'Débutant',
    'intermédiaire': 'Intermédiaire', 'intermediate': 'Intermédiaire', 'b1': 'Intermédiaire', 'b2': 'Intermédiaire',
    'avancé': 'Avancé', 'advanced': 'Avancé', 'fluent': 'Avancé', 'c1': 'Avancé', 'c2': 'Avancé', 'bilingual': 'Avancé', 'bilingue': 'Avancé', 'courant': 'Avancé',
    'natif': 'Natif', 'native': 'Natif', 'maternelle': 'Natif', 'maternnel': 'Natif'
  };
  cleanData.languages = sanitizeArray(cleanData.languages, (lang) => {
    let level = undefined;
    if (lang.level && typeof lang.level === 'string') {
      const normalized = lang.level.toLowerCase().trim();
      level = languageLevelMap[normalized] || undefined;
    }
    return {
      name: lang.name || 'Langue',
      level,
    };
  });

  // 6. Liens Réseaux Sociaux (mappage de la plateforme et format URL)
  const validPlatforms = ['linkedin', 'github', 'portfolio', 'twitter', 'other'];
  cleanData.socialLinks = sanitizeArray(cleanData.socialLinks, (link) => {
    let platform = 'other';
    if (link.platform && typeof link.platform === 'string') {
      const normPlatform = link.platform.toLowerCase().trim();
      if (validPlatforms.includes(normPlatform)) {
        platform = normPlatform;
      }
    }
    
    let url = link.url || '';
    if (url && typeof url === 'string') {
      url = url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/i;
      if (!urlRegex.test(url)) {
        url = 'https://linkedin.com';
      }
    } else {
      url = 'https://linkedin.com';
    }

    return {
      platform,
      url,
      label: link.label || '',
    };
  });

  // 7. Références (nettoyage de l'email)
  cleanData.references = sanitizeArray(cleanData.references, (ref) => {
    let email = '';
    if (ref.email && typeof ref.email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(ref.email.trim())) {
        email = ref.email.trim();
      }
    }
    return {
      name: ref.name || 'Référence',
      position: ref.position || '',
      company: ref.company || '',
      email,
      phone: ref.phone || '',
      hideContact: !!ref.hideContact,
    };
  });

  // 8. Loisirs, Certifications, Projets, Qualités
  cleanData.hobbies = sanitizeArray(cleanData.hobbies, (h) => ({
    name: h.name || 'Loisir',
  }));

  cleanData.certifications = sanitizeArray(cleanData.certifications, (c) => ({
    name: c.name || 'Certification',
    organization: c.organization || '',
    date: c.date || '',
    url: c.url || '',
    credentialUrl: c.credentialUrl || '',
  }));

  cleanData.projects = sanitizeArray(cleanData.projects, (p) => ({
    name: p.name || 'Projet',
    description: p.description || '',
    url: p.url || '',
    github: p.github || '',
    technologies: p.technologies || '',
  }));

  cleanData.qualities = sanitizeArray(cleanData.qualities, (q) => ({
    name: q.name || 'Qualité',
  }));

  cleanData.divers = cleanData.divers || '';
  cleanData.createdAt = cleanData.createdAt || new Date();
  cleanData.updatedAt = cleanData.updatedAt || new Date();
  return cleanData;
}

export function groupSkillsByCategory(skills: any[]): { category: string, items: any[] }[] {
  const hasCategories = skills.some(s => s.category && s.category.trim());
  if (!hasCategories) {
    return [{ category: '', items: skills }];
  }
  
  const groups: Record<string, any[]> = {};
  const uncategorized: any[] = [];
  
  skills.forEach(skill => {
    const cat = skill.category?.trim();
    if (cat) {
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(skill);
    } else {
      uncategorized.push(skill);
    }
  });
  
  const result = Object.entries(groups).map(([category, items]) => ({ category, items }));
  if (uncategorized.length > 0) {
    result.push({ category: '', items: uncategorized });
  }
  return result;
}
