import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  description?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
  theme?: 'light' | 'dark';
}

export function SectionHeader({ 
  title, 
  description, 
  align = 'center', 
  className,
  theme = 'light' 
}: SectionHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
      "mb-16",
      align === 'center' ? 'text-center' : 'text-left',
      className
    )}>
      <h2 className={cn(
        "text-3xl md:text-4xl font-bold mb-4",
        theme === 'dark' ? 'text-white' : 'text-bg-dark'
      )}>
        {title}
      </h2>
      {description && (
        <div className={cn(
          "max-w-2xl text-lg",
          align === 'center' ? 'mx-auto' : '',
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        )}>
          {description}
        </div>
      )}
    </motion.div>
  );
}
