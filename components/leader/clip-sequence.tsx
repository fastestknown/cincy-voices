'use client';

import { useState, useCallback } from 'react';
import { CinematicPlayer } from '@/components/video/cinematic-player';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { FocusedOverlay } from './focused-overlay';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/constants';
import { extractPullQuote } from '@/lib/pull-quote';
import type { Segment } from '@/lib/types';

interface ClipSequenceProps {
  segments: Segment[];
  leaderName: string;
  heroSegmentId?: string | null;
}

function durationSec(seg: Segment): number {
  if (seg.trim_start_ms != null && seg.trim_end_ms != null) {
    return Math.round((seg.trim_end_ms - seg.trim_start_ms) / 1000);
  }
  return Math.round((seg.end_time_ms - seg.start_time_ms) / 1000);
}

function thumbnailUrl(seg: Segment): string | null {
  if (!seg.mux_playback_id) return null;
  const t = seg.trim_start_ms ? Math.floor(seg.trim_start_ms / 1000) : 0;
  return `https://image.mux.com/${seg.mux_playback_id}/thumbnail.jpg?time=${t}&width=640`;
}

interface ClipCardProps {
  segment: Segment;
  onOpen: () => void;
}

function ClipCard({ segment, onOpen }: ClipCardProps) {
  const thumb = thumbnailUrl(segment);
  const dur = durationSec(segment);
  const preview = extractPullQuote(segment.text);
  const playable = !!segment.mux_playback_id;

  return (
    <button
      onClick={() => playable && onOpen()}
      disabled={!playable}
      className={`group text-left w-full bg-white/40 rounded-xl overflow-hidden border border-cv-border/50 transition-all duration-200 ${
        playable ? 'hover:border-cv-gold/50 hover:shadow-lg cursor-pointer' : 'opacity-60 cursor-default'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-cv-cinematic/10">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-cv-muted text-xs">No video</span>
          </div>
        )}

        {/* Play overlay on hover */}
        {playable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-11 h-11 rounded-full bg-cv-gold/90 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-4 h-4 ml-0.5 text-white fill-current">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded font-mono leading-none">
          {dur}s
        </div>
      </div>

      {/* Quote preview */}
      <div className="p-3 sm:p-4">
        <p className="text-cv-charcoal text-sm leading-snug line-clamp-2 font-body">
          &ldquo;{preview}&rdquo;
        </p>
      </div>
    </button>
  );
}

export function ClipSequence({ segments, leaderName, heroSegmentId }: ClipSequenceProps) {
  const [focusedSegment, setFocusedSegment] = useState<Segment | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const openFocus = useCallback((segment: Segment) => {
    setScrollPosition(window.scrollY);
    setFocusedSegment(segment);
    document.body.style.overflow = 'hidden';
    trackEvent(ANALYTICS_EVENTS.CLIP_FOCUS_OPEN, { segment_id: segment.id });
  }, []);

  const closeFocus = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.CLIP_FOCUS_CLOSE);
    setFocusedSegment(null);
    document.body.style.overflow = '';
    window.scrollTo(0, scrollPosition);
  }, [scrollPosition]);

  // Featured: hero_segment_id match, else highest quality (first in sorted list)
  const featured = segments.find(s => s.id === heroSegmentId) ?? segments[0];
  const gridSegments = segments.filter(s => s.id !== featured.id);

  return (
    <>
      {/* Zone 1 - Featured clip */}
      <ScrollReveal>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center mb-12 sm:mb-16"
        >
          <div
            className={featured.mux_playback_id ? 'cursor-pointer' : undefined}
            onClick={() => featured.mux_playback_id && openFocus(featured)}
            role={featured.mux_playback_id ? 'button' : undefined}
            tabIndex={featured.mux_playback_id ? 0 : undefined}
            onKeyDown={(e) => { if (e.key === 'Enter' && featured.mux_playback_id) openFocus(featured); }}
          >
            {featured.mux_playback_id ? (
              <CinematicPlayer
                playbackId={featured.mux_playback_id}
                words={featured.words}
                trimStartMs={featured.trim_start_ms}
                trimEndMs={featured.trim_end_ms}
                autoPlay
                muted
              />
            ) : (
              <div className="aspect-video bg-cv-cinematic/10 rounded-xl flex items-center justify-center">
                <p className="text-cv-muted text-sm">Video coming soon</p>
              </div>
            )}
          </div>

          <div>
            <blockquote className="font-display text-xl md:text-2xl font-bold text-cv-charcoal leading-relaxed">
              &ldquo;{extractPullQuote(featured.text)}&rdquo;
            </blockquote>
            <p className="text-cv-muted text-sm mt-3">-- {leaderName}</p>
            {featured.mux_playback_id && (
              <button
                onClick={() => openFocus(featured)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cv-sage hover:text-cv-sage/70 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-cv-sage/15 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 ml-0.5 fill-cv-sage">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </span>
                Watch with sound
              </button>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Zone 2 - Clip grid */}
      {gridSegments.length > 0 && (
        <ScrollReveal delay={0.1}>
          <p className="font-mono-label text-cv-muted text-xs tracking-widest mb-5">
            MORE CLIPS
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gridSegments.map((segment) => (
              <ClipCard
                key={segment.id}
                segment={segment}
                onOpen={() => openFocus(segment)}
              />
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Focused overlay */}
      {focusedSegment && focusedSegment.mux_playback_id && (
        <FocusedOverlay
          segment={focusedSegment}
          leaderName={leaderName}
          onClose={closeFocus}
        />
      )}
    </>
  );
}
