'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/constants';
import type { LeaderWithTopics } from '@/lib/types';

interface LeaderCardProps {
  leader: LeaderWithTopics;
}

export function LeaderCard({ leader }: LeaderCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/leaders/${leader.slug}`}
      onClick={() => trackEvent(ANALYTICS_EVENTS.LEADER_CARD_OPEN, { leader_slug: leader.slug, source_page: 'homepage' })}
    >
      <motion.article
        layoutId={`avatar-${leader.slug}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-white rounded-2xl overflow-hidden border border-cv-border/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      >
        {/* Avatar / Micro-clip area */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-cv-navy/10 to-cv-sage/20 overflow-hidden">
          {leader.headshot_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={leader.headshot_url}
              alt={leader.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cv-navy/20 to-cv-gold/20" />
          )}

          {/* Micro-clip hover (desktop only) */}
          {isHovered && leader.micro_clip_url && (
            <video
              src={leader.micro_clip_url}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>

        {/* Card info */}
        <div className="p-5">
          <h3 className="font-display text-xl font-bold text-cv-charcoal">
            {leader.name}
          </h3>
          {(leader.role || leader.company) && (
            <p className="text-cv-muted text-sm mt-1 font-body">
              {leader.role}{leader.role && leader.company ? ', ' : ''}{leader.company}
            </p>
          )}

          {/* Topic tags with thread colors */}
          {leader.topic_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {leader.topic_tags.slice(0, 3).map(tag => (
                <span
                  key={tag.slug}
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-white/90"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  );
}
