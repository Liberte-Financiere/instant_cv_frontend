import Link from 'next/link';
import { 
  LayoutList, Zap, MessageSquare, Mail, ShieldAlert, Activity, 
  CreditCard, Users, ArrowUpRight, TrendingUp, CheckCircle,
  AlertTriangle, Clock, ArrowRight, Wallet, GraduationCap
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function HqOpsDashboard() {
  // 1. Définition des fenêtres temporelles
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  // 2. Requêtes DB parallélisées et optimisées (SELECT restrictifs pour éviter tout N+1)
  const [
    totalUsers,
    newUsersToday,
    monthlyRevenueSum,
    weeklyActiveUsers,
    totalAiCalls,
    failedAiCalls,
    recentTransactions,
    recentFeedbacks,
    usersLast7Days
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.paymentTransaction.aggregate({
      where: { status: 'completed', createdAt: { gte: startOfMonth } },
      _sum: { amount: true }
    }),
    prisma.user.count({ where: { lastActivity: { gte: sevenDaysAgo } } }),
    prisma.aILog.count({ where: { createdAt: { gte: oneDayAgo } } }),
    prisma.aILog.count({ where: { status: 'error', createdAt: { gte: oneDayAgo } } }),
    prisma.paymentTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        operatorName: true,
        user: { select: { name: true, email: true } }
      }
    }),
    prisma.platformFeedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: 2,
      select: {
        id: true,
        content: true,
        rating: true,
        createdAt: true,
        user: { select: { name: true, email: true } }
      }
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    })
  ]);

  // 3. Calculs des indicateurs secondaires
  const monthlyRevenue = monthlyRevenueSum._sum.amount || 0;
  const aiSuccessRate = totalAiCalls > 0 
    ? Math.round(((totalAiCalls - failedAiCalls) / totalAiCalls) * 100) 
    : 100;

  // 4. Construction des données de sparkline pour la croissance utilisateur (7 derniers jours)
  const userCountsByDay = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayStart = new Date(d.setHours(0, 0, 0, 0));
    const dayEnd = new Date(d.setHours(23, 59, 59, 999));
    const count = usersLast7Days.filter(u => u.createdAt >= dayStart && u.createdAt <= dayEnd).length;
    return count;
  }).reverse(); // Ordre chronologique

  const maxSparklineVal = Math.max(...userCountsByDay, 1);
  const sparklineWidth = 120;
  const sparklineHeight = 32;
  const sparklinePoints = userCountsByDay.map((count, idx) => {
    const x = (idx / 6) * sparklineWidth;
    const y = sparklineHeight - (count / maxSparklineVal) * (sparklineHeight - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const cards = [
    {
      title: 'Gestion des Utilisateurs',
      description: 'Superviser les comptes, bannir, et recréditer manuellement.',
      icon: Users,
      href: '/dashboard/hq-ops/users',
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      borderColor: 'border-amber-100 hover:border-amber-300'
    },
    {
      title: 'Transactions Financières',
      description: 'Voir tous les achats de crédits via LigdiCash ou autres.',
      icon: CreditCard,
      href: '/dashboard/hq-ops/transactions',
      color: 'text-red-500',
      bg: 'bg-red-50',
      borderColor: 'border-red-100 hover:border-red-300'
    },
    {
      title: 'Monitoring IA',
      description: 'Surveiller les requêtes IA, la latence et les erreurs des modèles.',
      icon: Activity,
      href: '/dashboard/hq-ops/ai-logs',
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      borderColor: 'border-rose-100 hover:border-rose-300'
    },
    {
      title: 'Gestion des Tâches',
      description: 'Suivi des tâches internes de développement et des tickets d\'équipe.',
      icon: LayoutList,
      href: '/dashboard/hq-ops/tasks',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      borderColor: 'border-blue-100 hover:border-blue-300'
    },
    {
      title: 'Tracker d\'Activités',
      description: 'Historique et timeline des déploiements, bugs fixés et événements majeurs.',
      icon: Activity,
      href: '/dashboard/hq-ops/activities',
      color: 'text-cyan-500',
      bg: 'bg-cyan-50',
      borderColor: 'border-cyan-100 hover:border-cyan-300'
    },
    {
      title: 'Avis Utilisateurs',
      description: 'Modérer et lire les feedbacks laissés par les utilisateurs de Jobsira.',
      icon: MessageSquare,
      href: '/dashboard/hq-ops/feedback',
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      borderColor: 'border-purple-100 hover:border-purple-300'
    },
    {
      title: 'Marketing & Newsletter',
      description: 'Envoyer des e-mails aux utilisateurs inscrits pour annoncer des nouveautés.',
      icon: Mail,
      href: '/dashboard/hq-ops/marketing',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      borderColor: 'border-emerald-100 hover:border-emerald-300'
    },
    {
      title: 'Suivi des Dépenses',
      description: 'Suivre les coûts opérationnels : serveurs, abonnements, domaines.',
      icon: Wallet,
      href: '/dashboard/hq-ops/expenses',
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      borderColor: 'border-orange-100 hover:border-orange-300'
    },
    {
      title: 'Gestion B2B (Écoles)',
      description: 'Administrer les partenariats institutionnels, crédits et accès administrateurs.',
      icon: GraduationCap,
      href: '/dashboard/hq-ops/schools',
      color: 'text-teal-500',
      bg: 'bg-teal-50',
      borderColor: 'border-teal-100 hover:border-teal-300'
    }
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Hero Banner Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 lg:p-8 border border-slate-800 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Centre de Commandement (HQ Ops)</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Supervision technique et financière globale de JobSira en temps réel.
          </p>
        </div>
      </div>

      {/* Modernized KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI: Financial */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Revenus Mensuels</span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CreditCard className="w-5 h-5" /></span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {monthlyRevenue.toLocaleString('fr-FR')} <span className="text-sm font-bold text-slate-500">F</span>
            </h2>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-4 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> Ce mois-ci (FCFA)
          </p>
        </div>

        {/* KPI: Traffic */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Utilisateurs Actifs</span>
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Activity className="w-5 h-5" /></span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {weeklyActiveUsers}
            </h2>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-blue-600 font-semibold">Actifs sur 7 jours</span>
            <svg width={sparklineWidth} height={sparklineHeight} className="text-blue-500 overflow-visible">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklinePoints}
              />
            </svg>
          </div>
        </div>

        {/* KPI: AI Health */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Succès Moteur IA</span>
              <span className={`p-2 rounded-lg ${aiSuccessRate > 95 ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}><Zap className="w-5 h-5" /></span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {aiSuccessRate}%
            </h2>
          </div>
          <p className={`text-xs font-semibold mt-4 flex items-center gap-1 ${aiSuccessRate > 95 ? 'text-indigo-600' : 'text-amber-600'}`}>
            {aiSuccessRate > 95 ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            Statut des API (24h)
          </p>
        </div>

        {/* KPI: Total Registrations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Utilisateurs</span>
              <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Users className="w-5 h-5" /></span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {totalUsers}
            </h2>
          </div>
          <p className="text-xs text-amber-600 font-semibold mt-4">
            +{newUsersToday} aujourd'hui
          </p>
        </div>
      </div>

      {/* Main Double-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & Operations Navigation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Outils d'Administration</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.map((card, idx) => (
              <Link 
                key={idx} 
                href={card.href}
                className={`flex flex-col p-6 bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.borderColor}`}
              >
                <div className={`p-3.5 rounded-xl w-12 h-12 flex items-center justify-center mb-4 ${card.bg} ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h4 className="text-md font-bold text-slate-900 mb-1 flex items-center gap-1 group">
                  {card.title}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-400" />
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed flex-grow">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: Live Activities Stream */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900">Activité en Direct</h3>
          
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6">
            {/* Live Section: Transactions */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Transactions Récentes
              </h4>
              
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-slate-900">{tx.user?.name || tx.user?.email || 'Anonyme'}</div>
                      <div className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleDateString('fr-FR')} à {new Date(tx.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-slate-900">+{tx.amount} F</div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        tx.status === 'completed' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : tx.status === 'failed' 
                            ? 'bg-red-50 text-red-700' 
                            : 'bg-orange-50 text-orange-700'
                      }`}>
                        {tx.status === 'completed' ? 'RÉUSSI' : tx.status === 'failed' ? 'ÉCHOUÉ' : 'ATTENTE'}
                      </span>
                    </div>
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                  <div className="text-center py-4 text-xs text-slate-400">Aucun paiement récent</div>
                )}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Live Section: Feedbacks */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Retours & Avis
              </h4>
              
              <div className="space-y-3">
                {recentFeedbacks.map((fb) => (
                  <div key={fb.id} className="text-xs space-y-1 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{fb.user?.name || 'Avis Utilisateur'}</span>
                      <span className="flex gap-0.5 text-amber-500 font-bold">
                        {'★'.repeat(fb.rating || 5)}{'☆'.repeat(5 - (fb.rating || 5))}
                      </span>
                    </div>
                    <p className="text-slate-500 leading-relaxed italic line-clamp-2">
                      "{fb.content}"
                    </p>
                  </div>
                ))}
                {recentFeedbacks.length === 0 && (
                  <div className="text-center py-4 text-xs text-slate-400">Aucun avis récent</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
