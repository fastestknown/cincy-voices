import { ImageResponse } from 'next/og';
import { getLeaderBySlug } from '@/lib/queries';

export const runtime = 'edge';
export const alt = 'Leader profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const leader = await getLeaderBySlug(slug);
  if (!leader) return new Response('Not found', { status: 404 });

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: '#1a2744', display: 'flex',
        flexDirection: 'column', justifyContent: 'flex-end',
        padding: '60px',
      }}>
        {leader.hero_quote && (
          <div style={{ fontSize: 36, fontWeight: 700, color: '#f0ece6', lineHeight: 1.3, maxWidth: '80%' }}>
            &ldquo;{leader.hero_quote.slice(0, 150)}{leader.hero_quote.length > 150 ? '...' : ''}&rdquo;
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 30 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#f0ece6' }}>
            {leader.name}
          </div>
          {leader.role && (
            <div style={{ fontSize: 20, color: '#f0ece6', opacity: 0.6 }}>
              {leader.role}
            </div>
          )}
        </div>
        <div style={{ fontSize: 14, color: '#d4a843', marginTop: 20 }}>
          Cincy Voices
        </div>
      </div>
    ),
    size
  );
}
