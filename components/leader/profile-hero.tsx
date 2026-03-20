'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CinematicPlayer } from '@/components/video/cinematic-player';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/constants';
import type { Leader, Segment } from '@/lib/types';

interface ProfileHeroProps {
  leader: Leader;
  heroSegment: Segment | null;
}

export function ProfileHero({ leader, heroSegment }: ProfileHeroProps) {
  const [unmuted, setUnmuted] = useState(false);

  return (
    <section className="relative min-h-screen bg-cv-navy flex items-end overflow-hidden">
      {/* Hero clip as background — full viewport */}
      {heroSegment?.mux_playback_id ? (
        <div className="absolute inset-0">
          <CinematicPlayer
            playbackId={heroSegment.mux_playback_id}
            words={heroSegment.words}
            autoPlay
            muted={!unmuted}
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cv-navy via-cv-navy/40 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-cv-navy to-cv-cinematic" />
      )}

      {/* Leader info overlay — bottom-left */}
      <div className="relative z-10 max-w-content mx-auto w-full px-6 pb-16">
        <div className="flex items-end gap-6">
          {/* Avatar with shared element transition */}
          <motion.div
            layoutId={`avatar-${leader.slug}`}
            className="w-20 h-20 rounded-full overflow-hidden border-2 border-cv-light-text/20 flex-shrink-0"
          >
            <Image
              src={`/headshots/${leader.slug}.jpg`}
              alt={leader.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </motion.div>

          <div>
            <h1 className="font-display text-fluid-hero font-bold text-cv-light-text">
              {leader.name}
            </h1>
            {(leader.role || leader.company) && (
              <p className="text-cv-light-text/60 text-lg font-body mt-1">
                {leader.role}{leader.role && leader.company ? ', ' : ''}{leader.company}
              </p>
            )}
          </div>
        </div>

        {/* Unmute button — pulses once per spec §3.3 */}
        {heroSegment?.mux_playback_id && !unmuted && (
          <button
            onClick={() => { setUnmuted(true); trackEvent(ANALYTICS_EVENTS.HERO_UNMUTE, { leader_slug: leader.slug }); }}
            className="mt-6 flex items-center gap-2 text-cv-light-text/50 hover:text-cv-light-text text-sm transition-colors animate-pulse-once"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
            Tap to unmute
          </button>
        )}
      </div>
    </section>
  );
}
