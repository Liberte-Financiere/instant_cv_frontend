import { CV } from '@/types/cv';

export const CVService = {
  async getAll(): Promise<CV[]> {
    const res = await fetch('/api/cv');
    if (!res.ok) throw new Error('Failed to fetch CVs');
    return res.json();
  },

  async getById(id: string): Promise<CV> {
    const res = await fetch(`/api/cv/${id}`);
    if (!res.ok) throw new Error('Failed to fetch CV');
    return res.json();
  },

  async create(cv: Partial<CV>): Promise<CV> {
    const res = await fetch('/api/cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cv),
    });
    if (!res.ok) throw new Error('Failed to create CV');
    return res.json();
  },

  async update(id: string, cv: CV): Promise<CV> {
    const res = await fetch(`/api/cv/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cv),
    });
    if (!res.ok) throw new Error('Failed to update CV');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/cv/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete CV');
  }
};
