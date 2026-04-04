import { CinematicPlayer } from '@/components/video/cinematic-player';
import { ClipShareBar } from './clip-share-bar';
import { extractPullQuote } from '@/lib/pull-quote';
import { SITE } from '@/lib/constants';
import type { VaultSegment } from '@/lib/types';

interface VaultClipCardProps {
  segment: VaultSegment;
  leaderSlug: string;
  featured?: boolean;
}

function formatDuration(ms: number | null): string {
  if (!ms) return '';
  const secs = Math.round(ms / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VaultClipCard({ segment, leaderSlug, featured = false }: VaultClipCardProps) {
  const pullQuote = extractPullQuote(segment.text);
  const clipUrl = `${SITE.url}/vault/${leaderSlug}/clip/${segment.id}`;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <CinematicPlayer
        playbackId={segment.mux_playback_id!}
        trimStartMs={segment.trim_start_ms}
        trimEndMs={segment.trim_end_ms}
        muted={false}
        className="w-full"
      />

      <div className="p-4">
        {segment.topic_name && (
          <span
            className="inline-block text-xs font-mono-label tracking-widest px-2 py-0.5 rounded-full mb-2"
            style={{
              backgroundColor: `${segment.topic_color}22`,
              color: segment.topic_color ?? '#d4a843',
            }}
          >
            {segment.topic_name.toUpperCase()}
          </span>
        )}

        <p className={`font-body text-white/80 leading-snug ${featured ? 'text-base' : 'text-sm'}`}>
          &ldquo;{pullQuote}&rdquo;
        </p>

        {segment.duration_ms && (
          <p className="text-white/30 text-xs font-body mt-1">
            {formatDuration(segment.duration_ms)}
          </p>
        )}

        <ClipShareBar
          clipUrl={clipUrl}
          pullQuote={pullQuote}
          leaderSlug={leaderSlug}
          segmentId={segment.id}
        />
      </div>
    </div>
  );
}
