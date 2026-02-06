'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, RefreshCw, ArrowRight } from 'lucide-react';

const targets = [
  {
    title: 'Étudiants & Diplômés',
    description: 'Pas encore d&apos;expérience ? Notre IA valorise vos projets académiques et stages pour vous rendre irrésistible.',
    icon: GraduationCap,
    gradient: 'from-blue-400 to-cyan-300',
    tag: 'Stage & Premier Emploi'
  },
  {
    title: 'Professionnels',
    description: 'Visez plus haut. Structurez vos réussites et passez les filtres ATS pour accéder aux postes de management.',
    icon: Briefcase,
    gradient: 'from-purple-400 to-pink-300',
    tag: 'Carrière & Mobilité'
  },
  {
    title: 'En Reconversion',
    description: 'Changez de vie sans la peur du vide. Traduisez vos compétences passées dans le langage de votre futur métier.',
    icon: RefreshCw,
    gradient: 'from-amber-400 to-orange-300',
    tag: 'Nouveau Départ'
  }
];

import { SectionHeader } from '@/components/ui/SectionHeader';

export function TargetAudience() {
  return (
    <div className="bg-[#0F172A] py-24 px-4 border-t border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2463eb]/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          theme="dark"
          title="Pour qui est fait OptiJob ?"
          description={<p>Peu importe où vous en êtes dans votre parcours, notre technologie s&apos;adapte à <span className="text-white font-medium">vos enjeux spécifiques</span>.</p>}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Étudiants (Mint Green) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative rounded-[2rem] p-8 min-h-[400px] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 bg-[#ecfdf5]"
          >
            <div>
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                <GraduationCap className="w-7 h-7 text-[#059669]" />
              </div>
              <h3 className="text-3xl font-bold text-[#064e3b] mb-4">Étudiants</h3>
              <p className="text-[#065f46] leading-relaxed">
                Décrochez votre premier stage ou emploi. Notre IA valorise votre formation et vos projets académiques pour combler le manque d&apos;expérience.
              </p>
            </div>
            <button className="flex items-center gap-2 text-[#059669] font-bold mt-8 group-hover:gap-3 transition-all">
              En savoir plus <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Card 2: Professionnels (Deep Dark Blue) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative rounded-[2rem] p-8 min-h-[400px] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 bg-[#172554] text-white"
          >
            <div>
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm">
                <Briefcase className="w-7 h-7 text-blue-200" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Professionnels</h3>
              <p className="text-blue-100 leading-relaxed">
                Visez plus haut. Optimisez votre profil pour des postes de direction en mettant en avant vos résultats, votre leadership et votre expertise.
              </p>
            </div>
            <button className="flex items-center gap-2 text-white font-bold mt-8 group-hover:gap-3 transition-all">
              En savoir plus <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Card 3: Reconversion (Vibrant Gradient) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative rounded-[2rem] p-8 min-h-[400px] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 bg-gradient-to-br from-orange-400 to-pink-600 text-white shadow-lg shadow-orange-500/20"
          >
            <div>
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                <RefreshCw className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Reconversion</h3>
              <p className="text-white/90 leading-relaxed">
                Changez de vie. Identifiez vos compétences transférables et traduisez votre expérience passée dans le langage de votre futur secteur.
              </p>
            </div>
            <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full font-bold mt-8 w-fit backdrop-blur-md transition-all">
              En savoir plus <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
