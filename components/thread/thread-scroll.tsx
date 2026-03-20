'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { CinematicPlayer } from '@/components/video/cinematic-player';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { FocusedOverlay } from '@/components/leader/focused-overlay';
import type { ThreadItemWithContent, Topic } from '@/lib/types';

interface ThreadScrollProps {
  items: ThreadItemWithContent[];
  topic: Topic;
}

export function ThreadScroll({ items, topic }: ThreadScrollProps) {
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

  let lastLeaderId = '';

  return (
    <>
      <div className="space-y-16">
        {items.map((item, i) => {
          const isNewLeader = item.leader_id !== lastLeaderId;
          lastLeaderId = item.leader_id;

          return (
            <ScrollReveal key={item.id} delay={0} scale={item.content_type === 'video_clip' ? 0.92 : undefined}>
              {/* Connective tissue — leader transition indicator */}
              {isNewLeader && i > 0 && (
                <div className="flex items-center gap-3 mb-8">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={`/headshots/${item.leader.slug}.jpg`}
                      alt={item.leader.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-cv-muted text-sm font-body">
                    {item.leader.name} responds
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: `${topic.color}30` }} />
                </div>
              )}

              {item.content_type === 'quote' && item.quote ? (
                /* Quote card */
                <blockquote
                  className="border-l-4 pl-6 py-4"
                  style={{ borderColor: topic.color }}
                >
                  <p className="font-display text-fluid-quote font-bold text-cv-charcoal leading-relaxed">
                    &ldquo;{item.quote.quote_text}&rdquo;
                  </p>
                  <cite className="block mt-3 text-cv-muted text-sm not-italic font-body">
                    — {item.leader.name}{item.leader.role ? `, ${item.leader.role}` : ''}
                  </cite>
                </blockquote>
              ) : item.content_type === 'video_clip' && item.segment ? (
                /* Video clip */
                <div
                  className="cursor-pointer"
                  onClick={() => { if (item.segment?.mux_playback_id) openFocus(item); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' && item.segment?.mux_playback_id) openFocus(item); }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-center">
                    {item.segment.mux_playback_id ? (
                      <CinematicPlayer
                        playbackId={item.segment.mux_playback_id}
                        words={item.segment.words}
                        autoPlay={i === 0}
                        muted
                      />
                    ) : (
                      <div className="aspect-video bg-cv-cinematic/5 rounded-xl" />
                    )}
                    <div>
                      <p className="text-cv-charcoal font-body leading-relaxed">
                        {item.segment.text.slice(0, 200)}{item.segment.text.length > 200 ? '...' : ''}
                      </p>
                      <p className="text-cv-muted text-sm mt-2">— {item.leader.name}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </ScrollReveal>
          );
        })}
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
