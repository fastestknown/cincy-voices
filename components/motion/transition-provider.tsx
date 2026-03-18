'use client';

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const TRANSITION_EASING: [number, number, number, number] = [0.32, 0.72, 0, 1]; // spec §3.2

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: TRANSITION_EASING,
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}

// Motion contract — layoutId ownership per route pair:
//
// Homepage → Leader Profile:
//   layoutId="avatar-{slug}" — avatar morphs to profile hero avatar
//   Non-shared content crossfades (out 0.3s, in 0.4s with 0.2s delay)
//
// Homepage/Profile → Topic Thread:
//   layoutId="topic-{slug}" — topic tag expands to thread header
//   Thread color floods top of screen
//
// Leader Profile → Leader Profile:
//   layoutId="avatar-{slug}" — avatar morphs between profiles
//
// Reduced motion:
//   All layoutId animations → instant crossfade (no morph)
//   Mobile: crossfade only, no layout morph (spec §4.6)
