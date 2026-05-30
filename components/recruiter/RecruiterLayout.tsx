'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Building2, Users, LogIn, Unlock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';

interface RecruiterLayoutProps {
  children: React.ReactNode;
}

export function RecruiterLayout({ children }: RecruiterLayoutProps) {
  const { data: session } = useSession();
  const isRecruiter = session?.user?.role === 'RECRUITER' || session?.user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/recruiter" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">Jobsira</span>
                <span className="text-lg font-light text-blue-300 ml-1">Talent</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/recruiter"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Rechercher
                </span>
              </Link>
              {isRecruiter && (
                <Link
                  href="/recruiter/unlocks"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Unlock className="w-4 h-4" />
                    Mes Profils
                  </span>
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-3">
              {session && (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                    <User className="w-4 h-4 mr-2" />
                    Espace Candidat
                  </Button>
                </Link>
              )}
              {isRecruiter ? (
                <Link href="/recruiter/unlocks">
                  <Button variant="glass" size="sm">
                    <Unlock className="w-4 h-4 mr-2" />
                    Mes Profils
                  </Button>
                </Link>
              ) : session ? (
                <Link href="/recruiter/register">
                  <Button variant="glass" size="sm">
                    <Building2 className="w-4 h-4 mr-2" />
                    Devenir Recruteur
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="glass" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
