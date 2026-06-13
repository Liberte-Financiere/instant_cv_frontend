import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cv = await prisma.cV.findUnique({
    where: { id },
  });

  if (!cv || !cv.isPublic) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: 'white', fontSize: 60 }}>CV Privé ou Introuvable</h1>
        </div>
      ),
      { ...size }
    );
  }

  const content = cv.content as any;
  const fullName = `${content.personalInfo?.firstName || ''} ${content.personalInfo?.lastName || ''}`.trim() || 'CV Anonyme';
  const jobTitle = content.personalInfo?.title || 'Profil Professionnel';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#020617',
          backgroundImage: 'linear-gradient(to bottom right, #020617, #0f172a)',
          padding: '80px',
          justifyContent: 'space-between',
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            backgroundColor: '#3b82f6',
            opacity: 0.15,
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 10 }}>
          <span style={{ color: '#3b82f6', fontSize: 32, fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            CV Professionnel
          </span>
          <h1 style={{ color: 'white', fontSize: 80, fontWeight: '900', margin: 0, lineHeight: 1.1, maxWidth: '900px' }}>
            {fullName}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 40, marginTop: '20px', fontWeight: 'normal' }}>
            {jobTitle}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, borderTop: '2px solid rgba(255, 255, 255, 0.1)', paddingTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '40px', fontSize: 24, fontWeight: 'bold' }}>
              JobSira
            </div>
            <span style={{ color: '#64748b', fontSize: 24, marginLeft: '20px' }}>
              Créez votre CV optimisé ATS en 2 minutes
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
