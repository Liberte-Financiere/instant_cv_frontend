import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long' 
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
