import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Activity as ActivityIcon, Rocket, Bug, Users, Megaphone, Server, Clock, CalendarDays, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AddActivityButton from './AddActivityButton';
import DeleteActivityButton from './DeleteActivityButton';

// Utility to get the right icon and color for the activity type
function getTypeDetails(type: string) {
  switch (type) {
    case 'feature':
      return { icon: Rocket, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' };
    case 'bug':
      return { icon: Bug, color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200' };
    case 'meeting':
      return { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200' };
    case 'marketing':
      return { icon: Megaphone, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' };
    case 'devops':
      return { icon: Server, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };
    default:
      return { icon: ActivityIcon, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' };
  }
}

export default async function ActivitiesPage() {
  // 1. Protection de la route (Double vérification)
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // 2. Fetch data
  const activities = await prisma.companyActivity.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Group by date (DD/MM/YYYY) for cleaner timeline display
  const groupedActivities = activities.reduce((acc, activity) => {
    const dateStr = activity.createdAt.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(activity);
    return acc;
  }, {} as Record<string, typeof activities>);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Link href="/dashboard/hq-ops" className="hover:underline flex items-center gap-1 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Retour au HQ
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ActivityIcon className="w-6 h-6 text-blue-600" />
            Tracker d'Activités
          </h1>
          <p className="text-slate-500 mt-1">Historique des déploiements, corrections et événements JobSira.</p>
        </div>
        
        <AddActivityButton />
      </div>

      {/* TIMELINE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        {activities.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">Aucune activité enregistrée</h3>
            <p className="text-slate-500 mt-1">Commencez par ajouter votre premier événement !</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-100 ml-4 md:ml-6 space-y-12 pb-4">
            {Object.entries(groupedActivities).map(([dateLabel, dayActivities]) => (
              <div key={dateLabel} className="relative">
                {/* Date Header Indicator */}
                <div className="flex items-center mb-6">
                  <div className="absolute -left-[9px] md:-left-[11px] w-4 h-4 rounded-full bg-slate-200 border-4 border-white shadow-sm"></div>
                  <h3 className="pl-6 md:pl-8 font-bold text-slate-800 capitalize flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                    {dateLabel}
                  </h3>
                </div>

                {/* Day's Activities */}
                <div className="space-y-6">
                  {dayActivities.map((activity) => {
                    const { icon: Icon, color, bg, border } = getTypeDetails(activity.type);
                    return (
                      <div key={activity.id} className="relative pl-6 md:pl-8 group">
                        {/* Event Marker */}
                        <div className={`absolute -left-[16px] md:-left-[18px] w-8 h-8 rounded-full ${bg} border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110`}>
                          <Icon className={`w-3.5 h-3.5 ${color}`} />
                        </div>

                        {/* Event Card */}
                        <div className={`bg-white rounded-xl border ${border} p-5 shadow-sm hover:shadow-md transition-shadow`}>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                            <h4 className="text-lg font-bold text-slate-800">{activity.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full w-fit">
                                <Clock className="w-3.5 h-3.5" />
                                {activity.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <DeleteActivityButton id={activity.id} />
                            </div>
                          </div>
                          
                          {activity.description && (
                            <p className="text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
                              {activity.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-50">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                              {activity.author.substring(0, 2)}
                            </div>
                            <span className="text-xs font-medium text-slate-500">Par {activity.author}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
