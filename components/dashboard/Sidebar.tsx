'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, Settings, LogOut, Plus, User, LayoutTemplate, PenTool, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AvatarGroup } from '@/components/ui/AvatarGroup'; // Re-using for user avatar if needed, or simple img

const navigation = [
  { name: 'Mes CV', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mes lettres', href: '/cover-letters', icon: FileText },
  { name: 'Modèles', href: '/templates', icon: LayoutTemplate },
  { name: 'Signature', href: '/signature', icon: PenTool },
  { name: 'Compte', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setAnalysisData } = useCVStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Veuillez uploader un fichier PDF.');
      return;
    }

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse');
      }
      
      const data = await response.json();
      setAnalysisData(data);
      toast.success("Analyse terminée !");
      router.push('/analysis');
      
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsAnalyzing(false);
      // Reset input
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-screen w-72 bg-[#0F172A] border-r border-slate-800 text-white fixed left-0 top-0 z-50">
      {/* Brand */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <FileText className="w-5 h-5 text-white" />
           </div>
           <span className="text-xl font-bold tracking-tight">OptiJob</span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="px-6 pb-6 space-y-3">
         <button className="w-full flex items-center justify-center gap-2 bg-[#2463eb] hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20 group">
           <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
           <span>Nouveau CV</span>
         </button>

         <button 
           onClick={() => fileInputRef.current?.click()}
           disabled={isAnalyzing}
           className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg shadow-purple-900/20 group relative overflow-hidden"
         >
           {isAnalyzing ? (
             <Loader2 className="w-5 h-5 animate-spin" />
           ) : (
             <>
               <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform text-yellow-300" />
               <span>Analyser avec IA</span>
             </>
           )}
           <input 
             ref={fileInputRef}
             type="file" 
             accept=".pdf" 
             className="hidden" 
             onChange={handleFileUpload}
           />
         </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-2 overflow-y-auto">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-slate-800 text-white shadow-lg shadow-black/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
             <User className="w-5 h-5 text-slate-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Jean Dupont</p>
            <p className="text-xs text-slate-400 truncate">Free Plan</p>
          </div>
          <LogOut className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}
