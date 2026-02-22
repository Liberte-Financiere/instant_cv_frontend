'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileHeader } from '@/components/dashboard/MobileHeader';
import { OutOfCreditsModal } from '@/components/shared/OutOfCreditsModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed background layer to cover dark body */}
      <div className="fixed inset-0 bg-slate-50 -z-50" aria-hidden="true" />

      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Header with hamburger */}
      <MobileHeader />
      
      {/* Main content - no left padding on mobile */}
      <main className="lg:pl-72 w-full min-h-screen pt-14 lg:pt-0 bg-slate-50">
        {children}
      </main>
      
      {/* Global Modals */}
      <OutOfCreditsModal />
    </div>
  );
}

