import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Cincy Voices — Real conversations from Cincinnati\'s fractional leaders';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: '#1a2744', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px',
      }}>
        <div style={{ fontSize: 72, fontWeight: 700, color: '#f0ece6', textAlign: 'center' }}>
          Cincy Voices
        </div>
        <div style={{ fontSize: 28, color: '#f0ece6', opacity: 0.7, marginTop: 20, textAlign: 'center' }}>
          10 Leaders. Real Conversations. Cincinnati.
        </div>
        <div style={{ fontSize: 16, color: '#d4a843', marginTop: 40 }}>
          voices.workwithmean.ing
        </div>
      </div>
    ),
    size
  );
}
