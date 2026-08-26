'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { JobForm, JobFormData } from '@/components/jobs/JobForm';

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id: jobId } = resolvedParams;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState<Partial<JobFormData>>({});
  const [applicationCount, setApplicationCount] = useState(0);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const isRecruiter = session?.user?.role === 'RECRUITER' || session?.user?.role === 'ADMIN';
      if (!isRecruiter) {
        router.push('/dashboard');
      } else {
        fetchJob();
      }
    }
  }, [status, session, router, jobId]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) throw new Error('Offre introuvable');
      const data = await res.json();
      
      setInitialData({
        title: data.title || '',
        company: data.company || '',
        location: data.location || '',
        type: data.type || 'CDI',
        salary: data.salary || '',
        applyMethod: data.applyMethod || 'NATIVE',
        applyUrlOrMail: data.applyUrlOrMail || '',
        maxApplications: data.maxApplications ? data.maxApplications.toString() : '',
        expiresAt: data.expiresAt ? data.expiresAt.split('T')[0] : '',
        description: data.description || '',
        requirements: data.requirements ? data.requirements.join(', ') : '',
        requestedFiles: data.requestedFiles || ['CV'],
      });
      
      // The public /api/jobs/[id] might not have the application count, 
      // but in our ATS, recruiter jobs list returns it as `totalApplications`
      // Since we need it to lock the applyMethod, let's just make a separate call or rely on a new recruiter endpoint
      // For now, we will fetch the applications list length
      const appRes = await fetch(`/api/recruiter/jobs/${jobId}/applications`);
      if (appRes.ok) {
        const apps = await appRes.json();
        setApplicationCount(apps.length || 0);
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (formData: JobFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        maxApplications: formData.maxApplications ? parseInt(formData.maxApplications, 10) : null,
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(Boolean),
        applyUrlOrMail: formData.applyUrlOrMail || null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
      };

      const res = await fetch(`/api/recruiter/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Une erreur est survenue');
      }

      router.push('/recruiter/jobs');
      router.refresh();
    } catch (err: any) {
      alert(err.message); // Simple alert if error outside form
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-8 text-center text-slate-400">Chargement de l'offre...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-center text-rose-500">{error}</div>;
  }

  return (
    <JobForm 
      mode="edit" 
      initialData={initialData} 
      onSubmit={handleSubmit} 
      loading={loading}
      applicationCount={applicationCount}
    />
  );
}
