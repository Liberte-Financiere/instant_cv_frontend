'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { handleGoogleSignIn } from '@/actions/auth';

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      
      {/* LEFT SIDE: Visual & Testimonial (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative overflow-hidden items-center justify-center p-12">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2463eb]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-lg">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="mb-12"
          >
             <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
               Votre carrière mérite <span className="text-[#2463eb]">l&apos;excellence.</span>
             </h1>
             <p className="text-slate-400 text-lg">
               Rejoignez plus de 10,000 professionnels qui ont décroché le job de leurs rêves grâce à OptiJob.
             </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md"
          >
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(i => <div key={i} className="w-5 h-5 text-yellow-500 fill-current">★</div>)}
            </div>
            <p className="text-slate-200 text-lg italic mb-6">
              &quot;J&apos;ai refait mon CV en 10 minutes. Le lendemain, j&apos;avais 3 entretiens. L&apos;analyse IA est tout simplement bluffante.&quot;
            </p>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden relative">
                 <Image 
                   src="/avatars/avatar1.png" 
                   alt="User" 
                   fill
                   className="object-cover"
                 />
               </div>
               <div>
                 <div className="text-white font-bold">Sarah K.</div>
                 <div className="text-blue-400 text-sm">Product Designer</div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE: Google Auth */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative">
         <div className="w-full max-w-md text-center">
            
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
               <h2 className="text-3xl font-bold text-slate-900 mb-2">
                 Bienvenue sur OptiJob
               </h2>
               <p className="text-slate-500">
                 Créez des CVs professionnels en quelques clics
               </p>
            </motion.div>

            {/* Google Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button 
                onClick={() => handleGoogleSignIn()}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-slate-700 font-semibold text-lg group"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="group-hover:translate-x-1 transition-transform">
                  Continuer avec Google
                </span>
              </button>
            </motion.div>

            {/* Benefits */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 space-y-3"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Gratuit pour commencer
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pas de carte bancaire requise
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Connexion sécurisée via Google
              </div>
            </motion.div>

            {/* Footer */}
            <p className="mt-10 text-xs text-slate-400">
              En continuant, vous acceptez nos{' '}
              <a href="#" className="underline hover:text-slate-600">Conditions d&apos;utilisation</a>
              {' '}et notre{' '}
              <a href="#" className="underline hover:text-slate-600">Politique de confidentialité</a>
            </p>
         </div>
      </div>
    </div>
  );
}
