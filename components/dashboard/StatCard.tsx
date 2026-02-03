'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
  color?: string; // e.g., "blue", "green", "purple"
}

export function StatCard({ title, value, trend, icon: Icon, color = "blue" }: StatCardProps) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  }[color] || "bg-slate-50 text-slate-600";

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorStyles}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
           <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
             {trend}
           </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </div>
  );
}
