'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import type MuxPlayerElement from '@mux/mux-player';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/constants';
import type { WordTimestamp } from '@/lib/types';
import { generateVttUrl } from '@/lib/captions';

interface CinematicPlayerProps {
  playbackId: string;
  words?: WordTimestamp[] | null;
  trimStartMs?: number | null;
  trimEndMs?: number | null;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  onPlay?: () => void;
  onComplete?: () => void;
  focused?: boolean;
  onFocusClose?: () => void;
}

export function CinematicPlayer({
  playbackId,
  words,
  trimStartMs,
  trimEndMs,
  autoPlay = false,
  muted = true,
  loop = false,
  className = '',
  onPlay,
  onComplete,
  focused = false,
  onFocusClose,
}: CinematicPlayerProps) {
  const playerRef = useRef<MuxPlayerElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const trimStartSec = trimStartMs ? trimStartMs / 1000 : null;
  const trimEndSec = trimEndMs ? trimEndMs / 1000 : null;

  const captionUrl = words?.length ? generateVttUrl(words) : '';

  // Pause at trim end
  const handleTimeUpdate = useCallback(() => {
    if (!trimEndSec) return;
    const el = playerRef.current;
    if (!el) return;
    const media = el.media?.nativeEl ?? el;
    if (media && media.currentTime >= trimEndSec) {
      media.pause();
      setIsPlaying(false);
      onComplete?.();
      trackEvent(ANALYTICS_EVENTS.VIDEO_COMPLETE);
    }
  }, [trimEndSec, onComplete]);

  // Escape key closes focused mode
  useEffect(() => {
    if (!focused || !onFocusClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFocusClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [focused, onFocusClose]);

  const handlePlayClick = useCallback(() => {
    const el = playerRef.current;
    el?.play().catch(() => {});
  }, []);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-white/10 ${
      focused ? 'ring-2 ring-cv-gold/40' : ''
    } ${className}`}>
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        streamType="on-demand"
        startTime={trimStartSec ?? undefined}
        autoPlay={focused ? true : autoPlay ? 'muted' : false}
        muted={muted}
        loop={loop}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => { setIsPlaying(true); onPlay?.(); trackEvent(ANALYTICS_EVENTS.VIDEO_PLAY); }}
        onEnded={() => { setIsPlaying(false); onComplete?.(); trackEvent(ANALYTICS_EVENTS.VIDEO_COMPLETE); }}
        style={{
          aspectRatio: '16/9',
          '--controls': muted ? 'none' : undefined,
          '--media-object-fit': 'cover',
        } as Record<string, string>}
      />

      {/* Custom captions overlay */}
      {captionUrl && (
        <track
          src={captionUrl}
          kind="captions"
          srcLang="en"
          default
        />
      )}

      {/* Play button overlay when paused */}
      {!isPlaying && !autoPlay && (
        <button
          onClick={handlePlayClick}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 to-transparent"
          aria-label="Play video"
        >
          <div className="w-16 h-16 rounded-full bg-cv-gold/90 flex items-center justify-center animate-pulse-once">
            <svg viewBox="0 0 24 24" className="w-6 h-6 ml-1 text-white fill-current">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </button>
      )}

      {/* Focus close button */}
      {focused && onFocusClose && (
        <button
          onClick={onFocusClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-sm hover:bg-black/70 transition-colors"
          aria-label="Close focused view"
        >
          ✕
        </button>
      )}
    </div>
  );
}
