import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserCredits } from '@/lib/credits';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const credits = await getUserCredits(session.user.id);

    return NextResponse.json({ credits });
  } catch (error) {
    console.error('[CREDITS_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
