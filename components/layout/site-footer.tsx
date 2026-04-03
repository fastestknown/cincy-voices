'use client';

import { SITE } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/constants';

export function SiteFooter() {
  return (
    <footer className="border-t border-cv-border bg-cv-navy text-cv-light-text/60 py-10 sm:py-16">
      <div className="max-w-content mx-auto px-4 sm:px-6 text-center">
        <p className="font-display text-lg text-cv-light-text/80 mb-2">{SITE.name}</p>
        <p className="text-sm">{SITE.tagline}</p>
        <p className="text-sm mt-6">
          Cincy Voices is a{' '}
          <a
            href="https://workwithmean.ing"
            onClick={() => trackEvent(ANALYTICS_EVENTS.OUTBOUND_CLICK, { destination: 'https://workwithmean.ing' })}
            className="text-cv-light-text/80 hover:text-cv-light-text transition-colors underline underline-offset-2"
          >
            Work With Meaning
          </a>
          {' '}project. Learn more &rarr;
        </p>
      </div>
    </footer>
  );
}
