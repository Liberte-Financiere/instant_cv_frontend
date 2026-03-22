'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Trash2, GripVertical, X, ArrowLeft, Search, Filter } from 'lucide-react';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

const COLUMNS = [
  { id: 'todo', label: 'A faire', color: '#64748b', bg: 'bg-slate-50' },
  { id: 'in_progress', label: 'En cours', color: '#3b82f6', bg: 'bg-blue-50' },
  { id: 'testing', label: 'En test', color: '#f59e0b', bg: 'bg-amber-50' },
  { id: 'done', label: 'Terminé', color: '#22c55e', bg: 'bg-green-50' },
];

const PRIORITIES = [
  { id: 'low', label: 'Basse', color: 'bg-slate-200 text-slate-700' },
  { id: 'medium', label: 'Moyenne', color: 'bg-blue-100 text-blue-700' },
  { id: 'high', label: 'Haute', color: 'bg-red-100 text-red-700' },
];

function PriorityBadge({ priority }: { priority: string }) {
  const p = PRIORITIES.find((pr) => pr.id === priority) || PRIORITIES[1];
  return (
    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${p.color}`}>
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

  const priorityCounts = PRIORITIES.map((p) => ({
    ...p,
    count: tasks.filter((t) => t.priority === p.id).length,
  }));

  const doneCount = statusCounts.find((s) => s.id === 'done')?.count || 0;
  const progressPercent = Math.round((doneCount / total) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Progress global */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-700">Progression</h3>
          <span className="text-2xl font-black text-slate-800">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #3b82f6, #22c55e)',
            }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">{doneCount}/{total} tâches terminées</p>
      </div>

      {/* Distribution par statut */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Par statut</h3>
        <div className="space-y-2">
          {statusCounts.map((s) => {
            const pct = Math.round((s.count / total) * 100);
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-slate-600 w-20 shrink-0">{s.label}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: s.color }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 w-6 text-right">{s.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribution par priorité */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Par priorité</h3>
        <div className="flex items-end gap-3 h-24">
          {priorityCounts.map((p) => {
            const maxCount = Math.max(...priorityCounts.map((x) => x.count), 1);
            const barHeight = Math.max((p.count / maxCount) * 100, 8);
            const barColors: Record<string, string> = {
              low: '#94a3b8',
              medium: '#3b82f6',
              high: '#ef4444',
            };
            return (
              <div key={p.id} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-slate-700">{p.count}</span>
                <div className="w-full flex items-end" style={{ height: '60px' }}>
                  <div
                    className="w-full rounded-t-md transition-all duration-500"
                    style={{
                      height: `${barHeight}%`,
                      backgroundColor: barColors[p.id] || '#94a3b8',
                    }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">{p.label}</span>
              </div>
            );
          })}
        </div>
      </div>
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

  const isEditing = !!task?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description, priority, assignee, status });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Implémenter le système de paiement"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Détails de la tâche..."
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Assigné</label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {isEditing ? 'Sauvegarder' : 'Créer'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
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
                className="flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: col.color }}
                    />
                    <h2 className="font-bold text-sm text-slate-700 uppercase tracking-wide">
                      {col.label}
                    </h2>
                    <span className="text-xs font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openCreateModal(col.id)}
                    className="p-1 hover:bg-slate-200 rounded transition-colors"
                    title={`Ajouter dans "${col.label}"`}
                  >
                    <Plus className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Column Body */}
                <div
                  className={`flex-1 rounded-xl ${col.bg} border-2 border-dashed border-transparent p-2 space-y-2 min-h-[200px] transition-colors ${
                    draggedTaskId ? 'border-slate-300' : ''
                  }`}
                >
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      onClick={() => openEditModal(task)}
                      className={`bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-slate-200 transition-all group ${
                        draggedTaskId === task.id ? 'opacity-50 scale-95' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-slate-300 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <PriorityBadge priority={task.priority} />
                          </div>
                          <p className="text-sm font-semibold text-slate-800 leading-snug">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          {task.assignee && (
                            <div className="mt-2 flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                {task.assignee[0]?.toUpperCase()}
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium">
                                {task.assignee}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-xs text-slate-400 font-medium">
                      {hasActiveFilters ? 'Aucun résultat' : 'Glisser une tâche ici'}
                    </div>
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
