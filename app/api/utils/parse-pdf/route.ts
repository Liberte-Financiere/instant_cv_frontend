import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// Force usage of Node.js runtime for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use pdfjs-dist legacy build for Node.js compatibility (polyfilled environments)
    // Dynamic import to avoid build-time analysis issues if any
    // @ts-ignore
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');

    // Configure worker (though often not needed for simple text extraction in legacy mode, 
    // sometimes required to avoid warnings or fake worker errors)
    // For Node environment, we typically don't need to load the worker script file via URL,
    // but pdfjs needs a worker. In legacy node build, it often falls back effectively.
    // However, explicitly setting verbosity helps debugging.
    
    // Load document
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer), // pdfjs expects Uint8Array or ArrayBuffer
      useSystemFonts: true,
      disableFontFace: true, // Disable font parsing issues
    });

    const doc = await loadingTask.promise;
    const numPages = doc.numPages;
    let extractedText = '';

    // Parallel processing could be faster, but sequential is safer for memory on serverless
    for (let i = 1; i <= numPages; i++) {
        try {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();
            
            // Extract strings and join them
            const pageText = textContent.items
                .filter((item: any) => item.str)
                .map((item: any) => item.str)
                .join(' ');
            
            extractedText += pageText + '\n\n';
            
            // Cleanup page resources
            page.cleanup();
        } catch (pageError) {
            console.warn(`[API] Error parsing page ${i}`, pageError);
        }
    }
    
    // Cleanup document
    if (doc.destroy) await doc.destroy(); // destroy exists in newer versions, or cleanup

    return NextResponse.json({ text: extractedText });

  } catch (error: any) {
    console.error('PDF Parse Global Error:', error);
    return NextResponse.json({ error: 'Failed to parse PDF', details: error.message }, { status: 500 });
  }
}
