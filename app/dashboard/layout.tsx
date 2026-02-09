'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileHeader } from '@/components/dashboard/MobileHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Header with hamburger */}
      <MobileHeader />
      
      {/* Main content - no left padding on mobile */}
      <main className="lg:pl-72 w-full min-h-screen pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}

