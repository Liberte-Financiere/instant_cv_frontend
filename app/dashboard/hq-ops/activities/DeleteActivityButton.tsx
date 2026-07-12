'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { deleteActivity } from './actions';

export default function DeleteActivityButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) return;
    
    setIsDeleting(true);
    try {
      await deleteActivity(id);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression');
      setIsDeleting(false); // Only reset if error, if success component will unmount
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
      title="Supprimer cette activité"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
