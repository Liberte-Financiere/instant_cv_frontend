'use client';

import { motion } from 'framer-motion';
import { Plus, FileText, Trash2, Edit, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useCVStore } from '@/store/useCVStore';
import { useState } from 'react';

export default function DashboardPage() {
  const { cvList, createNewCV, deleteCV } = useCVStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreateCV = () => {
    if (newTitle.trim()) {
      const id = createNewCV(newTitle.trim());
      setNewTitle('');
      setIsCreating(false);
      // Navigate to editor
      window.location.href = `/editor/${id}`;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes CV</h1>
            <p className="mt-1 text-gray-600">
              Gérez et créez vos curriculum vitae
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Nouveau CV
          </button>
        </motion.div>

        {/* Create CV Modal */}
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsCreating(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Créer un nouveau CV
              </h2>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Titre de votre CV (ex: CV Marketing 2024)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCV()}
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateCV}
                  disabled={!newTitle.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Créer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CV Grid */}
        {cvList.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {cvList.map((cv, index) => (
              <motion.div
                key={cv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden"
              >
                {/* CV Preview */}
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 p-4 relative">
                  <div className="bg-white rounded-lg shadow-sm h-full p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full" />
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
                        <div className="h-1.5 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1.5 bg-gray-100 rounded w-full" />
                      <div className="h-1.5 bg-gray-100 rounded w-5/6" />
                      <div className="h-1.5 bg-gray-100 rounded w-4/6" />
                    </div>
                  </div>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link
                      href={`/editor/${cv.id}`}
                      className="p-3 bg-white rounded-xl hover:bg-indigo-500 hover:text-white transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => deleteCV(cv.id)}
                      className="p-3 bg-white rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* CV Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {cv.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Modifié le {formatDate(cv.updatedAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aucun CV pour le moment
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Commencez par créer votre premier CV professionnel. C&apos;est simple et rapide !
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Créer mon premier CV
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
