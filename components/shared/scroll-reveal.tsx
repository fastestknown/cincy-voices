'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  scale?: number; // For video scale-in (spec §3.1: 0.92 → 1.0)
}

export function ScrollReveal({ children, className = '', delay = 0, y = 60, scale }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const initial: gsap.TweenVars = { opacity: 0, y };
    if (scale) initial.scale = scale;

    gsap.set(el, initial);

    const target: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay,
      ease: 'power2.out',
    };
    if (scale) target.scale = 1;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => gsap.to(el, target),
      once: true,
    });

    return () => trigger.kill();
  }, [delay, y, scale]);

  return <div ref={ref} className={className}>{children}</div>;
}
