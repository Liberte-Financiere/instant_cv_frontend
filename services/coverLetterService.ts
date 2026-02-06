import { CoverLetter } from '@/types/cover-letter';

export const CoverLetterService = {
  async getAll(): Promise<CoverLetter[]> {
    const res = await fetch('/api/cover-letters');
    if (!res.ok) throw new Error('Failed to fetch cover letters');
    return res.json();
  },

  async getById(id: string): Promise<CoverLetter> {
    const res = await fetch(`/api/cover-letters/${id}`);
    if (!res.ok) throw new Error('Failed to fetch cover letter');
    return res.json();
  },

  async create(cl: Partial<CoverLetter>): Promise<CoverLetter> {
    const res = await fetch('/api/cover-letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cl),
    });
    if (!res.ok) throw new Error('Failed to create cover letter');
    return res.json();
  },

  async update(id: string, cl: CoverLetter): Promise<CoverLetter> {
    const res = await fetch(`/api/cover-letters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cl),
    });
    if (!res.ok) throw new Error('Failed to update cover letter');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/cover-letters/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete cover letter');
  }
};
