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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Lazy load pdf-parse strictly inside handler, exactly like analyze route
    let PDFParse;
    try {
      // @ts-ignore
      const pdfModule = require('pdf-parse');
      // Attempt to find the class constructor
      PDFParse = pdfModule.PDFParse || pdfModule.default?.PDFParse;
      
      // Fallback: in some environments pdf-parse is just the function itself
      if (!PDFParse) {
        // Double check if pdfModule itself is the function (v1 behavior)
         if (typeof pdfModule === 'function') {
            const data = await pdfModule(buffer);
            return NextResponse.json({ text: data.text });
         } else if (typeof pdfModule.default === 'function') {
             const data = await pdfModule.default(buffer);
             return NextResponse.json({ text: data.text });
         }
         throw new Error('PDFParse class or function not found in module');
      }
    } catch (e) {
      console.error('[API] Failed to load pdf-parse:', e);
      return NextResponse.json({ error: 'Server Configuration Error: PDF Parser missing' }, { status: 500 });
    }

    // Use Class based approach from analyze route
    let extractedText = '';
    let parser;
    try {
        // @ts-ignore
        parser = new PDFParse({ data: buffer });
        const data = await parser.getText();
        extractedText = data.text;
        
        // Cleanup if destroy exists
        if (parser.destroy) await parser.destroy();
        
    } catch (pdfError) {
        console.error('[API] PDF Class Parsing Error:', pdfError);
        // Try fallback function call if class failed
        try {
             // @ts-ignore
             const pdfModule = require('pdf-parse');
             const simpleParse = pdfModule.default || pdfModule;
             const data = await simpleParse(buffer);
             extractedText = data.text;
        } catch (fallbackError) {
            console.error('[API] PDF Fallback Parsing Error:', fallbackError);
            return NextResponse.json({ error: 'Failed to read PDF file structure.' }, { status: 400 });
        }
    }

    return NextResponse.json({ text: extractedText });

  } catch (error: any) {
    console.error('PDF Parse Global Error:', error);
    return NextResponse.json({ error: 'Failed to parse PDF', details: error.message }, { status: 500 });
  }
}
