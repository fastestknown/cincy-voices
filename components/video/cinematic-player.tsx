'use client';

import { useRef, useEffect, useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/constants';
import type { WordTimestamp } from '@/lib/types';
import { generateVttUrl } from '@/lib/captions';

interface CinematicPlayerProps {
  playbackId: string;
  words?: WordTimestamp[] | null;
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
  autoPlay = false,
  muted = true,
  loop = false,
  className = '',
  onPlay,
  onComplete,
  focused = false,
  onFocusClose,
}: CinematicPlayerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const [captionUrl, setCaptionUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (words?.length) {
      const url = generateVttUrl(words);
      setCaptionUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [words]);

  // Focused mode: unmute and play
  useEffect(() => {
    if (focused && playerRef.current) {
      const el = playerRef.current as HTMLMediaElement;
      el.muted = false;
      el.play?.();
    }
  }, [focused]);

  // Escape key closes focused mode
  useEffect(() => {
    if (!focused || !onFocusClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFocusClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [focused, onFocusClose]);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-white/10 ${
      focused ? 'ring-2 ring-cv-gold/40' : ''
    } ${className}`}>
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        streamType="on-demand"
        autoPlay={autoPlay ? 'muted' : false}
        muted={muted}
        loop={loop}
        preload="metadata"
        onPlay={() => { setIsPlaying(true); onPlay?.(); trackEvent(ANALYTICS_EVENTS.VIDEO_PLAY); }}
        onEnded={() => { setIsPlaying(false); onComplete?.(); trackEvent(ANALYTICS_EVENTS.VIDEO_COMPLETE); }}
        style={{
          aspectRatio: '16/9',
          '--controls': 'none',
          '--media-object-fit': 'cover',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          onClick={() => {
            const el = playerRef.current as HTMLMediaElement;
            el?.play?.();
          }}
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
