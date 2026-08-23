import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(`http://127.0.0.1:8080/api/v1/filters`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Impossible de charger les filtres' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[FILTERS_GET]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
