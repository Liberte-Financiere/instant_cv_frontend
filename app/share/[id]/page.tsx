import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { SharePageClient } from './SharePageClient';

export default async function PublicCVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Server-side fetch from database for public sharing
  const cv = await prisma.cV.findUnique({
    where: { id },
  });

  if (!cv || !cv.isPublic) {
    notFound();
  }

  // Increment views in background
  prisma.cV.update({
    where: { id },
    data: { views: { increment: 1 } },
  }).catch((err) => console.error("Error incrementing view count:", err));

  // Format prisma CV for frontend
  const formattedCV = {
    ...(cv.content as any),
    id: cv.id,
    title: cv.title,
    isPublic: cv.isPublic,
  };

  return <SharePageClient cv={formattedCV} />;
}
