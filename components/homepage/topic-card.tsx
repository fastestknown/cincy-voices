'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { TopicWithStats } from '@/lib/types';

interface TopicCardProps {
  topic: TopicWithStats;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/topics/${topic.slug}`}>
      <motion.article
        layoutId={`topic-${topic.slug}`}
        className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl overflow-hidden border border-cv-border/50 hover:shadow-lg transition-shadow flex-shrink-0"
      >
        {/* Color accent bar (spec §2.1) */}
        <div className="h-2" style={{ backgroundColor: topic.color }} />

        <div className="p-6">
          <h3 className="font-display text-lg font-bold text-cv-charcoal">
            {topic.name}
          </h3>
          {topic.description && (
            <p className="text-cv-muted text-sm mt-2 line-clamp-2">
              {topic.description}
            </p>
          )}
          <p className="text-sm mt-3 font-medium" style={{ color: topic.color }}>
            {topic.leader_count} leader{topic.leader_count !== 1 ? 's' : ''}
          </p>
          {topic.lead_quote && (
            <blockquote className="mt-4 text-sm text-cv-charcoal/80 italic border-l-2 pl-3" style={{ borderColor: topic.color }}>
              &ldquo;{topic.lead_quote.slice(0, 120)}{topic.lead_quote.length > 120 ? '...' : ''}&rdquo;
            </blockquote>
          )}
        </div>
      </motion.article>
    </Link>
  );
}
