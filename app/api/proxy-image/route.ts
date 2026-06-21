import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse("URL parameter is required", { status: 400 });
  }

  // SECURITE : Prévention SSRF (Server-Side Request Forgery)
  try {
    const parsedUrl = new URL(url);
    const allowedDomains = ['res.cloudinary.com'];
    if (!allowedDomains.includes(parsedUrl.hostname)) {
      return new NextResponse("Unauthorized domain", { status: 403 });
    }
  } catch (e) {
    return new NextResponse("Invalid URL format", { status: 400 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch image');

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[PROXY_IMAGE_ERROR]', error);
    return new NextResponse("Failed to fetch image", { status: 500 });
  }
}
