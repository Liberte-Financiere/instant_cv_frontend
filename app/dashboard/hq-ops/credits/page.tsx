'use client';

import { useState, useEffect } from 'react';
import {ShieldAlert, Search, PlusCircle, CheckCircle2, History, Loader2, Ghost, Wand2} from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name: string | null;
  email: string;
  credits: number;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

export default function AdminCreditPanel() {
  const { data: session, update } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [bannedFilter, setBannedFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amountToAdd, setAmountToAdd] = useState(35);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setPage(1); // Reset page to 1 when filters change
  }, [search, roleFilter, bannedFilter]);

  useEffect(() => {
    // Si la recherche est vide (moins de 2 caractères), on ne charge rien pour économiser la base de données.
    if (search.trim().length < 2) {
      setUsers([]);
      setTotalPages(1);
      setIsLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 400); // 400ms de délai de debounce pour ne pas spammer l'API

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleAddCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || amountToAdd <= 0) return;

    setIsAdding(true);
    try {
      const res = await fetch('/api/admin/users/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          amount: amountToAdd,
          type: 'PURCHASE', // considered as purchase
          description: `Recharge Manuelle WhatsApp (${amountToAdd} cr.)`
        }),
      });

      if (!res.ok) throw new Error('Erreur');
      
      const result = await res.json();
      toast.success(`Succès : ${amountToAdd} crédits ajoutés à ${selectedUser.name || selectedUser.email}`);
      setSelectedUser(null);
      fetchUsers(); // Refresh list
    } catch (error) {
      toast.error('Échec de la recharge de crédit.');
    } finally {
      setIsAdding(false);
    }
  };



  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Crédits</h1>
          <p className="text-slate-500 text-sm">Consulter et recharger manuellement les crédits utilisateurs</p>
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
                    <th className="p-4 rounded-tr-xl font-medium text-right">Action</th>
                 </tr>
              </thead>
              <tbody>
                 {isLoading ? (
                    <tr><td colSpan={7} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></td></tr>
                 ) : search.trim().length < 2 ? (
                    <tr>
                      <td colSpan={7} className="p-16 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-3">
                          <Search className="w-12 h-12 text-slate-200" />
                          <p className="text-lg font-medium text-slate-700">Recherchez un compte à recharger</p>
                          <p className="text-sm max-w-sm">Tapez l'adresse email ou le nom de l'utilisateur dans la barre ci-dessus pour le trouver.</p>
                        </div>
                      </td>
                    </tr>
                 ) : users.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-slate-500">Aucun utilisateur trouvé pour "{search}".</td></tr>
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
                             <Wand2 className="w-3.5 h-3.5" />
                             {user.credits}
                           </span>
                        </td>
                        <td className="p-4 text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => setSelectedUser(user)}
                               className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors text-xs font-semibold"
                             >
                               <PlusCircle className="w-4 h-4" /> Relancer
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

      {/* Manual Recharge Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
           <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Recharger un compte</h3>
              <p className="text-sm text-slate-500 mb-6">Ajouter des crédits manuellement pour <strong className="text-slate-900">{selectedUser.email}</strong></p>
              
              <form onSubmit={handleAddCredit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Montant de Crédits</label>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                       {[35, 80, 250, 500].map(amount => (
                         <button
                           key={amount}
                           type="button"
                           onClick={() => setAmountToAdd(amount)}
                           className={`py-2 px-1 text-center font-medium border rounded-lg text-sm transition-colors ${
                              amountToAdd === amount ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                           }`}
                         >+{amount}</button>
                       ))}
                    </div>
                    
                    <input 
                      type="number"
                      value={amountToAdd}
                      onChange={(e) => setAmountToAdd(parseInt(e.target.value) || 0)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      min={1}
                    />
                 </div>
                 
                 <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setSelectedUser(null)}
                      className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                    >Annuler</button>
                    <button 
                      type="submit" 
                      disabled={isAdding}
                      className="flex-1 flex justify-center items-center py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-colors gap-2"
                    >
                      {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                      Valider (+{amountToAdd})
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
