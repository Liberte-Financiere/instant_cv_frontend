'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, FileText, Mail, Mic, Activity, Clock, User, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  amount: number | string;
  type: string;
  description: string;
  createdAt: string;
}

interface StudentDetails {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  joinedAt: string;
  lastLogin: string | null;
  cvCount: number;
  coverLetterCount: number;
  interviewCount: number;
  consumedCredits: number;
  transactions: Transaction[];
}

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentDetails = async () => {
      try {
        const res = await fetch(`/api/b2b/school-admin/students/${studentId}`);
        if (!res.ok) {
          if (res.status === 404) {
             throw new Error('Étudiant introuvable ou ne faisant pas partie de votre école.');
          }
          throw new Error('Erreur lors du chargement des détails.');
        }
        const json = await res.json();
        setStudent(json.student);
      } catch (error: any) {
        toast.error(error.message);
        router.push('/dashboard/school-admin/students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId, router]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link 
          href="/dashboard/school-admin/students" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux étudiants
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {student.image ? (
                <img src={student.image} alt={student.name || ''} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{student.name || 'Étudiant sans nom'}</h1>
              <p className="text-slate-500">{student.email}</p>
            </div>
          </div>
          <div className="text-right text-sm text-slate-500">
             <div className="flex items-center gap-2 justify-end mb-1">
               <CalendarDays className="w-4 h-4" />
               Rejoint le {new Date(student.joinedAt).toLocaleDateString('fr-FR')}
             </div>
             {student.lastLogin && (
               <div className="flex items-center gap-2 justify-end">
                 <Clock className="w-4 h-4" />
                 Dernière connexion le {new Date(student.lastLogin).toLocaleDateString('fr-FR')}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">CVs Créés</p>
              <p className="text-2xl font-bold text-slate-900">{student.cvCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Lettres de Motivation</p>
              <p className="text-2xl font-bold text-slate-900">{student.coverLetterCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Entretiens IA</p>
              <p className="text-2xl font-bold text-slate-900">{student.interviewCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center flex-shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Crédits Consommés</p>
              <p className="text-2xl font-bold text-white">{student.consumedCredits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
           <h2 className="text-lg font-bold text-slate-900">Historique des transactions IA</h2>
           <p className="text-sm text-slate-500">Tracez l'utilisation des crédits par cet étudiant.</p>
        </div>
        
        {student.transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
             Aucune transaction enregistrée pour cet étudiant.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {student.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                       {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                         day: 'numeric',
                         month: 'short',
                         year: 'numeric',
                         hour: '2-digit',
                         minute: '2-digit'
                       })}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                       {tx.description}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                         Number(tx.amount) < 0 
                           ? 'bg-red-100 text-red-800' 
                           : 'bg-emerald-100 text-emerald-800'
                       }`}>
                         {Number(tx.amount) > 0 ? '+' : ''}{tx.amount} cr
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
