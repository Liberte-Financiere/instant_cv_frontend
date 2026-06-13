'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, RefreshCw, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Étudiants (Mint Green) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative rounded-[2rem] p-6 lg:p-8 min-h-[380px] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 bg-emerald-50"
          >
            <div>
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                <GraduationCap className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-emerald-900 mb-4">Étudiants</h3>
              <p className="text-emerald-800 leading-relaxed text-sm lg:text-base">
                Décrochez votre premier emploi. Notre IA valorise votre formation et vos projets pour combler le manque d&apos;expérience.
              </p>
            </div>
            <Link href="/etudiants" className="flex items-center gap-2 text-emerald-600 font-bold mt-8 group-hover:gap-3 transition-all text-sm lg:text-base">
              En savoir plus <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
          </motion.div>

          {/* Card 2: Professionnels (Deep Dark Blue) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative rounded-[2rem] p-6 lg:p-8 min-h-[380px] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 bg-blue-950 text-white"
          >
            <div>
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm">
                <Briefcase className="w-7 h-7 text-blue-200" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Professionnels</h3>
              <p className="text-blue-100 leading-relaxed text-sm lg:text-base">
                Visez plus haut. Optimisez votre profil pour des postes de direction en mettant en avant vos résultats et votre expertise.
              </p>
            </div>
            <Link href="/professionnels" className="flex items-center gap-2 text-white font-bold mt-8 group-hover:gap-3 transition-all text-sm lg:text-base">
              En savoir plus <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
          </motion.div>

          {/* Card 3: Reconversion (Vibrant Gradient) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative rounded-[2rem] p-6 lg:p-8 min-h-[380px] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 bg-gradient-to-br from-orange-400 to-pink-600 text-white shadow-lg shadow-orange-500/20"
          >
            <div>
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                <RefreshCw className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Reconversion</h3>
              <p className="text-white/90 leading-relaxed text-sm lg:text-base">
                Changez de vie sans la peur du vide. Traduisez vos compétences passées dans le langage de votre futur secteur.
              </p>
            </div>
            <Link href="/reconversion" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-2.5 lg:px-6 lg:py-3 rounded-full font-bold mt-8 w-fit backdrop-blur-md transition-all text-sm lg:text-base">
              En savoir plus <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
          </motion.div>
          
          {/* Card 4: Recruteurs (Indigo Gradient) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="group relative rounded-[2rem] p-6 lg:p-8 min-h-[380px] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
          >
            <div>
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Recruteurs</h3>
              <p className="text-white/90 leading-relaxed text-sm lg:text-base">
                Trouvez la perle rare. Accédez à notre vivier de talents anonymisés et filtrez les profils qui matchent vos critères.
              </p>
            </div>
            <Link href="/recruiter" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-2.5 lg:px-6 lg:py-3 rounded-full font-bold mt-8 w-fit backdrop-blur-md transition-all text-sm lg:text-base">
              En savoir plus <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
