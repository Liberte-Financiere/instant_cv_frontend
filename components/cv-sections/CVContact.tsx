'use client';

import { Mail, Phone, MapPin, Linkedin, Github, Globe, Twitter } from 'lucide-react';
import { PersonalInfo, SocialLink, CVVariant } from '@/types/cv';

interface CVContactProps {
  personalInfo: PersonalInfo;
  socialLinks?: SocialLink[];
  variant: CVVariant;
  layout?: 'vertical' | 'horizontal' | 'sidebar';
  accentColor?: string;
}

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  github: Github,
  portfolio: Globe,
  twitter: Twitter,
  other: Globe,
};

export function CVContact({ personalInfo, socialLinks = [], variant, layout = 'vertical', accentColor }: CVContactProps) {
  const isSidebar = layout === 'sidebar';
  
  const contactItems = [
    { icon: Mail, value: personalInfo.email, breakAll: true },
    { icon: Phone, value: personalInfo.phone },
    { icon: MapPin, value: personalInfo.address },
  ].filter(item => item.value);

  if (contactItems.length === 0 && socialLinks.length === 0) return null;

  const baseTextClass = isSidebar ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className={layout === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-3'}>
      {contactItems.map((item, idx) => (
        <div key={idx} className={`flex items-${item.icon === MapPin ? 'start' : 'center'} gap-3 text-sm ${baseTextClass}`}>
          <item.icon 
            className={`w-4 h-4 shrink-0 ${item.icon === MapPin ? 'mt-0.5' : ''}`} 
            style={accentColor ? { color: accentColor } : undefined}
          />
          <span className={item.breakAll ? 'break-all' : ''}>{item.value}</span>
        </div>
      ))}
      
      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className={`flex ${layout === 'horizontal' ? 'gap-3' : 'flex-wrap gap-2 mt-4'}`}>
          {socialLinks.map((link) => {
            const Icon = platformIcons[link.platform] || Globe;
            return (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:underline"
                style={accentColor ? { color: accentColor } : undefined}
              >
                <Icon className="w-4 h-4" />
                {layout !== 'horizontal' && <span>{link.label || link.platform}</span>}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
