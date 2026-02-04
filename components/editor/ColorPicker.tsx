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
  const [activeTab, setActiveTab] = useState<'accent' | 'sidebar'>('accent');
  
  const currentColor = activeTab === 'accent' 
    ? (currentCV?.settings?.accentColor || '#2563eb')
    : (currentCV?.settings?.sidebarColor || '#0f172a');

  const handleColorSelect = (color: string) => {
    if (activeTab === 'accent') {
      updateSettings({ accentColor: color });
      onColorChange?.(color);
    } else {
      updateSettings({ sidebarColor: color });
    }
    // Don't close immediately so user can see change
    // setIsOpen(false); 
  };

  const SIDEBAR_PRESETS = [
    { name: 'Slate Dark', value: '#0f172a' },
    { name: 'Slate Light', value: '#f1f5f9' },
    { name: 'Blue Dark', value: '#1e3a8a' },
    { name: 'Blue Light', value: '#eff6ff' },
    { name: 'Teal Dark', value: '#134e4a' },
    { name: 'Teal Light', value: '#f0fdfa' },
    { name: 'Neutral Dark', value: '#171717' },
    { name: 'Neutral Light', value: '#fafafa' },
    { name: 'Indigo Dark', value: '#312e81' },
    { name: 'Purple Dark', value: '#581c87' },
  ];

  const colorsToDisplay = activeTab === 'accent' ? PRESET_COLORS : SIDEBAR_PRESETS;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
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
        <span className="text-sm text-slate-700 font-medium">Couleurs</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-xl shadow-xl border border-slate-100 z-50 w-72">
            
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
            </div>

            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {activeTab === 'accent' ? "Couleur principale" : "Couleur de fond sidebar"}
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
