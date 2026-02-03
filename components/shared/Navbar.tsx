'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/dashboard', label: 'Mes CV' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: -10, scale: 1.1 }}
              className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl"
            >
              <FileText className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Antigravity
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
            >
              Connexion
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          className={cn(
            'md:hidden overflow-hidden',
            !isOpen && 'pointer-events-none'
          )}
        >
          <div className="py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth"
              onClick={() => setIsOpen(false)}
              className="block mx-4 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center rounded-xl font-medium"
            >
              Connexion
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
