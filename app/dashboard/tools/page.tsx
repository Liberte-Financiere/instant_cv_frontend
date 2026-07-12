'use client';

import { motion } from 'framer-motion';
import { Sparkles, Linkedin, Camera, Globe, Mail, Coins, ClipboardList, ArrowRight, Lock, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'photo',
    title: 'Photo Pro',
    description: 'À partir d\'un simple selfie, obtenez un véritable portrait de qualité studio, idéal pour sublimer votre CV et vos profils professionnels.',
    icon: Camera,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    status: 'active',
  },
  {
    id: 'portfolio',
    title: 'Générateur de Portfolio',
    description: 'Transformez votre CV en un mini-site web portfolio ultra design, optimisé pour convertir les recruteurs.',
    icon: Globe,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    status: 'coming_soon',
  },
  {
    id: 'remove-bg',
    title: 'Détourage Magique',
    description: 'Supprimez l\'arrière-plan de n\'importe quelle photo instantanément grâce à notre technologie de vision avancée.',
    icon: ImageIcon,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    status: 'active',
  },
  {
    id: 'bilan',
    title: 'Bilan de Compétences',
    description: 'Analysez votre parcours pour identifier vos forces, découvrir les métiers adaptés et obtenir des recommandations de formations ou certificats à suivre.',
    icon: ClipboardList,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    status: 'active',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Boîte à Outils</h1>
            <p className="text-slate-500 mt-1">Super-pouvoirs exclusifs pour accélérer votre carrière.</p>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tools.map((tool) => (
          <motion.div
            key={tool.id}
            variants={itemVariants}
            className="group relative bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 rounded-2xl p-6 transition-all duration-300 overflow-hidden"
          >
            {/* Background Gradient Hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br from-transparent to-${tool.color.split('-')[1]}-500`} />
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.bgColor}`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              
              {tool.status === 'coming_soon' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
                  <Lock className="w-3 h-3" />
                  Bientôt
                </span>
              )}
            </div>

            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {tool.description}
              </p>
            </div>

            <div className="mt-auto relative z-10">
              {tool.status === 'coming_soon' ? (
                <button 
                  disabled
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 text-slate-500 text-sm font-medium transition-all border border-slate-200 opacity-70 cursor-not-allowed"
                >
                  En développement
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link 
                  href={`/dashboard/tools/${tool.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 text-slate-500 text-sm font-medium transition-all group-hover:bg-slate-100 group-hover:text-slate-800 border border-slate-200"
                >
                  Découvrir
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
