'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MuxPlayer from '@mux/mux-player-react';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/constants';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface MontageHeroProps {
  montagePlaybackId: string | null;
}

const CAPTIONS = [
  { time: 0, text: '10 Leaders.' },
  { time: 3, text: 'Real Conversations.' },
  { time: 7, text: 'Cincinnati.' },
];

export function MontageHero({ montagePlaybackId }: MontageHeroProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCaption, setActiveCaption] = useState(0);
  const [montageComplete, setMontageComplete] = useState(false);
  const [showReplay, setShowReplay] = useState(false);

  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Skip montage entirely for reduced motion or no playback ID
  if (prefersReduced || !montagePlaybackId) {
    return (
      <section className="min-h-[50vh] bg-cv-cream flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display text-fluid-hero font-bold text-cv-charcoal">
            10 Leaders. Real Conversations. Cincinnati.
          </h1>
          <p className="text-cv-muted mt-4 text-lg">Scroll to explore</p>
        </div>
      </section>
    );
  }

  // Timed caption cycling
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!montagePlaybackId) return;

    const intervals = CAPTIONS.map((cap, i) =>
      setTimeout(() => setActiveCaption(i), cap.time * 1000)
    );

    return () => intervals.forEach(clearTimeout);
  }, [montagePlaybackId]);

  // Scroll-driven montage shrink: pauses video, scales to strip
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !montagePlaybackId) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'bottom top+=100',
      onEnter: () => {
        const el = playerRef.current as HTMLMediaElement;
        el?.pause?.();
        setMontageComplete(true);
        setShowReplay(true);
      },
    });

    return () => trigger.kill();
  }, [montagePlaybackId]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleReplay = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.MONTAGE_REPLAY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMontageComplete(false);
    setShowReplay(false);
    setActiveCaption(0);
    setTimeout(() => {
      const el = playerRef.current as HTMLMediaElement;
      if (el) { el.currentTime = 0; el.play?.(); }
    }, 600);
  }, []);

  return (
    <>
      {/* Full viewport dark montage */}
      <section
        ref={containerRef}
        className="relative h-screen bg-cv-navy overflow-hidden"
      >
        <MuxPlayer
          ref={playerRef}
          playbackId={montagePlaybackId}
          streamType="on-demand"
          autoPlay="muted"
          muted
          loop={false}
          preload="auto"
          onPlay={() => trackEvent(ANALYTICS_EVENTS.MONTAGE_START)}
          onEnded={() => { setMontageComplete(true); setShowReplay(true); trackEvent(ANALYTICS_EVENTS.MONTAGE_COMPLETE); }}
          style={{
            position: 'absolute' as const,
            inset: 0,
            width: '100%',
            height: '100%',
            '--controls': 'none',
            '--media-object-fit': 'cover',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any}
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-cv-navy/70 via-transparent to-cv-navy/30" />

        {/* Timed captions */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
          <h1 className="font-display text-fluid-hero font-bold text-cv-light-text text-center transition-opacity duration-700">
            {CAPTIONS[activeCaption]?.text}
          </h1>
        </div>

        {/* Scroll prompt */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-cv-light-text/50 text-sm animate-bounce">
          ↓ Scroll to explore
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-10">
          <div
            className="h-full bg-cv-gold/60 transition-all duration-300"
            style={{ width: montageComplete ? '100%' : '0%' }}
          />
        </div>
      </section>

      {/* Replay strip (shows after scroll past) */}
      {showReplay && (
        <div className="sticky top-16 z-40 h-12 bg-cv-navy/90 backdrop-blur-sm flex items-center justify-center">
          <button
            onClick={handleReplay}
            className="flex items-center gap-2 text-cv-light-text/60 hover:text-cv-light-text text-sm transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
            Replay montage
          </button>
        </div>
      )}
    </>
  );
}
