'use client';

import { ScrollReveal } from '@/components/shared/scroll-reveal';
import type { Quote } from '@/lib/types';

interface QuoteMosaicProps {
  quotes: Quote[];
  leaderName: string;
}

export function QuoteMosaic({ quotes, leaderName }: QuoteMosaicProps) {
  if (!quotes.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quotes.map((quote, i) => {
        // Feature the first and every 3rd quote (larger card)
        const isFeatured = i === 0 || i === 3;
        return (
          <ScrollReveal key={quote.id} delay={i * 0.06}>
            <blockquote
              className={`p-4 sm:p-6 rounded-xl border border-cv-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                isFeatured
                  ? 'md:col-span-2 bg-cv-navy text-cv-light-text'
                  : 'bg-white text-cv-charcoal'
              }`}
            >
              <p className={`font-display font-bold leading-relaxed ${
                isFeatured ? 'text-lg md:text-xl' : 'text-base'
              }`}>
                &ldquo;{quote.quote_text}&rdquo;
              </p>
              <cite className={`block mt-3 text-sm not-italic font-body ${
                isFeatured ? 'text-cv-light-text/50' : 'text-cv-muted'
              }`}>
                — {leaderName}
              </cite>
            </blockquote>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
