import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    const { extractText } = await import('unpdf');
    const arrayBuffer = await file.arrayBuffer();
    const { text } = await extractText(new Uint8Array(arrayBuffer));
    const extractedText = text.join('\n');

    return NextResponse.json({ text: extractedText });

  } catch (error: any) {
    console.error('PDF Parse Global Error:', error);
    return NextResponse.json({ error: 'Failed to parse PDF', details: error.message }, { status: 500 });
  }
}
