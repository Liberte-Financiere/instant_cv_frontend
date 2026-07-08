'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { HqSidebar } from '@/components/dashboard/HqSidebar';
import { MobileHeader } from '@/components/dashboard/MobileHeader';
import { OutOfCreditsModal } from '@/components/shared/OutOfCreditsModal';
import { MarketingOptInModal } from '@/components/shared/MarketingOptInModal';
import { ImpersonationBanner } from '@/components/admin/ImpersonationBanner';
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
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <ImpersonationBanner />
        <div className="fixed inset-0 bg-slate-50 -z-50" aria-hidden="true" />
        <div className="hidden lg:block">
          <HqSidebar />
        </div>
        {/* We can reuse MobileHeader or create HqMobileHeader. For now we use the main layout padding */}
        <main className="lg:pl-72 w-full flex-grow bg-slate-50">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ImpersonationBanner />
      {/* Fixed background layer to cover dark body */}
      <div className="fixed inset-0 bg-slate-50 -z-50" aria-hidden="true" />

      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Header with hamburger */}
      <MobileHeader />
      
      {/* Main content - no left padding on mobile */}
      <main className="lg:pl-72 w-full flex-grow pt-14 lg:pt-0 bg-slate-50">
        {children}
      </main>
      
      {/* Global Modals */}
      <OutOfCreditsModal />
      <MarketingOptInModal />
    </div>
  );
}

