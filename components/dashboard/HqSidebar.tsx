'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, LogOut, Zap, LayoutList, MessageSquare, Mail, User, ChevronUp, Receipt, Server } from 'lucide-react';
import { cn, clearAllLocalData } from '@/lib/utils';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { APP_CONFIG } from '@/lib/config';

const adminNavigation = [
  { name: 'Support Utilisateurs', href: '/dashboard/hq-ops/users', icon: User },
  { name: 'Monitoring IA', href: '/dashboard/hq-ops/ai-logs', icon: Server },
  { name: 'Gestion des Crédits', href: '/dashboard/hq-ops/credits', icon: Zap },
  { name: 'Transactions & Paiements', href: '/dashboard/hq-ops/transactions', icon: Receipt },
  { name: 'Gestion des Tâches', href: '/dashboard/hq-ops/tasks', icon: LayoutList },
  { name: 'Avis Utilisateurs', href: '/dashboard/hq-ops/feedback', icon: MessageSquare },
  { 
    name: 'Marketing & Newsletter', 
    href: '/dashboard/hq-ops/marketing', 
    icon: Mail,
    children: [
      { name: 'Éditeur de Campagne', href: '/dashboard/hq-ops/marketing' },
      { name: 'Historique & Brouillons', href: '/dashboard/hq-ops/marketing/campaigns' },
      { name: 'Statistiques', href: '/dashboard/hq-ops/marketing/stats' },
      { name: 'Templates', href: '/dashboard/hq-ops/marketing/templates' }
    ]
  },
];

export function HqSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const NavLink = ({ item }: { item: any }) => {
    // Determine active states
    const isExactActive = pathname === item.href;
    const isParentActive = pathname.startsWith(item.href);
    
    // For parent elements with children, we might not want the parent highlighted if a child is selected, 
    // but here we let exact match highlight the parent.
    const isMainLinkActive = item.children ? isExactActive : isParentActive;

    const Icon = item.icon;

    return (
      <div className="flex flex-col gap-1">
        <Link
          href={item.href}
          className={cn(
            "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
            isMainLinkActive 
              ? "bg-slate-800 text-white shadow-lg shadow-black/20" 
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          )}
        >
          {isMainLinkActive && (
            <motion.div
              layoutId="activeAdminTab"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-500 rounded-r-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          <Icon className={cn("w-5 h-5 transition-colors", isMainLinkActive ? "text-red-400" : "text-slate-500 group-hover:text-slate-300")} />
          <span className="relative z-10 flex-1">{item.name}</span>
        </Link>

        {item.children && isParentActive && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col gap-1 ml-6 pl-4 border-l border-slate-800 mt-1"
          >
            {item.children.map((child: any) => {
              const isChildActive = pathname === child.href;
              return (
                <Link
                  key={child.name}
                  href={child.href}
                  className={cn(
                    "relative px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isChildActive
                      ? "text-white bg-slate-800/80 shadow-sm"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                  )}
                >
                  {isChildActive && (
                     <div className="absolute left-[-17px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500" />
                  )}
                  {child.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-72 bg-bg-dark border-r border-slate-800 text-white fixed left-0 top-0 z-50">
      {/* Brand */}
      <div className="p-8 pb-4">
        <Link href="/dashboard/hq-ops" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
           <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
             <ShieldAlert className="w-5 h-5 text-white" />
           </div>
           <span className="text-xl font-bold tracking-tight">HQ Ops</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-6 overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 px-4 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Administration</span>
          </div>
          <nav className="space-y-1">
            {adminNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>

      {/* Back to User Dashboard */}
      <div className="px-4 mb-4">
        <Link 
          href="/dashboard"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-blue-400 hover:bg-blue-900/20"
        >
          <LogOut className="w-5 h-5 rotate-180" />
          <span>Quitter le mode Admin</span>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors text-left"
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'Admin'}
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
                {session?.user?.name || 'Administrateur'}
              </p>
              <p className="text-xs text-red-400 font-bold truncate">
                MODE ADMIN
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
                  <button 
                    onClick={async () => {
                      await clearAllLocalData();
                      signOut({ callbackUrl: '/' });
                    }}
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
