'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function CreamReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Interpolate navy → cream over 200px scroll (spec §3.1)
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      end: 'top 40%',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        // Interpolate between navy (#1a2744) and cream (#faf6f0)
        const r = Math.round(26 + progress * (250 - 26));
        const g = Math.round(39 + progress * (246 - 39));
        const b = Math.round(68 + progress * (240 - 68));
        el.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={ref} className="bg-cv-navy transition-colors">
      {children}
    </div>
  );
}
