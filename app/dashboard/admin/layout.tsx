import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const isAdmin = session?.user?.role === 'ADMIN' || 
    ['m9bikienga@gmail.com', 'optijob18@gmail.com'].includes(session?.user?.email || '');

  // Protect the entire admin folder: only admins can access
  if (!session || !isAdmin) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
