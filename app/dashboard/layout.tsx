'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileHeader } from '@/components/dashboard/MobileHeader';
import { OutOfCreditsModal } from '@/components/shared/OutOfCreditsModal';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || '';
  const isHqOps = pathname.startsWith('/dashboard/hq-ops');

  if (isHqOps) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="fixed inset-0 bg-slate-50 -z-50" aria-hidden="true" />
        <main className="w-full min-h-screen">
          {children}
        </main>
      </div>
    );
  }

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

