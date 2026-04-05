import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLeaderBySlug, getSegmentById } from '@/lib/queries';
import { CinematicPlayer } from '@/components/video/cinematic-player';
import { extractPullQuote } from '@/lib/pull-quote';
import { SITE } from '@/lib/constants';

export const revalidate = 3600;

export async function generateMetadata({ params }: {
  params: Promise<{ slug: string; segmentId: string }>;
}): Promise<Metadata> {
  const { slug, segmentId } = await params;
  const [leader, segment] = await Promise.all([
    getLeaderBySlug(slug),
    getSegmentById(segmentId),
  ]);
  if (!leader || !segment || !segment.mux_playback_id) return {};

  const pullQuote = extractPullQuote(segment.text);
  const topic = segment.topic_name ? ` on ${segment.topic_name}` : '';
  const title = `${leader.name}${topic}`;
  const thumbnailUrl = `https://image.mux.com/${segment.mux_playback_id}/thumbnail.jpg?width=1280&height=720&fit_mode=smartcrop`;

  return {
    title,
    description: pullQuote,
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description: pullQuote,
      url: `${SITE.url}/vault/${slug}/clip/${segmentId}`,
      images: [{ url: thumbnailUrl, width: 1280, height: 720, alt: title }],
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: pullQuote,
      images: [thumbnailUrl],
    },
  };
}

export default async function StandaloneClipPage({ params }: {
  params: Promise<{ slug: string; segmentId: string }>;
}) {
  const { slug, segmentId } = await params;
  const [leader, segment] = await Promise.all([
    getLeaderBySlug(slug),
    getSegmentById(segmentId),
  ]);

  if (!leader || !segment || !segment.mux_playback_id) notFound();

  const pullQuote = extractPullQuote(segment.text);
  const headshotUrl = leader.headshot_drive_folder_id
    ? `https://drive.google.com/thumbnail?id=${leader.headshot_drive_folder_id}&sz=w200`
    : null;

  return (
    <div className="min-h-screen bg-cv-vault">
      {/* Minimal nav */}
      <div className="px-4 sm:px-6 py-4 border-b border-white/10">
        <Link href="/" className="font-display text-lg text-white font-bold tracking-tight">
          Cincy Voices
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <CinematicPlayer
          playbackId={segment.mux_playback_id}
          trimStartMs={segment.trim_start_ms}
          trimEndMs={segment.trim_end_ms}
          muted={false}
          autoPlay={false}
          className="w-full mb-8"
        />

        {/* Leader identity */}
        <div className="flex items-center gap-4 mb-6">
          {headshotUrl && (
            <img
              src={headshotUrl}
              alt={leader.name}
              className="w-12 h-12 rounded-full object-cover border border-white/20"
            />
          )}
          <div>
            <p className="font-display text-white font-bold text-lg">{leader.name}</p>
            {(leader.role || leader.company) && (
              <p className="text-white/50 font-body text-sm">
                {[leader.role, leader.company].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Pull quote */}
        <blockquote className="border-l-2 border-cv-gold pl-5 mb-6">
          <p className="font-display text-xl sm:text-2xl text-white/90 leading-snug italic">
            &ldquo;{pullQuote}&rdquo;
          </p>
        </blockquote>

        {segment.topic_name && (
          <span
            className="inline-block text-xs font-mono-label tracking-widest px-2 py-0.5 rounded-full mb-6"
            style={{
              backgroundColor: `${segment.topic_color}22`,
              color: segment.topic_color ?? '#d4a843',
            }}
          >
            {segment.topic_name.toUpperCase()}
          </span>
        )}

        <div className="mt-6">
          <Link
            href={`/leaders/${slug}`}
            className="inline-flex items-center gap-2 text-cv-gold font-body text-sm hover:text-cv-gold/80 transition-colors"
          >
            Explore more from {leader.name}
            <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
