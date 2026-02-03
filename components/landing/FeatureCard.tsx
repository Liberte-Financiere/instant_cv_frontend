'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: React.ReactNode;
  icon: LucideIcon;
  variant?: 'white' | 'indigo';
  className?: string;
  children?: React.ReactNode;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  variant = 'white',
  className,
  children
}: FeatureCardProps) {
  const isDark = variant === 'indigo';

  return (
    <div className={cn(
      "rounded-2xl p-8 shadow-lg flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 overflow-hidden relative group min-h-[300px]",
      isDark ? "bg-[#312e81] text-white shadow-xl" : "bg-white border border-slate-100",
      className
    )}>
      {isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#4338ca] to-[#1e1b4b] opacity-90 pointer-events-none" />
      )}
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className={cn(
            "w-12 h-12 md:w-14 md:h-14 rounded-full md:rounded-lg flex items-center justify-center mb-6",
            isDark ? "bg-white/10 text-blue-300 backdrop-blur-sm" : "bg-blue-50 text-[#2463eb]",
             // Specific color overrides if needed can be handled by className or prop extension, 
             // but keeping it simple for now or using the classes passed from parent if strictly necessary.
             // Actually, the white cards had individual colors (red, purple). Let's make the wrapper flexible.
          )}>
            <Icon className="w-8 h-8" />
          </div>
          
          <h3 className={cn("text-xl md:text-2xl font-bold mb-2", !isDark && "text-[#0F172A]")}>
            {title}
          </h3>
          
          <div className={cn("text-sm mb-6", isDark ? "text-indigo-200" : "text-slate-500")}>
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
