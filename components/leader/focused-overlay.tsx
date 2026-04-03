'use client';

import { motion } from 'framer-motion';
import { CinematicPlayer } from '@/components/video/cinematic-player';
import type { Segment } from '@/lib/types';

interface FocusedOverlayProps {
  segment: Segment;
  leaderName: string;
  onClose: () => void;
}

export function FocusedOverlay({ segment, leaderName, onClose }: FocusedOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-cv-cinematic/95 flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] }}
        className="w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CinematicPlayer
          playbackId={segment.mux_playback_id!}
          words={segment.words}
          focused
          muted={false}
          onFocusClose={onClose}
          className="shadow-2xl"
        />

        <div className="mt-6 text-center">
          <p className="font-display text-lg text-cv-light-text/80">
            &ldquo;{segment.text.slice(0, 150)}{segment.text.length > 150 ? '...' : ''}&rdquo;
          </p>
          <p className="text-cv-light-text/50 text-sm mt-2">— {leaderName}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
