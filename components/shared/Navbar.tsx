'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#features', label: 'Fonctionnalités' },
  { href: '#pricing', label: 'Tarifs' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-10 flex items-center justify-center bg-[#2463eb] rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
               <FileText className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Optijob
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                className="text-slate-300 hover:text-white transition-colors font-medium text-sm"
              >
                {link.label}
              </button>
            ))}
            <Link
              href="/auth"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#2463eb] text-white rounded-full font-bold text-sm hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Se connecter
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          className={cn(
            'md:hidden overflow-hidden bg-[#0F172A] border-b border-white/10',
            !isOpen && 'pointer-events-none'
          )}
        >
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-slate-300 hover:text-white font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth"
              onClick={() => setIsOpen(false)}
              className="block w-full py-3 bg-[#2463eb] text-white text-center rounded-full font-bold"
            >
              Se connecter
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
