import { ANALYTICS_EVENTS } from './constants';

type EventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

interface EventProps {
  leader_slug?: string;
  topic_slug?: string;
  segment_id?: string;
  source_page?: string;
  destination?: string;
}

export function trackEvent(name: EventName, props?: EventProps) {
  if (typeof window === 'undefined') return;

  // Vercel Analytics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const va = (window as Record<string, any>).va;
  if (va) {
    va('event', { name, ...props });
  }

  // Plausible
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plausible = (window as Record<string, any>).plausible;
  if (plausible) {
    plausible(name, { props });
  }
}
