'use client';

import { useEffect, useState } from 'react';
import { Users, Loader2, UserMinus, Search, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Student {
  id: string;
  name: string | null;
  email: string | null;
  joinedAt: string;
  consumedCredits: number;
  cvCount: number;
  coverLetterCount: number;
  interviewCount: number;
}

export default function SchoolAdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, totalPages: 1 });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/b2b/school-admin/students?page=${page}&limit=50`);
      if (!res.ok) throw new Error('Erreur de chargement des étudiants');
      const json = await res.json();
      setStudents(json.students || []);
      if (json.pagination) setPagination(json.pagination);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

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
                  <th className="px-6 py-4 text-center">Activités</th>
                  <th className="px-6 py-4 text-center">Crédits Consommés</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{student.name || '-'}</td>
                    <td className="px-6 py-4">{student.email || '-'}</td>
                    <td className="px-6 py-4">{new Date(student.joinedAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-xs">
                        <span title="CVs" className="px-2 py-1 bg-slate-100 rounded-md font-medium text-slate-600 border border-slate-200">
                          {student.cvCount} CV
                        </span>
                        <span title="Lettres" className="px-2 py-1 bg-slate-100 rounded-md font-medium text-slate-600 border border-slate-200">
                          {student.coverLetterCount} LM
                        </span>
                        <span title="Entretiens" className="px-2 py-1 bg-slate-100 rounded-md font-medium text-slate-600 border border-slate-200">
                          {student.interviewCount} IA
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                         {student.consumedCredits} cr
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/school-admin/students/${student.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => setConfirmModal({ isOpen: true, id: student.id, name: student.name })}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Retirer l'étudiant"
                        >
                          <UserMinus className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!loading && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {pagination.page} sur {pagination.totalPages} ({pagination.total} étudiants)
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            </div>
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
