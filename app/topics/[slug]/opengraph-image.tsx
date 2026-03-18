import { ImageResponse } from 'next/og';
import { getTopicBySlug } from '@/lib/queries';

export const runtime = 'edge';
export const alt = 'Topic thread';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) return new Response('Not found', { status: 404 });

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: '#1a2744', display: 'flex',
        flexDirection: 'column', justifyContent: 'center',
        padding: '60px',
      }}>
        <div style={{
          width: 80, height: 6,
          backgroundColor: topic.color,
          borderRadius: 3,
          marginBottom: 30,
        }} />
        <div style={{ fontSize: 56, fontWeight: 700, color: '#f0ece6' }}>
          {topic.name}
        </div>
        {topic.description && (
          <div style={{ fontSize: 24, color: '#f0ece6', opacity: 0.7, marginTop: 16, maxWidth: '70%' }}>
            {topic.description}
          </div>
        )}
        <div style={{ fontSize: 14, color: '#d4a843', marginTop: 40 }}>
          Cincy Voices — voices.workwithmeaning.com
        </div>
      </div>
    ),
    size
  );
}
