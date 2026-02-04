'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Settings2 } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';

const SECTION_LABELS: Record<CVSectionId, string> = {
  summary: 'Profil',
  experience: 'Expériences',
  education: 'Éducation',
  skills: 'Compétences',
  languages: 'Langues',
  hobbies: 'Centres d\'intérêt',
  certifications: 'Formations',
  projects: 'Projets',
  references: 'Références',
  divers: 'Divers',
  qualities: 'Qualités',
};

interface SortableItemProps {
  id: CVSectionId;
}

function SortableItem({ id }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg transition-shadow ${
        isDragging ? 'shadow-lg ring-2 ring-blue-500/20 z-10' : 'hover:shadow-sm'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none p-1 text-slate-400 hover:text-slate-600"
        aria-label="Déplacer"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <span className="text-sm font-medium text-slate-700">
        {SECTION_LABELS[id]}
      </span>
    </div>
  );
}

export function SectionOrderEditor() {
  const { currentCV, updateSectionOrder } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!currentCV) return null;

  const sectionOrder = currentCV.sectionOrder || [...DEFAULT_SECTION_ORDER];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as CVSectionId);
      const newIndex = sectionOrder.indexOf(over.id as CVSectionId);
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      updateSectionOrder(newOrder);
    }
  };

  const handleReset = () => {
    updateSectionOrder([...DEFAULT_SECTION_ORDER]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors text-sm font-medium text-slate-700"
      >
        <Settings2 className="w-4 h-4" />
        <span>Ordre des sections</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Ordre des sections</h3>
                <p className="text-sm text-slate-500">Glissez-déposez pour réorganiser</p>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-blue-600 hover:underline"
              >
                Réinitialiser
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sectionOrder}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {sectionOrder.map((id) => (
                      <SortableItem key={id} id={id} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
