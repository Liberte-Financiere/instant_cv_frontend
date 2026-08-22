'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {Menu, X, FileText, LayoutDashboard, LayoutList, LayoutTemplate, PenTool, Settings, LogOut, User, Target, Brain, MessageSquare, ShieldAlert, Mic, Zap, Wand2} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { cn, clearAllLocalData } from '@/lib/utils';
import { APP_CONFIG } from '@/lib/config';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mes CV', href: '/dashboard/list', icon: LayoutList },
  { name: 'Mes lettres', href: '/dashboard/cover-letters', icon: FileText },
  { name: 'Modèles', href: '/dashboard/templates', icon: LayoutTemplate },
  { name: 'Acheter des Crédits', href: '/dashboard/pricing', icon: Wand2 },
];

const aiNavigation = [
  { name: 'Boîte à outils', href: '/dashboard/tools', icon: Wand2, b2cOnly: true },
  { name: 'Analyser mon CV', href: '/dashboard/ai/analyze', icon: Brain },
  { name: 'Matcher une offre', href: '/dashboard/ai/match', icon: Target },
  { name: "Simulateur d'entretien", href: '/dashboard/ai/interview', icon: Mic },
];

const secondaryNavigation = [
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  { name: 'Donner mon avis', href: '/dashboard/feedback', icon: MessageSquare },
];

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();


  return (
    <>
      {/* Fixed Header Bar - only on mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-bg-dark z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">{APP_CONFIG.name}</span>
        </div>
        
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-72 bg-bg-dark z-[70] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">{APP_CONFIG.name}</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Dashboard Home */}
                <div className="space-y-1">
                  {(() => {
                    const dashboardItem = navigation.find(n => n.name === 'Dashboard');
                    if (!dashboardItem) return null;
                    const isActive = pathname === dashboardItem.href;
                    const Icon = dashboardItem.icon;
                    return (
                      <Link
                        href={dashboardItem.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                          isActive 
                            ? "bg-slate-800 text-white" 
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        )}
                      >
                        <Icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-500")} />
                        <span>{dashboardItem.name}</span>
                      </Link>
                    );
                  })()}
                </div>

                {/* Documents Section */}
                <div className="mt-8">
                  <div className="flex items-center gap-2 px-4 mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mes Documents</span>
                  </div>
                  <div className="space-y-1">
                  {navigation.filter(n => ['Mes CV', 'Mes lettres', 'Modèles'].includes(n.name)).map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                          isActive 
                            ? "bg-slate-800 text-white" 
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        )}
                      >
                        <Icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-500")} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  </div>
                </div>

                {/* Admin Section Mobile */}
                {session?.user?.role === 'ADMIN' && (
                  <div>
                    <div className="flex items-center gap-2 px-4 mb-2">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Administration</span>
                    </div>
                    <div className="space-y-1">
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                          pathname === '/dashboard/admin' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        )}
                      >
                        <Zap className={cn("w-5 h-5", pathname === '/dashboard/admin' ? "text-blue-400" : "text-slate-500")} />
                        <span>Gestion Crédits</span>
                      </Link>
                      <Link
                        href="/dashboard/admin/feedback"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                          pathname === '/dashboard/admin/feedback' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        )}
                      >
                        <MessageSquare className={cn("w-5 h-5", pathname === '/dashboard/admin/feedback' ? "text-blue-400" : "text-slate-500")} />
                        <span>Avis Utilisateurs</span>
                      </Link>
                      <Link
                        href="/admin/tasks"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                          pathname === '/admin/tasks' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        )}
                      >
                        <LayoutList className={cn("w-5 h-5", pathname === '/admin/tasks' ? "text-blue-400" : "text-slate-500")} />
                        <span>Gestion des Tâches</span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* AI Section Mobile */}
                <div className="mt-8">
                  <div className="flex items-center gap-2 px-4 mb-2">
                    <Wand2 className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outils IA</span>
                  </div>
                  <div className="space-y-1">
                    {aiNavigation.map((item) => {
                      if (item.b2cOnly && session?.user?.role === 'RECRUITER') return null;
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                            isActive 
                              ? "bg-slate-800 text-white shadow-lg shadow-black/20" 
                              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                          )}
                        >
                          <Icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-500")} />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Preferences Section Mobile */}
                <div className="mt-8">
                  <div className="flex items-center gap-2 px-4 mb-2">
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Préférences</span>
                  </div>
                  <div className="space-y-1">
                    {secondaryNavigation.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                            isActive 
                              ? "bg-slate-800 text-white shadow-lg shadow-black/20" 
                              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                          )}
                        >
                          <Icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-500")} />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </nav>

              {/* User Profile */}
              <div className="p-4 border-t border-slate-800 space-y-4">
                {/* Shiny Credits Button */}
                <Link 
                  href="/dashboard/pricing"
                  onClick={() => setIsOpen(false)}
                  className="w-full relative flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                >
                  Acheter des Crédits
                </Link>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {session?.user?.name || 'Utilisateur'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={async () => {
                    await clearAllLocalData();
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
