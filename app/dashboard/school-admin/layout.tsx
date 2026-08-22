import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isSchoolAdmin = session?.user?.role === 'SCHOOL_ADMIN' && !!session?.user?.schoolId;

  // Protect the entire school-admin folder: only school admins with a schoolId can access
  if (!session || !isSchoolAdmin) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
