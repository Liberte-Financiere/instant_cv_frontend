'use client';

import { motion } from 'framer-motion';
import { ArrowRight, FileText, Sparkles, Zap, Download } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Sparkles,
    title: 'Design Moderne',
    description: 'Templates élégants et professionnels pour impressionner les recruteurs.',
  },
  {
    icon: Zap,
    title: 'Rapide & Simple',
    description: 'Créez votre CV en quelques minutes grâce à notre interface intuitive.',
  },
  {
    icon: Download,
    title: 'Export PDF',
    description: 'Téléchargez votre CV en PDF haute qualité, prêt à envoyer.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Nouveau: Intelligence Artificielle intégrée
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Créez des CV qui
              <br />
              <span className="gradient-text">défient la gravité</span>
            </h1>

            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme intuitive pour créer des CV professionnels qui se démarquent.
              Simple, rapide et élégant.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 group"
              >
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-indigo-500 hover:text-indigo-600 transition-all duration-300">
                <FileText className="w-5 h-5" />
                Voir les templates
              </button>
            </motion.div>
          </motion.div>

          {/* CV Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white rounded-2xl shadow-2xl shadow-indigo-500/10 border border-gray-100 p-8 max-w-4xl mx-auto">
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                </div>
                <div className="col-span-2 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                  <div className="h-3 bg-gray-100 rounded w-4/6" />
                  <div className="mt-6 h-4 bg-indigo-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Des outils puissants pour créer le CV parfait
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à créer votre CV ?
              </h2>
              <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
                Rejoignez des milliers de professionnels qui ont déjà transformé leur carrière avec Antigravity.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 group"
              >
                Créer mon CV maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            © 2024 Antigravity. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}