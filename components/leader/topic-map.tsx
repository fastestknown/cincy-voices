'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import type { Topic } from '@/lib/types';

interface TopicMapProps {
  topicCounts: { topic: Topic; count: number }[];
}

export function TopicMap({ topicCounts }: TopicMapProps) {
  const maxCount = Math.max(...topicCounts.map(tc => tc.count));

  return (
    <div className="space-y-4">
      {topicCounts.map((tc, i) => (
        <ScrollReveal key={tc.topic.id} delay={i * 0.08}>
          <Link href={`/topics/${tc.topic.slug}`} className="block group">
            <div className="flex items-center gap-4">
              <span className="font-body text-sm text-cv-muted w-40 flex-shrink-0 truncate group-hover:text-cv-charcoal transition-colors">
                {tc.topic.name}
              </span>
              <div className="flex-1 h-8 bg-cv-border/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(tc.count / maxCount) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] }}
                  className="h-full rounded-full flex items-center justify-end pr-3"
                  style={{ backgroundColor: tc.topic.color }}
                >
                  <span className="text-white/80 text-xs font-medium">{tc.count}</span>
                </motion.div>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  );
}
