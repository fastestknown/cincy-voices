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
}

export function ClipSequence({ segments, leaderName }: ClipSequenceProps) {
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

  return (
    <>
      <div className="space-y-8 sm:space-y-12">
        {segments.map((segment, i) => (
          <ScrollReveal key={segment.id} delay={i * 0.1} scale={0.92}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center">
              {/* Video — autoplay muted first one, poster for rest on mobile */}
              <div
                className="cursor-pointer"
                onClick={() => segment.mux_playback_id && openFocus(segment)}
                role="button"
                tabIndex={0}
                aria-label={`Watch clip: ${segment.text.slice(0, 50)}`}
                onKeyDown={(e) => { if (e.key === 'Enter' && segment.mux_playback_id) openFocus(segment); }}
              >
                {segment.mux_playback_id ? (
                  <CinematicPlayer
                    playbackId={segment.mux_playback_id}
                    words={segment.words}
                    autoPlay={i === 0}
                    muted
                  />
                ) : (
                  <div className="aspect-video bg-cv-cinematic/10 rounded-xl flex items-center justify-center">
                    <p className="text-cv-muted text-sm">Video coming soon</p>
                  </div>
                )}
              </div>

              {/* Quote beside video */}
              <div className={i % 2 === 0 ? 'md:order-last' : 'md:order-first'}>
                <blockquote className="font-display text-base md:text-lg font-bold text-cv-charcoal leading-relaxed">
                  &ldquo;{extractPullQuote(segment.text)}&rdquo;
                </blockquote>
                <p className="text-cv-muted text-sm mt-3">— {leaderName}</p>

                {/* Topic tag if assigned */}
                {segment.topic_thread_id && (
                  <a
                    href={`/topics/${segment.topic_thread_id}`}
                    className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium text-white/90 bg-cv-sage hover:opacity-80 transition-opacity"
                  >
                    View topic thread →
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Focused viewing overlay */}
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
