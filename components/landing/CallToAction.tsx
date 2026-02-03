'use client';

export function CallToAction() {
  return (
    <div className="relative py-24 bg-[#0F172A] overflow-hidden">
      <div className="absolute inset-0 bg-[#2463eb]/5"></div>
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2463eb]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-6">Prêt à transformer votre carrière ?</h2>
        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Ne laissez pas un mauvais CV vous fermer des portes. Rejoignez Optijob aujourd'hui et prenez le contrôle de votre avenir professionnel.</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto flex cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-[#2463eb] hover:bg-[#1d4ed8] text-white text-lg font-bold shadow-lg shadow-[#2463eb]/25 transition-all hover:scale-105">
             Commencer gratuitement
          </button>
          <p className="text-slate-500 text-sm mt-4 sm:mt-0">Pas de carte de crédit requise</p>
        </div>
      </div>
    </div>
  );
}
