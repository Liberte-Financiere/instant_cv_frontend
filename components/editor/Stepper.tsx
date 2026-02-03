'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EditorStep } from '@/types/cv';
import { EDITOR_STEPS } from '@/types/cv';

interface StepperProps {
  currentStep: EditorStep;
  onStepChange: (step: EditorStep) => void;
}

export function Stepper({ currentStep, onStepChange }: StepperProps) {
  const currentIndex = EDITOR_STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="pb-8 mb-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
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
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                    isCompleted
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-500 text-white ring-4 ring-indigo-100'
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
                    'text-xs font-medium transition-colors hidden sm:block',
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
