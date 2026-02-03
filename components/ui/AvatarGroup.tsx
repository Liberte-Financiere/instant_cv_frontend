import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AvatarGroupProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  borderColor?: string;
  className?: string;
}

export function AvatarGroup({
  count = 3,
  size = 'md',
  borderColor = 'border-[#0F172A]',
  className
}: AvatarGroupProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className={cn("flex -space-x-3", className)}>
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "rounded-full border-2 bg-gray-300 overflow-hidden relative",
            sizes[size],
            borderColor
          )}
        >
          {/* Using standard img tag for simplicity with mapped public assets, 
              or Next.js Image if we had the static imports. 
              Given the dynamic path, standard img is fine or Next Image with width/height */}
          <img
            src={`/avatars/avatar${(i % 3) + 1}.png`} 
            alt={`User ${i + 1}`} 
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
