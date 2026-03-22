'use client';

import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';

const LANGUAGES = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
] as const;

export function LanguageSelector() {
  const { currentCV, updateSettings } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLang = currentCV?.settings?.language || 'fr';

  const handleSelect = (langCode: 'en' | 'fr' | 'zh') => {
    updateSettings({ language: langCode });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 sm:px-3 sm:py-2 gap-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
        title="Langue du CV"
      >
        <Globe className="w-4 h-4 text-slate-500" />
        <span className="text-sm text-slate-700 font-medium hidden sm:inline uppercase">
          {currentLang}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-50 transform origin-top-right overflow-hidden py-1"
          >
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 bg-slate-50/80 border-b border-slate-100 uppercase tracking-wider">
              En-têtes
            </div>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-slate-50 transition-colors text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{lang.name}</span>
                </div>
                {currentLang === lang.code && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
