'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  icon?: React.ReactNode;
  // Controlled mode props
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Accordion({ 
  title, 
  children, 
  defaultOpen = false, 
  className, 
  icon,
  isOpen: controlledIsOpen,
  onToggle
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  
  // Use controlled value if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  return (
    <div className={cn("border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm transition-all hover:shadow-md", className)}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-blue-600">{icon}</span>}
          <span className="font-bold text-slate-800 text-lg">{title}</span>
        </div>
        <motion.div
           animate={{ rotate: isOpen ? 180 : 0 }}
           transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-6 border-t border-slate-100">
               {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
