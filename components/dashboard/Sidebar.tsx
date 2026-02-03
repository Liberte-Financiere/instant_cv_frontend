'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, LogOut, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AvatarGroup } from '@/components/ui/AvatarGroup'; // Re-using for user avatar if needed, or simple img

const navigation = [
  { name: 'Mes CV', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Modèles', href: '/templates', icon: FileText },
  { name: 'Compte', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-72 bg-[#0F172A] border-r border-slate-800 text-white fixed left-0 top-0 z-50">
      {/* Brand */}
      <div className="p-8">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <FileText className="w-5 h-5 text-white" />
           </div>
           <span className="text-xl font-bold tracking-tight">OptiJob</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-2">
        <div className="mb-8 px-4">
           <button className="w-full flex items-center justify-center gap-2 bg-[#2463eb] hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20 group">
             <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
             <span>Nouveau CV</span>
           </button>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-slate-800 text-white" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[#2463eb]" : "text-slate-400")} />
                {item.name}
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
