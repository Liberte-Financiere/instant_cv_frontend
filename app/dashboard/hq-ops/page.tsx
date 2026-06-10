'use client';

import Link from 'next/link';
import { LayoutList, Zap, MessageSquare, Mail, ShieldAlert } from 'lucide-react';

export default function HqOpsDashboard() {
  const cards = [
    {
      title: 'Gestion des Crédits',
      description: 'Superviser les transactions, annuler des paiements, et recréditer des comptes manuellement.',
      icon: Zap,
      href: '/dashboard/admin',
      color: 'text-amber-500',
      bg: 'bg-amber-100',
      borderColor: 'border-amber-200 hover:border-amber-400'
    },
    {
      title: 'Gestion des Tâches',
      description: 'Suivi des tâches internes de développement et des objectifs (Tickets).',
      icon: LayoutList,
      href: '/admin/tasks',
      color: 'text-blue-500',
      bg: 'bg-blue-100',
      borderColor: 'border-blue-200 hover:border-blue-400'
    },
    {
      title: 'Avis Utilisateurs',
      description: 'Modérer et lire les feedbacks laissés par les utilisateurs de Jobsira.',
      icon: MessageSquare,
      href: '/dashboard/admin/feedback',
      color: 'text-purple-500',
      bg: 'bg-purple-100',
      borderColor: 'border-purple-200 hover:border-purple-400'
    },
    {
      title: 'Marketing & Newsletter',
      description: 'Envoyer des e-mails aux utilisateurs inscrits pour annoncer des nouveautés (via Brevo).',
      icon: Mail,
      href: '/dashboard/hq-ops/marketing',
      color: 'text-emerald-500',
      bg: 'bg-emerald-100',
      borderColor: 'border-emerald-200 hover:border-emerald-400'
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Centre de Commandement (HQ Ops)</h1>
          <p className="text-slate-500">Bienvenue dans l'espace super-administrateur sécurisé.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {cards.map((card, idx) => (
          <Link 
            key={idx} 
            href={card.href}
            className={`flex items-start gap-4 p-6 bg-white rounded-2xl border transition-all duration-200 hover:shadow-md ${card.borderColor}`}
          >
            <div className={`p-4 rounded-xl shrink-0 ${card.bg} ${card.color}`}>
              <card.icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h2>
              <p className="text-slate-500 leading-relaxed text-sm">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
