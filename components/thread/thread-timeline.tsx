'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { FocusedOverlay } from '@/components/leader/focused-overlay';
import { extractPullQuote } from '@/lib/pull-quote';
import { headshotPosition } from '@/lib/headshot-position';
import type { ThreadItemWithContent, Topic } from '@/lib/types';

interface ThreadTimelineProps {
  items: ThreadItemWithContent[];
  topic: Topic;
}

export function ThreadTimeline({ items, topic }: ThreadTimelineProps) {
  const [focusedItem, setFocusedItem] = useState<ThreadItemWithContent | null>(null);
  const [scrollPos, setScrollPos] = useState(0);

  const openFocus = useCallback((item: ThreadItemWithContent) => {
    setScrollPos(window.scrollY);
    setFocusedItem(item);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeFocus = useCallback(() => {
    setFocusedItem(null);
    document.body.style.overflow = '';
    window.scrollTo(0, scrollPos);
  }, [scrollPos]);

  return (
    <>
      {/* Vertical line */}
      <div
        className="timeline-line hidden md:block"
        style={{
          left: '2.375rem',
          background: `linear-gradient(to bottom, ${topic.color}, ${topic.color}18)`,
        }}
      />

      <div className="space-y-8 sm:space-y-12">
        {items.map((item, i) => (
          <ScrollReveal key={item.id} delay={i * 0.04}>
            <div className="flex gap-3 sm:gap-6 relative">
              {/* Avatar column */}
              <div className="flex-shrink-0 flex flex-col items-center w-[52px] md:w-[72px]">
                <Link
                  href={`/leaders/${item.leader.slug}`}
                  className="relative w-10 h-10 md:w-[52px] md:h-[52px] rounded-full overflow-hidden z-10 transition-transform hover:scale-110"
                  style={{ border: `3px solid ${topic.color}` }}
                >
                  <Image
                    src={`/headshots/${item.leader.slug}.jpg`}
                    alt={item.leader.name}
                    fill
                    sizes="52px"
                    className="object-cover"
                    style={{ objectPosition: headshotPosition(item.leader.slug) }}
                  />
                </Link>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Name & role */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 mb-2">
                  <Link
                    href={`/leaders/${item.leader.slug}`}
                    className="font-semibold text-[15px] text-cv-charcoal hover:text-cv-navy transition-colors"
                  >
                    {item.leader.name}
                  </Link>
                  {item.leader.role && (
                    <span className="text-cv-muted text-xs">{item.leader.role}</span>
                  )}
                </div>

                {item.content_type === 'quote' && item.quote ? (
                  /* Quote card */
                  <div
                    className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-black/[0.06] hover:translate-x-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-400"
                    style={{ borderLeftWidth: 4, borderLeftColor: topic.color }}
                  >
                    <p className="font-display text-[17px] font-semibold leading-relaxed text-cv-charcoal">
                      &ldquo;{item.quote.quote_text}&rdquo;
                    </p>
                  </div>
                ) : item.content_type === 'video_clip' && item.segment ? (
                  /* Video card */
                  <div
                    className="rounded-2xl overflow-hidden bg-white border border-black/[0.06] hover:translate-x-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all duration-400 cursor-pointer"
                    onClick={() => { if (item.segment?.mux_playback_id) openFocus(item); }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' && item.segment?.mux_playback_id) openFocus(item); }}
                  >
                    {item.segment.mux_playback_id ? (
                      <div className="relative aspect-video overflow-hidden group">
                        <Image
                          src={`https://image.mux.com/${item.segment.mux_playback_id}/thumbnail.jpg?time=2&width=640`}
                          alt={`${item.leader.name} speaking`}
                          fill
                          sizes="(max-width: 768px) 100vw, 640px"
                          className="object-cover transition-transform duration-600 group-hover:scale-105"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-cv-navy/60 via-transparent to-transparent" />
                        {/* Play button */}
                        <div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[52px] h-[52px] rounded-full flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                          style={{
                            background: topic.color,
                            boxShadow: `0 4px 20px ${topic.color}66`,
                          }}
                        >
                          <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-cv-charcoal/5" />
                    )}
                    <div className="px-5 py-4">
                      <p className="font-display text-[15px] font-semibold text-cv-charcoal leading-snug">
                        &ldquo;{extractPullQuote(item.segment.text)}&rdquo;
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Focused overlay for video clips */}
      {focusedItem?.segment?.mux_playback_id && (
        <FocusedOverlay
          segment={focusedItem.segment}
          leaderName={focusedItem.leader.name}
          onClose={closeFocus}
        />
      )}
    </>
  );
}
