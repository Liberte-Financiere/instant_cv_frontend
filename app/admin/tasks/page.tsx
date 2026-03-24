'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Trash2, GripVertical, X, ArrowLeft, Search, Filter, Calendar, Tag as TagIcon, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { format, isPast, isToday, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignee: string | null;
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const COLUMNS = [
  { id: 'todo', label: 'À faire', color: '#64748b', bg: 'bg-slate-50/50' },
  { id: 'in_progress', label: 'En cours', color: '#3b82f6', bg: 'bg-blue-50/50' },
  { id: 'testing', label: 'En test', color: '#f59e0b', bg: 'bg-amber-50/50' },
  { id: 'done', label: 'Terminé', color: '#10b981', bg: 'bg-emerald-50/50' },
];

const PRIORITIES = [
  { id: 'low', label: 'Basse', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  { id: 'medium', label: 'Moyenne', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { id: 'high', label: 'Haute', color: 'bg-red-50 text-red-600 border-red-100' },
];

function PriorityBadge({ priority }: { priority: string }) {
  const p = PRIORITIES.find((pr) => pr.id === priority) || PRIORITIES[1];
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${p.color}`}>
      {p.label}
    </span>
  );
}

function StatsPanel({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  if (total === 0) return null;

  const statusCounts = COLUMNS.map((col) => ({
    ...col,
    count: tasks.filter((t) => t.status === col.id).length,
  }));

  const doneCount = statusCounts.find((s) => s.id === 'done')?.count || 0;
  const progressPercent = Math.round((doneCount / total) * 100);
  const highPriorityCount = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Overall Progress */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-3xl font-black text-slate-800 tracking-tight">{progressPercent}%</span>
          </div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Progression Globale</h3>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full shadow-[0_0_12px_rgba(59,130,246,0.3)]"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}
            />
          </div>
          <p className="text-[10px] font-bold text-slate-500">{doneCount} sur {total} tâches terminées</p>
        </div>
      </motion.div>

      {/* Status Distribution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
      >
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          Répartition par statut
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {statusCounts.map((s) => {
            const pct = Math.round((s.count / total) * 100);
            return (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div className="relative w-full aspect-square flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-50" strokeWidth="3" />
                      <motion.circle 
                        cx="18" cy="18" r="16" fill="none" 
                        stroke={s.color} strokeWidth="3" strokeDasharray="100"
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: 100 - pct }}
                        transition={{ duration: 1, delay: 0.5 }}
                        strokeLinecap="round"
                      />
                   </svg>
                   <span className="absolute text-[10px] font-black text-slate-700">{s.count}</span>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase text-center leading-tight">{s.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Critical Tasks */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 bg-red-50 rounded-xl group-hover:rotate-12 transition-transform">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <span className="text-3xl font-black text-red-600 tracking-tight">{highPriorityCount}</span>
        </div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Urgences Critiques</h3>
        <p className="text-[10px] text-slate-500 font-bold leading-relaxed mb-4">
          Tâches de haute priorité non terminées nécessitant une attention immédiate.
        </p>
        <div className="flex -space-x-2">
           {[...Array(Math.min(highPriorityCount, 5))].map((_, i) => (
             <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600 shadow-sm">
               !
             </div>
           ))}
           {highPriorityCount > 5 && (
             <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
               +{highPriorityCount - 5}
             </div>
           )}
        </div>
      </motion.div>
    </div>
  );
}

interface TaskModalProps {
  task: Partial<Task> | null;
  onClose: () => void;
  onSave: (data: Partial<Task>) => void;
  onDelete?: () => void;
}

function TaskModal({ task, onClose, onSave, onDelete }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [assignee, setAssignee] = useState(task?.assignee || '');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '');
  const [tagInput, setTagInput] = useState(task?.tags?.join(', ') || '');

  const isEditing = !!task?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const tags = tagInput.split(',').map(t => t.trim()).filter(t => t !== '');
    
    onSave({ 
      title, 
      description, 
      priority, 
      assignee, 
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      tags
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isEditing ? 'bg-blue-500' : 'bg-green-500'}`} />
            {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Titre de la tâche</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                placeholder="Ex: Optimisation du moteur de recherche"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none shadow-inner"
                rows={3}
                placeholder="Détails, objectifs ou notes..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Assigné à</label>
                <div className="relative">
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                    placeholder="Nom du membre"
                  />
                  <GripVertical className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Date limite</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Priorité</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none shadow-inner"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Statut Initial</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none shadow-inner"
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Tags (séparés par des virgules)</label>
              <div className="relative">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                  placeholder="Design, Fix, Urgent..."
                />
                <TagIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold group"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Supprimer
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                {isEditing ? 'Mettre à jour' : 'Créer la tâche'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function TaskCard({ task, onClick, onDragStart, isDragged }: { task: Task, onClick: () => void, onDragStart: () => void, isDragged: boolean }) {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'done';
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate)) && task.status !== 'done';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer transition-shadow group relative overflow-hidden ${
        isDragged ? 'opacity-40 scale-95 shadow-none' : ''
      }`}
    >
      {/* Priority Indicator */}
      <div className="flex items-center justify-between mb-3">
        <PriorityBadge priority={task.priority} />
        {task.priority === 'high' && task.status !== 'done' && (
           <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" 
           />
        )}
      </div>

      <h4 className="text-sm font-bold text-slate-800 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.map((tag, i) => (
            <span key={i} className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md border border-slate-200/50">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
        <div className="flex items-center gap-2">
           {task.assignee ? (
             <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                  {task.assignee[0]?.toUpperCase()}
                </div>
                <span className="text-[10px] text-slate-500 font-bold max-w-[60px] truncate">{task.assignee}</span>
             </div>
           ) : (
             <div className="w-6 h-6 rounded-full border border-dashed border-slate-200 flex items-center justify-center">
               <Plus className="w-3 h-3 text-slate-300" />
             </div>
           )}
        </div>

        {task.dueDate && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${
            isOverdue ? 'bg-red-50 text-red-600' : 
            isDueToday ? 'bg-amber-50 text-amber-600' : 
            'bg-slate-50 text-slate-500'
          }`}>
            <Clock className="w-3 h-3" />
            {isOverdue ? 'Retard' : isDueToday ? 'Aujourd\'hui' : format(new Date(task.dueDate), 'dd MMM', { locale: fr })}
          </div>
        )}
      </div>

      {/* Overdue highlight */}
      {isOverdue && (
        <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10px] right-[-10px] w-5 h-5 bg-red-500 rotate-45" />
        </div>
      )}
    </motion.div>
  );
}

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalTask, setModalTask] = useState<Partial<Task> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.assignee?.toLowerCase().includes(q)
      );
    }

    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    return result;
  }, [tasks, searchQuery, priorityFilter]);

  const handleSave = async (data: Partial<Task>) => {
    try {
      if (modalTask?.id) {
        const res = await fetch(`/api/admin/tasks/${modalTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const updated = await res.json();
          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        }
      } else {
        const res = await fetch('/api/admin/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const created = await res.json();
          setTasks((prev) => [...prev, created]);
        }
      }
    } catch (err) {
      console.error('Failed to save task', err);
    }
    setShowModal(false);
    setModalTask(null);
  };

  const handleDelete = async () => {
    if (!modalTask?.id) return;
    try {
      await fetch(`/api/admin/tasks/${modalTask.id}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((t) => t.id !== modalTask.id));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
    setShowModal(false);
    setModalTask(null);
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task || task.status === newStatus) {
      setDraggedTaskId(null);
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === draggedTaskId ? { ...t, status: newStatus } : t))
    );
    setDraggedTaskId(null);

    try {
      await fetch(`/api/admin/tasks/${draggedTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to move task', err);
      fetchTasks();
    }
  };

  const openCreateModal = (status: string = 'todo') => {
    setModalTask({ status });
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setModalTask(task);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasActiveFilters = searchQuery.trim() || priorityFilter !== 'all';

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Task Board</h1>
              <p className="text-sm text-slate-500">{tasks.length} tâches au total</p>
            </div>
          </div>
          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouvelle tâche
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6">
        {/* Stats Panel */}
        <StatsPanel tasks={tasks} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rechercher une tâche..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes priorités</option>
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={() => { setSearchQuery(''); setPriorityFilter('all'); }}
                className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-3 h-3" />
                Effacer
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <span className="text-xs text-slate-500 font-medium">
              {filteredTasks.length} résultat{filteredTasks.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {COLUMNS.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col h-full min-h-[500px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm"
                      style={{ backgroundColor: col.color }}
                    />
                    <h2 className="font-black text-xs text-slate-600 uppercase tracking-widest">
                      {col.label}
                    </h2>
                    <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-100 w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openCreateModal(col.id)}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-blue-500"
                    title={`Ajouter dans "${col.label}"`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Column Body */}
                <div
                  className={`flex-1 rounded-3xl ${col.bg} border-2 border-dashed border-transparent p-3 space-y-3 transition-all duration-300 ${
                    draggedTaskId ? 'ring-2 ring-blue-200 border-blue-300 bg-blue-50/30' : ''
                  }`}
                >
                  <AnimatePresence mode="popLayout">
                    <LayoutGroup>
                      {columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onClick={() => openEditModal(task)}
                          onDragStart={() => handleDragStart(task.id)}
                          isDragged={draggedTaskId === task.id}
                        />
                      ))}
                    </LayoutGroup>
                  </AnimatePresence>

                  {columnTasks.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-32 text-center"
                    >
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-2 shadow-sm border border-slate-50">
                        <Plus className="w-5 h-5 text-slate-200" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {hasActiveFilters ? 'Aucun résultat' : 'Vide'}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <TaskModal
          task={modalTask}
          onClose={() => {
            setShowModal(false);
            setModalTask(null);
          }}
          onSave={handleSave}
          onDelete={modalTask?.id ? handleDelete : undefined}
        />
      )}
    </div>
  );
}
