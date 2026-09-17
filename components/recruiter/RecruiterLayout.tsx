'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, Building2, Users, LogIn, LogOut, 
  Unlock, User, Briefcase, BarChart3, Menu, X, ArrowLeft, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSession, signOut } from 'next-auth/react';
import { TalentChat } from './TalentChat';

interface RecruiterLayoutProps {
  children: React.ReactNode;
}

export function RecruiterLayout({ children }: RecruiterLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const verifyingRef = useRef(false);

  const isOnboardingPage = 
    pathname === '/recruiter/register' || 
    pathname === '/recruiter/pending' || 
    pathname === '/recruiter/rejected';

  const isApprovedRecruiter = 
    session?.user?.role === 'ADMIN' || 
    (session?.user?.role === 'RECRUITER' && session?.user?.recruiterStatus === 'APPROVED');

  useEffect(() => {
    if (status === 'loading') return;

    // Gatekeeper: Protected recruiter pages
    if (!isOnboardingPage) {
      if (status === 'unauthenticated') {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!isApprovedRecruiter) {
        if (verifyingRef.current) return;
        verifyingRef.current = true;

        fetch('/api/recruiter/status')
          .then((res) => {
            if (!res.ok) throw new Error('Status check failed');
            return res.json();
          })
          .then(async (data) => {
            if (data.status === 'APPROVED' || data.role === 'RECRUITER') {
              await signOut({ callbackUrl: `/login?callbackUrl=${encodeURIComponent(pathname)}&message=recruiter_approved` });
            } else if (data.status === 'PENDING') {
              router.push('/recruiter/pending');
            } else if (data.status === 'REJECTED') {
              router.push('/recruiter/rejected');
            } else {
              router.push('/recruiter/register');
            }
          })
          .catch((err) => {
            console.error('[RECRUITER_GATEKEEPER_ERROR]', err);
            router.push('/recruiter/register');
          })
          .finally(() => {
            verifyingRef.current = false;
          });
      }
    }
  }, [status, isApprovedRecruiter, isOnboardingPage, pathname, router]);

  // Dedicated clean minimalist layout for onboarding (register / pending / rejected)
  if (isOnboardingPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <Search className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-slate-900 text-lg">Jobsira</span>
              <span className="font-semibold text-blue-600 text-lg ml-1">Talent</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900 text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Espace Candidat
              </Button>
            </Link>
            {session && (
              <Button 
                variant="ghost" 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 pb-16">
          {children}
        </main>
      </div>
    );
  }

  // Waiting for gatekeeper redirect if unauthorized
  if (status === 'loading' || !isApprovedRecruiter) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const navLinks = [
    { href: '/recruiter/dashboard', label: "Vue d'ensemble", icon: BarChart3, exact: true },
    { href: '/recruiter', label: 'Recherche', icon: Users, exact: true },
    { href: '/recruiter/unlocks', label: 'Mes Profils', icon: Unlock },
    { href: '/recruiter/jobs', label: 'Mes Annonces', icon: Briefcase },
    { href: '/recruiter/analytics', label: 'Statistiques', icon: BarChart3 },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 shrink-0 flex items-center justify-between">
        <Link href="/recruiter/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">Jobsira</span>
            <span className="text-lg font-medium text-blue-600 ml-1">Talent</span>
          </div>
        </Link>
        <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 mt-4">Menu Principal</div>
        
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact 
            ? pathname === link.href 
            : pathname.startsWith(link.href);
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 shrink-0 border-t border-slate-200 space-y-2">
        {session ? (
          <>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                <User className="w-4 h-4 mr-3 text-slate-400" />
                Espace Candidat
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4 mr-3 text-rose-500" />
              Déconnexion
            </Button>
          </>
        ) : (
          <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <LogIn className="w-4 h-4 mr-2" />
              Connexion
            </Button>
          </Link>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Header & Overlay */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4">
        <Link href="/recruiter/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">Jobsira Talent</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 -mr-2 text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-4/5 max-w-sm bg-white flex flex-col h-full shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0 relative">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
      
      {/* Assistant IA */}
      <TalentChat isLocked={!isApprovedRecruiter} />
    </div>
  );
}
