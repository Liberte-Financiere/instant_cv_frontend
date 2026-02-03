'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const faqs = [
  {
    question: "Est-ce que les CVs sont vraiment compatibles ATS ?",
    answer: "Absolument. Nos templates sont codés pour être parfaitement lisibles par les robots recruteurs (ATS). Nous évitons les éléments graphiques complexes qui bloquent la lecture, tout en gardant un design moderne pour l'œil humain."
  },
  {
    question: "Puis-je modifier mon CV après l'avoir téléchargé ?",
    answer: "Oui, vous pouvez revenir sur votre espace membre à tout moment pour faire des modifications et re-télécharger votre CV. Vos versions sont sauvegardées automatiquement."
  },
  {
    question: "Comment fonctionne l'essai gratuit ?",
    answer: "Le mode Découverte est gratuit à vie. Il vous permet de créer un CV et de tester l'éditeur. Pour débloquer l'export HD sans filigrane et l'analyse IA illimitée, vous pouvez passer au plan Pro."
  },
  {
    question: "Mes données personnelles sont-elles protégées ?",
    answer: "La confidentialité est notre priorité. Vos données ne sont jamais vendues. Elles servent uniquement à générer vos documents. Vous pouvez supprimer votre compte et toutes vos données en un clic depuis votre espace."
  },
  {
    question: "L'IA redactrice fonctionne-t-elle pour tous les secteurs ?",
    answer: "Oui, notre IA a été entraînée sur des millions de descriptions de postes variés (Tech, Santé, Commerce, BTP...). Elle adapte le vocabulaire et le ton en fonction du poste visé."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-24 px-4 border-t border-slate-100">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Questions Fréquentes"
          description="Tout ce que vous devez savoir pour lancer votre carrière avec OptiJob."
          align="center"
        />

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-2xl transition-all duration-300 ${
                openIndex === index 
                  ? 'border-blue-200 bg-blue-50/30' 
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
              >
                <span className={`text-lg font-bold transition-colors ${
                  openIndex === index ? 'text-[#2463eb]' : 'text-slate-800'
                }`}>
                  {faq.question}
                </span>
                <div className={`p-2 rounded-full transition-colors ${
                   openIndex === index ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  {openIndex === index ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
