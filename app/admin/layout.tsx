import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const isAdmin = session?.user?.role === 'ADMIN';

  if (!isAdmin) {
    redirect('/');
  }

  return <>{children}</>;
}
