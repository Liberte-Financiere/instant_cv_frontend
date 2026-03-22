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
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const locale = LOCALE_MAP[lang] || 'fr-FR';
  return d.toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long' 
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
