'use client';

import MuxPlayer from '@mux/mux-player-react';

interface FooterQuoteProps {
  quote: string;
  leaderName: string;
  ambientPlaybackId?: string | null;
}

export function FooterQuote({ quote, leaderName, ambientPlaybackId }: FooterQuoteProps) {
  return (
    <section className="relative bg-cv-navy py-32 px-6 overflow-hidden">
      {/* Ambient video background (out of focus, spec §2.1) */}
      {ambientPlaybackId && (
        <div className="absolute inset-0 opacity-20 blur-sm">
          <MuxPlayer
            playbackId={ambientPlaybackId}
            streamType="on-demand"
            autoPlay="muted"
            muted
            loop
            preload="metadata"
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
        </div>
      )}

      <div className="relative z-10 max-w-content mx-auto text-center">
        <blockquote className="font-display text-fluid-quote font-bold text-cv-light-text leading-relaxed">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <cite className="block mt-6 text-cv-light-text/60 font-body text-sm not-italic">
          — {leaderName}
        </cite>
      </div>
    </section>
  );
}
