'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Topic, Leader } from '@/lib/types';

interface ThreadHeroProps {
  topic: Topic;
  leaders: Leader[];
}

export function ThreadHero({ topic, leaders }: ThreadHeroProps) {
  return (
    <motion.section
      layoutId={`topic-${topic.slug}`}
      className="py-20 px-6"
      style={{ backgroundColor: topic.color }}
    >
      <div className="max-w-content mx-auto">
        <h1 className="font-display text-fluid-hero font-bold text-white">
          {topic.name}
        </h1>
        {topic.description && (
          <p className="text-white/80 text-lg mt-4 max-w-2xl font-body leading-relaxed">
            {topic.description}
          </p>
        )}

        {/* Leader avatar row */}
        <div className="flex items-center gap-3 mt-8">
          {leaders.map(leader => (
            <Link key={leader.id} href={`/leaders/${leader.slug}`} title={leader.name}>
              <motion.div
                layoutId={`avatar-${leader.slug}`}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/60 transition-colors"
              >
                {leader.headshot_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={leader.headshot_url} alt={leader.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/20" />
                )}
              </motion.div>
            </Link>
          ))}
          <span className="text-white/60 text-sm ml-2 font-body">
            {leaders.length} voice{leaders.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </motion.section>
  );
}
