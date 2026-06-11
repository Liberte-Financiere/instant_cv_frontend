import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    // 1. Get total users count from our database
    const totalUsers = await prisma.user.count();

    // 2. Fetch stats from Brevo API
    const brevoApiKey = process.env.BREVO_API_KEY;
    
    let brevoStats = {
      emailsSent: 0,
      openRate: 0,
      clickRate: 0,
      chartData: [] as number[],
    };

    if (brevoApiKey) {
      // Try to get aggregated stats from Brevo
      try {
        const response = await fetch('https://api.brevo.com/v3/smtp/statistics/aggregatedReport', {
          headers: {
            'accept': 'application/json',
            'api-key': brevoApiKey
          }
        });

        if (response.ok) {
          const data = await response.json();
          const delivered = data.delivered || 0;
          const uniqueOpens = data.uniqueOpens || 0;
          const uniqueClicks = data.uniqueClicks || 0;

          brevoStats.emailsSent = delivered;
          brevoStats.openRate = delivered > 0 ? Number(((uniqueOpens / delivered) * 100).toFixed(1)) : 0;
          brevoStats.clickRate = delivered > 0 ? Number(((uniqueClicks / delivered) * 100).toFixed(1)) : 0;
        } else {
           console.warn("Brevo API stats request failed:", await response.text());
        }
      } catch (err) {
        console.error("Error fetching Brevo stats:", err);
      }
    }

    // Return actual stats (which will be 0 if no emails have been sent or if no API key is provided)
    // We only generate an empty chart data array if no chart data was pulled
    if (brevoStats.chartData.length === 0) {
      brevoStats.chartData = Array(15).fill(0);
    }

    return NextResponse.json({
      totalSubscribers: totalUsers,
      ...brevoStats
    });

  } catch (error) {
    console.error('Erreur API Stats Marketing:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
