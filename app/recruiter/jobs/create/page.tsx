'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'CDI',
    salary: '',
    applyMethod: 'URL',
    applyUrlOrMail: '',
    expiresAt: '',
    description: '',
    requirements: '', // We'll split this by comma for the API
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/recruiter/jobs" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux annonces
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white">Publier une Offre d'Emploi</h1>
        <p className="text-slate-400 text-sm mt-1">
          La publication d'offres est 100% gratuite. Touchez des milliers de candidats qualifiés.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Titre du poste *</label>
            <input 
              required
              type="text" 
              placeholder="Ex: Développeur React"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 !text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Entreprise *</label>
            <input 
              required
              type="text" 
              placeholder="Ex: TechCorp"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 !text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Localisation</label>
            <input 
              type="text" 
              placeholder="Ex: Paris, Télétravail"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 !text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Type de contrat *</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 !text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            >
              <option value="CDI" className="bg-slate-900 text-white">CDI</option>
              <option value="CDD" className="bg-slate-900 text-white">CDD</option>
              <option value="Stage" className="bg-slate-900 text-white">Stage</option>
              <option value="Alternance" className="bg-slate-900 text-white">Alternance</option>
              <option value="Freelance" className="bg-slate-900 text-white">Freelance</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Salaire / TJM</label>
            <input 
              type="text" 
              placeholder="Ex: 45k - 55k €"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 !text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Méthode de candidature *</label>
            <select 
              value={formData.applyMethod}
              onChange={(e) => setFormData({...formData, applyMethod: e.target.value as 'URL' | 'EMAIL'})}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 !text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            >
              <option value="URL" className="bg-slate-900 text-white">Lien externe (Site web, ATS)</option>
              <option value="EMAIL" className="bg-slate-900 text-white">Email de candidature</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              {formData.applyMethod === 'URL' ? 'Lien de candidature *' : 'Email de candidature *'}
            </label>
            <input 
              required
              type={formData.applyMethod === 'EMAIL' ? 'email' : 'url'}
              placeholder={formData.applyMethod === 'URL' ? 'https://...' : 'recrutement@...'}
              value={formData.applyUrlOrMail}
              onChange={(e) => setFormData({...formData, applyUrlOrMail: e.target.value})}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 !text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Date limite de candidature</label>
            <input 
              type="date" 
              value={formData.expiresAt}
              onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 !text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Prérequis (séparés par des virgules)</label>
          <input 
            type="text" 
            placeholder="Ex: React, TypeScript, 3 ans d'expérience"
            value={formData.requirements}
            onChange={(e) => setFormData({...formData, requirements: e.target.value})}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 !text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Description du poste *</label>
          <textarea 
            required
            rows={8}
            placeholder="Décrivez les missions, l'équipe, les avantages..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 !text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none [color-scheme:dark]"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]">
            {loading ? 'Publication...' : (
              <>
                <Save className="w-4 h-4 mr-2" /> Publier l'offre
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
