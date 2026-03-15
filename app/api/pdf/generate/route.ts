import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id, type = 'cv' } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    // Determine the page path based on document type
    const pagePath = type === 'cover-letter' ? 'cover-letter' : 'cv';
    const docLabel = type === 'cover-letter' ? 'Lettre' : 'CV';

    // Determine base URL dynamically based on environment
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    let host = req.headers.get('host') || process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000';
    
    // Fix host parsing to remove protocol if accidentally injected via env variables
    if (host.startsWith('http')) {
      host = new URL(host).host;
    }

    const baseUrl = `${protocol}://${host}`;
    
    // Construct the target URL. Add headless=true to skip window.print()
    const headlessToken = process.env.GOOGLE_API_KEY?.slice(0, 10) || 'fallbackToken';
    const targetUrl = `${baseUrl}/${pagePath}/${id}?print=true&headless=true&token=${headlessToken}`;

    // Define real Google Chrome paths based on the OS for both dev and prod
    let chromeExecutablePath = '';
    if (process.platform === 'win32') {
      chromeExecutablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    } else if (process.platform === 'linux') {
      chromeExecutablePath = '/usr/bin/google-chrome';
    } else if (process.platform === 'darwin') {
      chromeExecutablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }

    // Launch standard Puppeteer using explicit installed Chrome path
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromeExecutablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
      defaultViewport: { width: 1920, height: 1080 },
    });

    console.log(`[PDF] 🤖 Navigateur Chrome réel (${chromeExecutablePath}) lancé avec succès. J'ouvre un nouvel onglet...`);
    const page = await browser.newPage();

    // Inject session cookies to authenticate the headless browser
    const cookiesList = req.headers.get('cookie');
    if (cookiesList) {
       const cookieArray = cookiesList
         .split(';')
         .map(c => c.trim())
         .filter(c => c.length > 0)
         .map(c => {
           const firstEq = c.indexOf('=');
           if (firstEq === -1) return null; // Invalid cookie format
           const name = c.substring(0, firstEq).trim();
           const value = c.substring(firstEq + 1).trim();
           if (!name) return null; // Empty name
           
           return {
             name,
             value,
             url: baseUrl, // URL scoped to satisfy Network.deleteCookies requirement
             path: '/',
           };
         })
         .filter((cookie): cookie is NonNullable<typeof cookie> => cookie !== null); // Type assertion for TypeScript

       if (cookieArray.length > 0) {
         await page.setCookie(...cookieArray);
       }
    }

    // Emulate print media type
    await page.emulateMediaType('print');

    // Go to the target CV page
    // waitUntil networkidle0 ensures that ALL network requests (fonts, images) are done
    console.log(`[PDF] ⏳ Navigation en cours... J'attends que la page finisse de charger les images et les polices...`);
    await page.goto(targetUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    console.log(`[PDF] 📸 Page chargée à 100% ! Je prends le cliché PDF de la page (sans marge)...`);
    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    });

    await browser.close();

    console.log(`[PDF] ✅ Bam ! PDF ${docLabel} ${id} généré avec succès ! Le robot ferme ses portes.`);

    // Return the generated PDF as a File Blob
    const filename = type === 'cover-letter' ? `lettre-${id}.pdf` : `cv-${id}.pdf`;
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('[PDF Generator Error]:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du PDF', details: error.message },
      { status: 500 }
    );
  }
}
