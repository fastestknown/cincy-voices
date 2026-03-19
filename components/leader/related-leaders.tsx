'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import type { Leader } from '@/lib/types';

interface RelatedLeadersProps {
  leaders: { leader: Leader; shared_source: string }[];
}

export function RelatedLeaders({ leaders }: RelatedLeadersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {leaders.map(({ leader, shared_source }, i) => (
        <ScrollReveal key={leader.id} delay={i * 0.1}>
          <Link href={`/leaders/${leader.slug}`} className="group">
            <motion.div
              layoutId={`avatar-${leader.slug}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-cv-border/50 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-cv-navy/20 to-cv-gold/20" />
              </div>
              <div>
                <p className="font-display font-bold text-cv-charcoal text-sm group-hover:text-cv-navy transition-colors">
                  {leader.name}
                </p>
                <p className="text-cv-muted text-xs mt-0.5">
                  Appeared together in {shared_source}
                </p>
              </div>
            </motion.div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  );
}
