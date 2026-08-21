import { useCVStore } from '@/store/useCVStore';
import { CVMode } from '@/types/cv';
import { GraduationCap, Briefcase } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export function CVModeSelector() {
  const { currentCV, setCVMode } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentCV) return null;

  const currentMode = currentCV.settings?.cvMode || 'professional';

  const modes: { id: CVMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'professional',
      label: 'Professionnel',
      icon: <Briefcase className="w-4 h-4 text-blue-500" />,
      desc: 'Standard pour le monde de l\'entreprise',
    },
    {
      id: 'academic',
      label: 'Étudiant / Académique',
      icon: <GraduationCap className="w-4 h-4 text-emerald-500" />,
      desc: 'Titres et ordre adaptés aux étudiants (ex: UVBF)',
    },
  ];

  const handleSelect = (modeId: CVMode) => {
    if (modeId === currentMode) return;
    
    setCVMode(modeId);
    toast.success(`Mode CV passé en : ${modes.find(m => m.id === modeId)?.label}`);
    setIsOpen(false);
  };

  const activeMode = modes.find((m) => m.id === currentMode);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors h-9 sm:h-auto"
        title="Changer le type de CV"
      >
        {activeMode?.icon}
        <span className="hidden sm:inline">{activeMode?.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-50">
          <div className="mb-2 px-2 pb-2 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type de Profil</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Le mode Académique renommera vos sections et ajustera l'ordre recommandé.</p>
          </div>
          
          <div className="flex flex-col gap-1">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleSelect(mode.id)}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors text-left w-full ${
                  currentMode === mode.id
                    ? 'bg-indigo-50 text-indigo-900 border border-indigo-100'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="mt-0.5 bg-white p-1 rounded shadow-sm border border-slate-100 shrink-0">
                  {mode.icon}
                </div>
                <div>
                  <p className={`text-sm font-bold ${currentMode === mode.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {mode.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{mode.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
