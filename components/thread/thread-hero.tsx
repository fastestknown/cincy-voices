'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { headshotPosition } from '@/lib/headshot-position';
import type { Topic, Leader } from '@/lib/types';

interface ThreadHeroProps {
  topic: Topic;
  leaders: Leader[];
}

export function ThreadHero({ topic, leaders }: ThreadHeroProps) {
  const displayLeaders = leaders.slice(0, 5);
  const remaining = leaders.length - displayLeaders.length;

  return (
    <motion.section
      layoutId={`topic-${topic.slug}`}
      className="min-h-dvh flex items-center justify-center text-center relative overflow-hidden bg-cv-navy"
    >
      {/* Topic-colored radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${topic.color}22 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 max-w-[800px]">
        {/* Topic badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
          style={{
            background: `${topic.color}22`,
            border: `1px solid ${topic.color}44`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: topic.color }}
          />
          <span
            className="text-[11px] font-semibold tracking-[3px] uppercase"
            style={{ color: topic.color }}
          >
            Topic Thread
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="font-display text-fluid-giant font-black text-cv-light-text leading-[1.05]"
        >
          {topic.name}
        </motion.h1>

        {/* Description */}
        {topic.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="text-cv-light-text/45 text-[17px] font-body font-light mt-6 max-w-[560px] mx-auto leading-relaxed"
          >
            {topic.description}
          </motion.p>
        )}

        {/* Leader avatars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="flex items-center justify-center gap-3 mt-10"
        >
          {displayLeaders.map(leader => (
            <Link key={leader.id} href={`/leaders/${leader.slug}`} title={leader.name}>
              <div
                className="w-12 h-12 rounded-full overflow-hidden relative transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
                style={{ border: `2px solid ${topic.color}66` }}
              >
                <Image
                  src={`/headshots/${leader.slug}.jpg`}
                  alt={leader.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                  style={{ objectPosition: headshotPosition(leader.slug) }}
                />
              </div>
            </Link>
          ))}
          {remaining > 0 && (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                background: `${topic.color}33`,
                border: `2px solid ${topic.color}44`,
                color: topic.color,
              }}
            >
              +{remaining}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
