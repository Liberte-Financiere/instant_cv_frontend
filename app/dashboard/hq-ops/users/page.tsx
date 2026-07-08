'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Search, PlusCircle, CheckCircle2, History, Loader2, Sparkles, Ghost } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { clearAllLocalData } from '@/lib/utils';

interface User {
  id: string;
  name: string | null;
  email: string;
  credits: number;
  role: string;
  isBanned: boolean;
  createdAt: string;
  lastLogin: string | null;
  lastActivity: string | null;
}

export default function SupportPanel() {
  const { data: session, update } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [bannedFilter, setBannedFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isBanning, setIsBanning] = useState<string | null>(null);
  const [isImpersonating, setIsImpersonating] = useState<string | null>(null);

  useEffect(() => {
    setPage(1); // Reset page to 1 when filters change
  }, [search, roleFilter, bannedFilter]);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, bannedFilter, page]); // Refetch on filters or page change

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        page: page.toString(),
        limit: '10',
        role: roleFilter,
        banned: bannedFilter
      });
      const res = await fetch(`/api/admin/users/credits?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      toast.error("Erreur de récupération des données. Vous n'êtes peut-être pas Admin ?");
    } finally {
      setIsLoading(false);
    }
  };



  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    setIsBanning(userId);
    try {
      const res = await fetch('/api/admin/users/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: userId,
          isBanned: !currentStatus
        }),
      });

      if (!res.ok) throw new Error('Erreur API');
      
      toast.success(!currentStatus ? 'Utilisateur banni.' : 'Utilisateur réactivé.');
      fetchUsers();
    } catch (error) {
      toast.error('Échec de la modification du statut.');
    } finally {
      setIsBanning(null);
    }
  };

  const handleImpersonate = async (userId: string) => {
    setIsImpersonating(userId);
    try {
      const res = await fetch('/api/admin/impersonate', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ targetUserId: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur API');
      
      await clearAllLocalData(); // Clear local CVs before impersonating
      await update({ impersonationToken: data.token });
      window.location.href = '/dashboard';
    } catch(e: any) {
      toast.error(e.message || "Impossible d'impersoner cet utilisateur.");
    } finally {
      setIsImpersonating(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Utilisateurs</h1>
          <p className="text-slate-500 text-sm">Assistance, modération et connexion impersonnée</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
         {/* Search & Filters */}
         <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full flex-1">
               <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input
                 type="text"
                 placeholder="Rechercher un utilisateur (Nom ou Email)..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm"
               />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <select
                 value={roleFilter}
                 onChange={(e) => setRoleFilter(e.target.value)}
                 className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl py-3 px-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 w-full sm:w-auto cursor-pointer"
               >
                 <option value="ALL">Tous les rôles</option>
                 <option value="USER">Utilisateurs</option>
                 <option value="RECRUITER">Recruteurs</option>
                 <option value="ADMIN">Admins</option>
               </select>

               <select
                 value={bannedFilter}
                 onChange={(e) => setBannedFilter(e.target.value)}
                 className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl py-3 px-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 w-full sm:w-auto cursor-pointer"
               >
                 <option value="ALL">Tous statuts</option>
                 <option value="ACTIVE">Actifs</option>
                 <option value="BANNED">Bannis</option>
               </select>
            </div>
         </div>

         {/* Users Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500">
                 <tr>
                    <th className="p-4 rounded-tl-xl font-medium">Utilisateur</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Rôle</th>
                    <th className="p-4 font-medium">Statut</th>
                    <th className="p-4 font-medium">Crédits</th>
                    <th className="p-4 font-medium">Inscription</th>
                    <th className="p-4 font-medium">Dernière Activité</th>
                    <th className="p-4 rounded-tr-xl font-medium text-right">Action</th>
                 </tr>
              </thead>
              <tbody>
                 {isLoading ? (
                    <tr><td colSpan={8} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></td></tr>
                 ) : users.length === 0 ? (
                    <tr><td colSpan={8} className="p-8 text-center text-slate-500">Aucun utilisateur trouvé.</td></tr>
                 ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-medium text-slate-900">
                           {user.name || '---'}
                        </td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'RECRUITER' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                            user.isBanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {user.isBanned ? 'Banni' : 'Actif'}
                          </span>
                        </td>
                        <td className="p-4">
                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-100">
                             <Sparkles className="w-3.5 h-3.5" />
                             {user.credits}
                           </span>
                        </td>
                        <td className="p-4 text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-xs text-slate-500">
                           {(user.lastActivity || user.lastLogin) ? new Date((user.lastActivity || user.lastLogin) as string).toLocaleString('fr-FR', { 
                             day: '2-digit', month: '2-digit', year: 'numeric', 
                             hour: '2-digit', minute: '2-digit' 
                           }) : 'Jamais'}
                        </td>
                        <td className="p-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => handleToggleBan(user.id, user.isBanned)}
                               disabled={isBanning === user.id}
                               className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold disabled:opacity-50 ${
                                 user.isBanned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                               }`}
                             >
                               {isBanning === user.id ? '...' : user.isBanned ? 'Débannir' : 'Bannir'}
                             </button>
                             <button
                               onClick={() => handleImpersonate(user.id)}
                               disabled={isImpersonating === user.id || user.role === 'ADMIN'}
                               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                               title="Se connecter en tant que cet utilisateur"
                             >
                               {isImpersonating === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ghost className="w-4 h-4" />}
                               Login As
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))
                 )}
              </tbody>
            </table>
         </div>
         
         {/* Pagination Controls */}
         {!isLoading && totalPages > 1 && (
           <div className="flex items-center justify-between p-4 border-t border-slate-100">
             <button
               onClick={() => setPage(p => Math.max(1, p - 1))}
               disabled={page === 1}
               className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Précédent
             </button>
             <span className="text-sm text-slate-600">
               Page {page} sur {totalPages}
             </span>
             <button
               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
               disabled={page === totalPages}
               className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Suivant
             </button>
           </div>
         )}
      </div>
    </div>
  );
}
