'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Building2, Users, LogIn, Unlock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { TalentChat } from './TalentChat';

interface RecruiterLayoutProps {
  children: React.ReactNode;
}

export function RecruiterLayout({ children }: RecruiterLayoutProps) {
  const { data: session } = useSession();
  const isRecruiter = session?.user?.role === 'RECRUITER' || session?.user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-bg-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/recruiter" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">Jobsira</span>
                <span className="text-lg font-light text-primary ml-1">Talent</span>
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
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/5">
                    <User className="w-4 h-4 mr-2" />
                    Espace Candidat
                  </Button>
                </Link>
              )}
              {!isRecruiter && session && (
                <Link href="/recruiter/register">
                  <Button variant="glass" size="sm" className="border-primary/30 text-primary hover:text-white">
                    <Building2 className="w-4 h-4 mr-2" />
                    Devenir Recruteur
                  </Button>
                </Link>
              )}
              {!session && (
                <Link href="/login">
                  <Button variant="glass" size="sm" className="border-primary/30 text-primary hover:text-white">
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
      
      {/* Assistant IA - Visible uniquement pour les recruteurs/admins */}
      {isRecruiter && <TalentChat />}
    </div>
  );
}
