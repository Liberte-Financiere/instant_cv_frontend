import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const ADMIN_EMAILS = ['m9bikienga@gmail.com', 'optijob18@gmail.com'];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const isAdmin =
    session?.user?.role === 'ADMIN' ||
    ADMIN_EMAILS.includes(session?.user?.email || '');

  if (!isAdmin) {
    redirect('/');
  }

  return <>{children}</>;
}
