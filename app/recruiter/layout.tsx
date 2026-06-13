import { RecruiterLayout } from '@/components/recruiter/RecruiterLayout';

export default function RecruiterPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RecruiterLayout>{children}</RecruiterLayout>;
}
