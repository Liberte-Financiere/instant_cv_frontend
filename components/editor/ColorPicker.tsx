'use client';

import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';

const PRESET_COLORS = [
  { name: 'Bleu', value: '#2563eb' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Rose', value: '#db2777' },
  { name: 'Rouge', value: '#dc2626' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Jaune', value: '#ca8a04' },
  { name: 'Vert', value: '#16a34a' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Cyan', value: '#0891b2' },
  { name: 'Noir', value: '#1e293b' },
  { name: 'Gris', value: '#64748b' },
];

interface ColorPickerProps {
  onColorChange?: (color: string) => void;
}

export function ColorPicker({ onColorChange }: ColorPickerProps) {
  const { currentCV, updateSettings } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'accent' | 'sidebar' | 'tags'>('accent');
  
  const currentColor = activeTab === 'accent' 
    ? (currentCV?.settings?.accentColor || '#2563eb')
    : activeTab === 'sidebar' 
      ? (currentCV?.settings?.sidebarColor || '#0f172a')
      : (currentCV?.settings?.tagsColor || 'transparent');

  const handleColorSelect = (color: string) => {
    if (activeTab === 'accent') {
      updateSettings({ accentColor: color });
      onColorChange?.(color);
    } else if (activeTab === 'sidebar') {
      updateSettings({ sidebarColor: color });
    } else {
      updateSettings({ tagsColor: color });
    }
    // Don't close immediately so user can see change
    // setIsOpen(false); 
  };

  const SIDEBAR_PRESETS = [
    { name: 'Ardoise Foncée', value: '#0f172a' },
    { name: 'Bleu Marine', value: '#1e3a8a' },
    { name: 'Vert Canard', value: '#134e4a' },
    { name: 'Indigo Nuit', value: '#312e81' },
    { name: 'Violet Profond', value: '#581c87' },
    { name: 'Gris Neutre', value: '#334155' },
    { name: 'Émeraude', value: '#064e3b' },
    { name: 'Bordeaux', value: '#7f1d1d' },
    { name: 'Marron Cuir', value: '#78350f' },
    { name: 'Gris Clair', value: '#f1f5f9' },
  ];

  const TAGS_PRESETS = [
    { name: 'Transparent (Par défaut)', value: 'transparent' },
    { name: 'Blanc pur', value: '#ffffff' },
    { name: 'Noir', value: '#000000' },
    { name: 'Ardoise Foncée', value: '#0f172a' },
    { name: 'Bleu Marine', value: '#1e3a8a' },
    { name: 'Gris Neutre', value: '#334155' },
    { name: 'Gris Clair', value: '#f1f5f9' },
  ];

  const colorsToDisplay = activeTab === 'accent' ? PRESET_COLORS : activeTab === 'sidebar' ? SIDEBAR_PRESETS : TAGS_PRESETS;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-1 sm:px-3 sm:py-2 gap-1 sm:gap-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
      >
        <div className="flex -space-x-1">
          <div 
            className="w-4 h-4 rounded-full border border-white shadow-sm z-10"
            style={{ backgroundColor: currentCV?.settings?.accentColor || '#2563eb' }}
          />
          <div 
            className="w-4 h-4 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: currentCV?.settings?.sidebarColor || '#0f172a' }}
          />
        </div>
        <Palette className="w-4 h-4 text-slate-500" />
        <span className="text-sm text-slate-700 font-medium hidden sm:inline">Couleurs</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="fixed left-1/2 top-20 -translate-x-1/2 w-[90vw] max-w-[300px] md:absolute md:top-full md:left-0 md:translate-x-0 md:w-72 md:max-w-none mt-2 p-4 bg-white rounded-xl shadow-xl border border-slate-100 z-50 transform origin-top"
          >
            
            {/* Tabs */}
            <div className="flex mb-4 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('accent')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'accent' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Accent
              </button>
              <button
                onClick={() => setActiveTab('sidebar')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'sidebar' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sidebar
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'tags' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Badges
              </button>
            </div>

            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {activeTab === 'accent' ? "Couleur principale" : activeTab === 'sidebar' ? "Couleur de fond sidebar" : "Couleur des badges"}
            </p>

            <div className="grid grid-cols-5 gap-2">
              {colorsToDisplay.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform border-2 border-slate-100 shadow-sm relative"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {currentColor === color.value && (
                    <Check className={`w-4 h-4 drop-shadow ${
                      ['#f1f5f9', '#eff6ff', '#f0fdfa', '#fafafa'].includes(color.value) 
                        ? 'text-slate-900' 
                        : 'text-white'
                    }`} />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <label className="text-xs font-medium text-slate-600 mb-2 block">
                Couleur personnalisée
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                />
                <input
                  type="text"
                  value={currentColor}
                  onChange={(e) => {
                    handleColorSelect(e.target.value);
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono uppercase"
                  placeholder="#000000"
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
