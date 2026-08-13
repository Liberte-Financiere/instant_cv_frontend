'use client';

import { useEffect, useState } from 'react';
import { Users, Loader2, UserMinus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Student {
  id: string;
  name: string | null;
  email: string | null;
  joinedAt: string;
  consumedCredits: number;
}

export default function SchoolAdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/b2b/school-admin/students');
      if (!res.ok) throw new Error('Erreur de chargement des étudiants');
      const json = await res.json();
      setStudents(json.students || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string; name: string | null }>({ isOpen: false, id: '', name: null });

  const handleDetach = async () => {
    const { id, name } = confirmModal;
    setConfirmModal({ ...confirmModal, isOpen: false });
    
    try {
      const res = await fetch(`/api/b2b/school-admin/students?studentId=${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Erreur lors du détachement');
      
      toast.success('Étudiant retiré avec succès');
      setStudents(students.filter(s => s.id !== id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredStudents = students.filter(s => 
    s.email?.toLowerCase().includes(search.toLowerCase()) || 
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Mes Étudiants
          </h1>
          <p className="text-slate-500 mt-2">
            Gérez la liste des étudiants rattachés à votre établissement et consultez leur consommation IA.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
             <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
             Aucun étudiant trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rejoint le</th>
                  <th className="px-6 py-4">Crédits Consommés</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{student.name || '-'}</td>
                    <td className="px-6 py-4">{student.email || '-'}</td>
                    <td className="px-6 py-4">{new Date(student.joinedAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                         {student.consumedCredits} cr
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, id: student.id, name: student.name })}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Retirer l'étudiant"
                      >
                        <UserMinus className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleDetach}
        title="Retirer l'étudiant"
        description={`Êtes-vous sûr de vouloir retirer ${confirmModal.name || 'cet étudiant'} de votre établissement ? Il ne pourra plus utiliser vos crédits IA.`}
        confirmText="Oui, retirer"
        cancelText="Annuler"
      />
    </div>
  );
}
