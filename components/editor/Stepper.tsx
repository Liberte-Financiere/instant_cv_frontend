'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EditorStep } from '@/types/cv';
import { EDITOR_STEPS } from '@/types/cv';
import { useRef, useEffect } from 'react';

interface StepperProps {
  currentStep: EditorStep;
  onStepChange: (step: EditorStep) => void;
}

export function Stepper({ currentStep, onStepChange }: StepperProps) {
  const currentIndex = EDITOR_STEPS.findIndex((s) => s.key === currentStep);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active step on mobile
  useEffect(() => {
    if (scrollRef.current) {
      const activeButton = scrollRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentStep]);

  return (
    <div className="pb-4 sm:pb-8 mb-4 sm:mb-6 border-b border-gray-100">
      {/* Mobile: scrollable pill strip */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 px-1 snap-x snap-mandatory lg:hidden"
      >
        {EDITOR_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = step.key === currentStep;

          return (
            <button
              key={step.key}
              data-active={isCurrent}
              onClick={() => onStepChange(step.key)}
              className={cn(
                'snap-center shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap',
                isCurrent
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                  : isCompleted
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'bg-gray-100 text-gray-400'
              )}
            >
              {isCompleted ? (
                <Check className="w-3 h-3" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-current/10 flex items-center justify-center text-[10px]">
                  {index + 1}
                </span>
              )}
              {step.label}
            </button>
          );
        })}
      </div>

      {/* Desktop: full stepper with connecting lines */}
      <div className="hidden lg:flex items-center justify-between px-2">
        {EDITOR_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = step.key === currentStep;

          return (
            <div key={step.key} className="flex items-center flex-1">
              <button
                onClick={() => onStepChange(step.key)}
                className={cn(
                  'flex flex-col items-center gap-2 group',
                  (isCurrent || isCompleted) && 'cursor-pointer'
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300',
                    isCompleted
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-500 text-white ring-2 ring-indigo-200 ring-offset-1'
                      : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                <span
                  className={cn(
                    'text-xs font-medium transition-colors',
                    isCurrent
                      ? 'text-indigo-600'
                      : isCompleted
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </button>

              {index < EDITOR_STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-colors',
                    index < currentIndex ? 'bg-indigo-500' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
