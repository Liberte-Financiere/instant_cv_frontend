'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { JobForm, JobFormData } from '@/components/jobs/JobForm';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const isRecruiter = session?.user?.role === 'RECRUITER' || session?.user?.role === 'ADMIN';
      if (!isRecruiter) {
        router.push('/dashboard');
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (formData: JobFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        maxApplications: formData.maxApplications ? parseInt(formData.maxApplications, 10) : undefined,
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(Boolean),
      };

      const res = await fetch('/api/recruiter/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Une erreur est survenue');
      }

      router.push('/recruiter/jobs');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return <JobForm mode="create" onSubmit={handleSubmit} loading={loading} />;
}
