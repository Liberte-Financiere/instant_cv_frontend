import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function HqOpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  // Protect the entire hq-ops folder: only admins can access
  if (!session || !isAdmin) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
