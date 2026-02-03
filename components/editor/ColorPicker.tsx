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
  
  const currentColor = currentCV?.settings?.accentColor || '#2563eb';

  const handleColorSelect = (color: string) => {
    updateSettings({ accentColor: color });
    onColorChange?.(color);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
      >
        <div 
          className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: currentColor }}
        />
        <Palette className="w-4 h-4 text-slate-500" />
        <span className="text-sm text-slate-700 font-medium">Couleur</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-xl shadow-xl border border-slate-100 z-50 w-64">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Couleur d&apos;accent
            </p>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform border-2 border-white shadow-sm"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {currentColor === color.value && (
                    <Check className="w-4 h-4 text-white drop-shadow" />
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
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={currentColor}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      handleColorSelect(e.target.value);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono"
                  placeholder="#2563eb"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
