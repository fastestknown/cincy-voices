'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Hls from 'hls.js';

interface BrollHeroProps {
  playbackIds: string[];
}

function attachHls(video: HTMLVideoElement, playbackId: string) {
  const src = `https://stream.mux.com/${playbackId}.m3u8`;

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari -- native HLS
    video.src = src;
    video.play().catch(() => {});
  } else if (Hls.isSupported()) {
    const hls = new Hls({ startLevel: 1, maxBufferLength: 10 });
    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => {});
    });
    return hls;
  }
  return null;
}

export function BrollHero({ playbackIds }: BrollHeroProps) {
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const [indices, setIndices] = useState<[number, number]>(() => {
    const start = Math.floor(Math.random() * playbackIds.length);
    return [start, (start + 1) % playbackIds.length];
  });
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const hlsRefs = useRef<(Hls | null)[]>([null, null]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Attach HLS to a slot
  const loadSlot = useCallback((slot: 0 | 1, playbackId: string) => {
    const video = videoRefs[slot].current;
    if (!video) return;

    // Destroy previous HLS instance for this slot
    if (hlsRefs.current[slot]) {
      hlsRefs.current[slot]!.destroy();
      hlsRefs.current[slot] = null;
    }

    const hls = attachHls(video, playbackId);
    hlsRefs.current[slot] = hls;
  }, []);

  // Initial load
  useEffect(() => {
    if (!playbackIds.length) return;
    loadSlot(0, playbackIds[indices[0]]);
    if (playbackIds.length > 1) {
      loadSlot(1, playbackIds[indices[1]]);
    }

    return () => {
      hlsRefs.current.forEach(hls => hls?.destroy());
    };
  }, []); // Only on mount

  const rotateVideo = useCallback(() => {
    if (playbackIds.length <= 1) return;

    const nextSlot = activeSlot === 0 ? 1 : 0;

    // Crossfade to the other slot
    setActiveSlot(nextSlot as 0 | 1);

    // After transition completes, load the NEXT video into the now-hidden slot
    setTimeout(() => {
      const hiddenSlot = activeSlot; // the one that just became hidden
      setIndices(prev => {
        const newIndices: [number, number] = [...prev] as [number, number];
        const nextIndex = (prev[nextSlot] + 1) % playbackIds.length;
        newIndices[hiddenSlot] = nextIndex;
        // Load the new video into the hidden slot
        loadSlot(hiddenSlot as 0 | 1, playbackIds[nextIndex]);
        return newIndices;
      });
    }, 2000);
  }, [activeSlot, playbackIds, loadSlot]);

  // Auto-rotate every 12 seconds
  useEffect(() => {
    if (playbackIds.length <= 1) return;
    timerRef.current = setInterval(rotateVideo, 12000);
    return () => clearInterval(timerRef.current);
  }, [rotateVideo, playbackIds.length]);

  if (!playbackIds.length) {
    return (
      <section className="relative h-dvh min-h-[600px] bg-cv-navy flex items-center justify-center">
        <HeroContent />
      </section>
    );
  }

  return (
    <section className="relative h-dvh min-h-[600px] bg-cv-navy overflow-hidden">
      {/* Two video slots for crossfade */}
      {[0, 1].map(slot => {
        const id = playbackIds[indices[slot as 0 | 1]];
        const isActive = activeSlot === slot;
        return (
          <video
            key={`slot-${slot}`}
            ref={videoRefs[slot as 0 | 1]}
            poster={`https://image.mux.com/${id}/thumbnail.jpg?time=2&width=1920`}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1800ms] ease-in-out ${
              isActive ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
            }`}
          />
        );
      })}

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-cv-navy/60 via-cv-navy/30 to-cv-navy/80" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-cv-navy/40 to-transparent" />

      {/* Content */}
      <HeroContent />

      {/* Scroll prompt */}
      <div className="absolute bottom-6 sm:bottom-10 inset-x-0 mx-auto w-max z-10 text-cv-light-text/40 text-xs sm:text-sm animate-bounce font-body">
        <div className="flex flex-col items-center gap-2">
          <span>Scroll to explore</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 text-center">
      <motion.div
        className="w-12 sm:w-16 h-0.5 bg-cv-gold mb-6 sm:mb-8"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      <h1 className="font-display font-bold text-cv-light-text leading-[0.95]">
        <motion.span
          className="block text-fluid-giant tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
        >
          CINCY
        </motion.span>
        <motion.span
          className="block text-fluid-giant tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: 'easeOut' }}
        >
          VOICES
        </motion.span>
      </h1>

      <motion.p
        className="font-body text-cv-light-text/60 text-base sm:text-lg md:text-xl mt-4 sm:mt-6 max-w-xl leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.7, ease: 'easeOut' }}
      >
        Real conversations from Cincinnati&apos;s fractional leaders.
        <br className="hidden md:block" />
        No scripts. No polish. Just truth.
      </motion.p>

      <motion.div
        className="w-12 sm:w-16 h-0.5 bg-cv-gold mt-6 sm:mt-8"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}
