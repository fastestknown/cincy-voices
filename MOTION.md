# Cincy Voices — Motion Contract

## Shared Element Transitions (Framer Motion layoutId)

| Route Pair | Element | layoutId | Duration | Easing |
|------------|---------|----------|----------|--------|
| Home → Leader | Avatar | `avatar-{slug}` | 0.5s | [0.32, 0.72, 0, 1] |
| Home → Topic | Topic tag | `topic-{slug}` | 0.5s | [0.32, 0.72, 0, 1] |
| Leader → Leader | Avatar | `avatar-{slug}` | 0.5s | [0.32, 0.72, 0, 1] |
| Leader → Topic | Topic tag | `topic-{slug}` | 0.5s | [0.32, 0.72, 0, 1] |

Non-shared content: crossfade out 0.3s, in 0.4s with 0.2s delay.

## Homepage Montage Transitions

- Load: dark (#1a2744), montage auto-plays muted
- Scroll past fold: montage pauses, scales to strip at top
- Does NOT resume on scroll-back
- Cream reveal: background interpolates navy → cream over 200px scroll
- Replay: circular icon at strip, restarts from top

## Scroll-Driven (GSAP ScrollTrigger)

- Fade-up: 60px travel, 0→1 opacity, 0.6s, power2.out, stagger 0.1s
- Parallax: background 0.3x, foreground 1x
- Video scale-in: 0.92 → 1.0 entering viewport center
- Color transitions: CSS custom property interpolation over 200px

## Reduced Motion

- Skip montage entirely, load cream + leader grid
- All layoutId → instant crossfade (no morph)
- All scroll-reveal → content visible immediately, no animation
- All parallax → disabled
- All video → poster + play button, no autoplay

## Mobile Simplification (spec §4.6)

- Parallax: disabled (<480px), reduced 0.1x (<768px)
- Shared element transitions: crossfade only, no layout morph
- Video autoplay: only first in sequence, rest show poster
- Horizontal scroll → vertical stack
- Asymmetric grid → single column
- Micro-clip hover → disabled (tap goes to profile)
- Side rail → hidden (inline leader context instead)
