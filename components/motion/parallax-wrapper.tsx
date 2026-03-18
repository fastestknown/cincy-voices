'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxWrapperProps {
  children: React.ReactNode;
  speed?: number; // 0.3 = background, 1.0 = foreground
  className?: string;
}

export function ParallaxWrapper({ children, speed = 0.3, className = '' }: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const width = window.innerWidth;
    // Spec §4.6: disabled on mobile, reduced to 0.1x on tablet
    if (width < 480) return;
    const effectiveSpeed = width < 768 ? speed * 0.33 : speed;

    const tween = gsap.to(el, {
      y: () => effectiveSpeed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => { tween.kill(); };
  }, [speed]);

  return <div ref={ref} className={className}>{children}</div>;
}
