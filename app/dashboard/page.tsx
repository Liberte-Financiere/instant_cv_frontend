'use client';

import { motion } from 'framer-motion';
import { Plus, FileText, Eye, Download, Search } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { CVCard } from '@/components/dashboard/CVCard';

export default function DashboardPage() {
  const { cvList, createNewCV, deleteCV } = useCVStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreateCV = () => {
    if (newTitle.trim()) {
      const id = createNewCV(newTitle.trim());
      setNewTitle('');
      setIsCreating(false);
      window.location.href = `/editor/${id}`;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
           <div className="text-slate-500 text-sm font-medium mb-1">
             {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
           </div>
           <h1 className="text-3xl font-bold text-[#0F172A]">
             Bonjour, Jean 👋
           </h1>
        </div>
        
        <div className="flex gap-3">
           <div className="relative hidden md:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher un CV..." 
                className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
              />
           </div>
           <button
             onClick={() => setIsCreating(true)}
             className="flex items-center gap-2 px-5 py-3 bg-[#2463eb] hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
           >
             <Plus className="w-5 h-5" />
             <span className="hidden sm:inline">Créer un CV</span>
           </button>
        </div>
      </header>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
           title="CV Créés" 
           value={cvList.length.toString()} 
           icon={FileText} 
           color="blue"
           trend="+2 cette semaine"
        />
        <StatCard 
           title="Profils Consultés" 
           value="124" 
           icon={Eye} 
           color="purple"
           trend="+15%"
        />
        <StatCard 
           title="Téléchargements" 
           value="8" 
           icon={Download} 
           color="green"
        />
      </div>

      {/* Main Content */}
      <div className="mb-6 flex items-center justify-between">
         <h2 className="text-xl font-bold text-slate-900">Mes Documents récents</h2>
         <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Voir tout</button>
      </div>

      {/* CV Grid or Empty State */}
      {cvList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Create New Card (Visual) */}
            <motion.div 
               whileHover={{ scale: 1.02 }}
               onClick={() => setIsCreating(true)}
               className="group cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-6 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-300 transition-colors h-[320px]"
            >
               <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <Plus className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
               </div>
               <p className="font-bold text-slate-600 group-hover:text-blue-600">Nouveau CV</p>
               <p className="text-xs text-slate-400 mt-1">Partir de zéro ou d'un modèle</p>
            </motion.div>

            {/* Existing CVs */}
            {cvList.map((cv) => (
              <CVCard 
                key={cv.id} 
                id={cv.id} 
                title={cv.title} 
                updatedAt={cv.updatedAt} 
                onDelete={deleteCV} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
             <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-blue-600" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Vous n'avez aucun CV</h3>
             <p className="text-slate-500 max-w-md mx-auto mb-8">
               Créez votre premier CV professionnel en quelques minutes grâce à notre assistant IA.
             </p>
             <button
               onClick={() => setIsCreating(true)}
               className="inline-flex items-center gap-2 px-8 py-4 bg-[#2463eb] text-white rounded-xl font-bold hover:shadow-xl hover:shadow-blue-600/20 transition-all"
             >
               <Plus className="w-5 h-5" />
               Créer mon premier CV
             </button>
          </div>
        )}

        {/* Modal Creation */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
             >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Nommez votre CV</h2>
                <input
                   autoFocus
                   type="text"
                   placeholder="Ex: CV Développeur 2024"
                   className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
                   value={newTitle}
                   onChange={(e) => setNewTitle(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleCreateCV()}
                />
                <div className="flex gap-3">
                   <button 
                     onClick={() => setIsCreating(false)}
                     className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                   >
                     Annuler
                   </button>
                   <button 
                     onClick={handleCreateCV}
                     disabled={!newTitle.trim()}
                     className="flex-1 py-3 font-bold text-white bg-[#2463eb] rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     Créer
                   </button>
                </div>
             </motion.div>
          </div>
        )}
    </div>
  );
}
