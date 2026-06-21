import Link from 'next/link';
import { LayoutList, Zap, MessageSquare, Mail, ShieldAlert, Activity, CreditCard, Users } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function HqOpsDashboard() {
  // Fetch KPIs in parallel for better performance
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [totalUsers, newUsersToday, creditStats] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.creditTransaction.groupBy({
      by: ['type'],
      _sum: { amount: true }
    })
  ]);

  // Calculate consumed (USAGE) and distributed (PURCHASE/SIGNUP/BONUS)
  let creditsConsumed = 0;
  let creditsDistributed = 0;
  
  creditStats.forEach(stat => {
    if (stat.type === 'USAGE') {
      creditsConsumed += Math.abs(stat._sum.amount || 0);
    } else {
      creditsDistributed += (stat._sum.amount || 0);
    }
  });

  const cards = [
    {
      title: 'Gestion des Utilisateurs (CRM)',
      description: 'Superviser les comptes, bannir, et recréditer manuellement.',
      icon: Users,
      href: '/dashboard/hq-ops/credits',
      color: 'text-amber-500',
      bg: 'bg-amber-100',
      borderColor: 'border-amber-200 hover:border-amber-400'
    },
    {
      title: 'Transactions Financières',
      description: 'Voir tous les achats de crédits via LigdiCash ou autres.',
      icon: CreditCard,
      href: '/dashboard/hq-ops/transactions',
      color: 'text-indigo-500',
      bg: 'bg-indigo-100',
      borderColor: 'border-indigo-200 hover:border-indigo-400'
    },
    {
      title: 'Monitoring IA (Logs)',
      description: 'Surveiller les requêtes IA, la latence et les erreurs des modèles.',
      icon: Activity,
      href: '/dashboard/hq-ops/ai-logs',
      color: 'text-rose-500',
      bg: 'bg-rose-100',
      borderColor: 'border-rose-200 hover:border-rose-400'
    },
    {
      title: 'Avis Utilisateurs',
      description: 'Modérer et lire les feedbacks laissés par les utilisateurs de Jobsira.',
      icon: MessageSquare,
      href: '/dashboard/hq-ops/feedback',
      color: 'text-purple-500',
      bg: 'bg-purple-100',
      borderColor: 'border-purple-200 hover:border-purple-400'
    },
    {
      title: 'Gestion des Tâches',
      description: 'Suivi des tâches internes de développement et des objectifs (Tickets).',
      icon: LayoutList,
      href: '/dashboard/hq-ops/tasks',
      color: 'text-blue-500',
      bg: 'bg-blue-100',
      borderColor: 'border-blue-200 hover:border-blue-400'
    },
    {
      title: 'Marketing & Newsletter',
      description: 'Envoyer des e-mails aux utilisateurs inscrits pour annoncer des nouveautés.',
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

      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Utilisateurs</p>
          <p className="text-2xl font-bold text-slate-900">{totalUsers}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Inscriptions (Aujourd'hui)</p>
          <p className="text-2xl font-bold text-green-600">+{newUsersToday}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Crédits Distribués</p>
          <p className="text-2xl font-bold text-blue-600">{creditsDistributed}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Crédits Consommés (IA)</p>
          <p className="text-2xl font-bold text-rose-600">{creditsConsumed}</p>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <Link 
            key={idx} 
            href={card.href}
            className={`flex flex-col p-6 bg-white rounded-2xl border transition-all duration-200 hover:shadow-md ${card.borderColor}`}
          >
            <div className={`p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-4 ${card.bg} ${card.color}`}>
              <card.icon className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h2>
            <p className="text-slate-500 text-sm leading-relaxed flex-grow">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
