'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, ArrowRight, Github, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

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
               Votre carrière mérite <span className="text-[#2463eb]">l'excellence.</span>
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
              "J'ai refait mon CV en 10 minutes. Le lendemain, j'avais 3 entretiens. L'analyse IA est tout simplement bluffante."
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

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative">
         <div className="w-full max-w-md">
            
            {/* Header */}
            <div className="text-center mb-10">
               <h2 className="text-3xl font-bold text-slate-900 mb-2">
                 {isLogin ? 'Bon retour parmi nous !' : 'Créer un compte'}
               </h2>
               <p className="text-slate-500">
                 {isLogin ? 'Entrez vos identifiants pour accéder à votre espace.' : 'Commencez gratuitement votre essai de 7 jours.'}
               </p>
            </div>

            {/* Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-8 relative">
                <div 
                   className="absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out top-1"
                   style={{ left: isLogin ? '4px' : 'calc(50%)' }}
                />
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${isLogin ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Connexion
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${!isLogin ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Inscription
                </button>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.form
                key={isLogin ? 'login' : 'register'}
                initial="enter"
                animate="center"
                exit="exit"
                variants={slideVariants}
                transition={{ duration: 0.3 }}
                className="space-y-5"
                onSubmit={(e) => e.preventDefault()}
              >
                {!isLogin && (
                   <Input 
                      icon={User} 
                      type="text" 
                      placeholder="Nom complet" 
                   />
                )}
                
                <Input 
                   icon={Mail} 
                   type="email" 
                   placeholder="Adresse email" 
                />

                <div className="space-y-2">
                   <Input 
                      icon={Lock} 
                      type="password" 
                      placeholder="Mot de passe" 
                   />
                   {isLogin && (
                     <div className="flex justify-end">
                       <Link href="#" className="text-xs text-[#2463eb] hover:underline font-medium">
                         Mot de passe oublié ?
                       </Link>
                     </div>
                   )}
                </div>

                <Button className="w-full text-base py-6" size="lg">
                  {isLogin ? 'Se connecter' : "S'inscrire"} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.form>
            </AnimatePresence>

            {/* Social Auth */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-50 px-2 text-slate-500 font-medium">Ou continuer avec</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 font-medium">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 font-medium">
                 <div className="bg-[#0077b5] text-white p-0.5 rounded-sm">
                   <span className="font-bold text-xs px-0.5">in</span>
                 </div>
                 LinkedIn
              </button>
            </div>

            {!isLogin && (
               <div className="mt-8 text-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-2">
                     <CheckCircle2 className="w-4 h-4 text-green-500" /> 7 jours d'essai gratuit
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                     <CheckCircle2 className="w-4 h-4 text-green-500" /> Pas de carte requise
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
