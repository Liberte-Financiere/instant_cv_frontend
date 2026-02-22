'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, Settings, LogOut, User, LayoutTemplate, PenTool, Sparkles, ChevronUp, LayoutList, Target, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useCVStore } from '@/store/useCVStore';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useCreditStore } from '@/store/useCreditStore';


const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mes CV (Liste)', href: '/dashboard/list', icon: LayoutList },
  { name: 'Mes lettres', href: '/dashboard/cover-letters', icon: FileText },
  { name: 'Modèles', href: '/dashboard/templates', icon: LayoutTemplate },
  { name: 'Acheter des Crédits', href: '/dashboard/pricing', icon: Sparkles },
  { name: 'Compte', href: '/dashboard/settings', icon: Settings },
];

const aiNavigation = [
  { name: 'Analyser mon CV', href: '/dashboard/ai/analyze', icon: Sparkles },
  { name: 'Matcher une offre', href: '/dashboard/ai/match', icon: Target },
];

export function Sidebar() {

  const pathname = usePathname();
  const { data: session } = useSession();
  const { fetchUserCVs, saveCurrentCV, currentCV } = useCVStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Initial Fetch
  useEffect(() => {
    fetchUserCVs();
  }, [fetchUserCVs]);

  // Auto-save on change (Debounced 4s)
  useEffect(() => {
    if (!currentCV) return;
    const timer = setTimeout(() => {
      saveCurrentCV();
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentCV, saveCurrentCV]);

  const NavLink = ({ item }: { item: { name: string; href: string; icon: any } }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
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
  };

  return (
    <div className="flex flex-col h-screen w-72 bg-bg-dark border-r border-slate-800 text-white fixed left-0 top-0 z-50">
      {/* Brand */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <FileText className="w-5 h-5 text-white" />
           </div>
           <span className="text-xl font-bold tracking-tight">OptiJob</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-6 overflow-y-auto">
        {/* Main Nav */}
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>

        {/* AI Section */}
        <div>

          <nav className="space-y-1">
            {aiNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>
        </div> 
      </div>

      {/* User Credits & Profile */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        {/* Credits Badge */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
           <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-slate-300">Crédits IA</span>
           </div>
           <span className="text-sm font-bold text-amber-400">
             {useCreditStore((state) => state.isLoading) ? '...' : useCreditStore((state) => state.credits)}
           </span>
        </div>

        {/* Profile Button */}
        <div className="relative">
        <button 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors text-left"
        >
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={40}
              height={40}
              className="rounded-full border border-slate-600"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
               <User className="w-5 h-5 text-slate-300" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {session?.user?.name || 'Utilisateur'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {session?.user?.email || ''}
            </p>
          </div>
          <ChevronUp className={`w-4 h-4 text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
        </button>

        {/* Menu Dropdown */}
        {showUserMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowUserMenu(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden z-20"
            >
              <div className="p-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg text-sm transition-colors">
                  <Settings className="w-4 h-4" />
                  Paramètres
                </button>
                <div className="h-px bg-slate-700/50 my-1" />
                <button 
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            </motion.div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
