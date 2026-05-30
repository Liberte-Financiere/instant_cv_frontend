'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
import { APP_CONFIG } from '@/lib/config';

export function TargetAudience() {
  return (
    <div className="bg-bg-dark py-24 px-4 border-t border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          theme="dark"
          title={`Pour qui est fait ${APP_CONFIG.name} ?`}
          description={<p>Peu importe où vous en êtes dans votre parcours, notre technologie s&apos;adapte à <span className="text-white font-medium">vos enjeux spécifiques</span>.</p>}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Étudiants (Mint Green) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative rounded-[2rem] p-8 min-h-[400px] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 bg-emerald-50"
          >
            <div>
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                <GraduationCap className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-900 mb-4">Étudiants</h3>
              <p className="text-emerald-800 leading-relaxed">
                Décrochez votre premier stage ou emploi. Notre IA valorise votre formation et vos projets académiques pour combler le manque d&apos;expérience.
              </p>
            </div>
            <Link href="/etudiants" className="flex items-center gap-2 text-emerald-600 font-bold mt-8 group-hover:gap-3 transition-all">
              En savoir plus <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Card 2: Professionnels (Deep Dark Blue) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative rounded-[2rem] p-8 min-h-[400px] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 bg-blue-950 text-white"
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
            <Link href="/professionnels" className="flex items-center gap-2 text-white font-bold mt-8 group-hover:gap-3 transition-all">
              En savoir plus <ArrowRight className="w-5 h-5" />
            </Link>
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
            <Link href="/reconversion" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full font-bold mt-8 w-fit backdrop-blur-md transition-all">
              En savoir plus <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          
          {/* Card 4: Entreprises & Recruteurs (Full Width, Indigo) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="group relative rounded-[2rem] p-8 md:col-span-3 flex flex-col md:flex-row items-center justify-between hover:-translate-y-2 transition-transform duration-300 bg-indigo-950 text-white shadow-xl shadow-indigo-900/20 border border-indigo-800/50 overflow-hidden"
          >
            {/* BG Decoration */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[50px] pointer-events-none" />

            <div className="flex-1 md:pr-12 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-500/30">
                <Briefcase className="w-4 h-4" /> B2B Portal
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Entreprises & Recruteurs</h3>
              <p className="text-indigo-100 leading-relaxed text-lg mb-8 max-w-2xl">
                Accédez à notre <span className="font-bold text-white">Talent Pool</span> exclusif. Filtrez, trouvez et débloquez les profils qualifiés (anonymisés) qui matchent exactement vos besoins. Gagnez un temps précieux sur votre sourcing.
              </p>
              <Link href="/recruiter" className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold w-fit transition-all shadow-lg shadow-indigo-500/25">
                Découvrir le vivier de talents <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
