import { CVVariant } from '@/types/cv';

// Default colors for each variant
const defaultColors: Record<CVVariant, string> = {
  modern: '#2563eb',
  professional: '#1e293b',
  executive: '#000000',
  creative: '#4f46e5',
  tech: '#22c55e',
};

// Get accent color - uses custom color if provided, otherwise falls back to variant default
export function getAccentColor(variant: CVVariant, customColor?: string): string {
  if (customColor) return customColor;
  return defaultColors[variant];
}

// Generate dynamic style object for accent color
export function getAccentStyles(variant: CVVariant, customColor?: string) {
  const color = getAccentColor(variant, customColor);
  return {
    borderColor: color,
    backgroundColor: color,
    color: color,
  };
}

// Common style configurations for each variant (static classes)
export const variantStyles: Record<CVVariant, {
  accent: string;
  accentBg: string;
  accentText: string;
  headerBg: string;
  headerText: string;
  sectionTitle: string;
  cardBg: string;
  tagBg: string;
  tagText: string;
}> = {
  modern: {
    accent: 'border-blue-600',
    accentBg: 'bg-blue-600',
    accentText: 'text-blue-600',
    headerBg: 'bg-slate-900',
    headerText: 'text-white',
    sectionTitle: 'text-lg font-bold text-slate-900 border-l-4 pl-4 uppercase tracking-wide',
    cardBg: 'bg-white',
    tagBg: 'bg-slate-100',
    tagText: 'text-slate-700',
  },
  professional: {
    accent: 'border-slate-900',
    accentBg: 'bg-slate-900',
    accentText: 'text-slate-900',
    headerBg: 'bg-white',
    headerText: 'text-slate-900',
    sectionTitle: 'text-lg font-bold text-slate-900 border-b-2 pb-2 uppercase tracking-wide',
    cardBg: 'bg-white',
    tagBg: 'bg-slate-100',
    tagText: 'text-slate-700',
  },
  executive: {
    accent: 'border-black',
    accentBg: 'bg-black',
    accentText: 'text-black',
    headerBg: 'bg-white',
    headerText: 'text-black',
    sectionTitle: 'text-lg font-bold text-black border-b pb-2 uppercase tracking-widest font-serif',
    cardBg: 'bg-white',
    tagBg: 'bg-gray-100',
    tagText: 'text-gray-800',
  },
  creative: {
    accent: 'border-indigo-600',
    accentBg: 'bg-indigo-600',
    accentText: 'text-indigo-600',
    headerBg: 'bg-indigo-600',
    headerText: 'text-white',
    sectionTitle: 'text-xl font-extrabold mb-4',
    cardBg: 'bg-white',
    tagBg: 'bg-indigo-100',
    tagText: 'text-indigo-700',
  },
  tech: {
    accent: 'border-green-500',
    accentBg: 'bg-green-500',
    accentText: 'text-green-500',
    headerBg: 'bg-[#1e1e1e]',
    headerText: 'text-gray-300',
    sectionTitle: 'font-mono text-sm uppercase tracking-wider mb-3',
    cardBg: 'bg-[#252526]',
    tagBg: 'bg-[#3c3c3c]',
    tagText: 'text-gray-300',
  },
};
