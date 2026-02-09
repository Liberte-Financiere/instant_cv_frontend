'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
  color?: string;
  href?: string;
}

export function StatCard({ title, value, trend, icon: Icon, color = "blue", href }: StatCardProps) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  }[color] || "bg-slate-50 text-slate-600";

  const content = (
    <>
      <div className="flex items-start justify-between mb-2 md:mb-4">
        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${colorStyles}`}>
          <Icon className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        {trend && (
           <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
             {trend}
           </span>
        )}
      </div>
      <div>
        <p className="text-xs md:text-sm font-medium text-slate-500 mb-0.5 md:mb-1">{title}</p>
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </>
  );

  const className = `block bg-white p-3 md:p-6 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all ${href ? 'cursor-pointer hover:border-blue-200' : ''}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}


