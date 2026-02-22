import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { auth } from '@/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  // Rate limiting: 15 requests per minute
  const rateCheck = checkRateLimit(`${session.user.id}:upload`, RATE_LIMITS.UPLOAD);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez réessayer dans quelques secondes.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.resetIn / 1000)) } }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Validate file type — only images allowed
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP, GIF.' },
        { status: 400 }
      );
    }

    // Validate file size — max 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Maximum : 5 Mo.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary via stream or buffer
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'jobsira-cv-photos' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    return new NextResponse("Upload failed", { status: 500 });
  }
}
