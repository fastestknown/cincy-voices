'use client';

import Link from 'next/link';
import type { Leader } from '@/lib/types';

interface ThreadSideRailProps {
  leaders: Leader[];
  activeLeaderId: string | null;
}

export function ThreadSideRail({ leaders, activeLeaderId }: ThreadSideRailProps) {
  return (
    <aside className="hidden lg:block sticky top-24 self-start w-16 space-y-3">
      {leaders.map(leader => (
        <Link
          key={leader.id}
          href={`/leaders/${leader.slug}`}
          title={leader.name}
          className={`block w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 ${
            activeLeaderId === leader.id
              ? 'border-cv-gold scale-110 shadow-md'
              : 'border-cv-border/50 opacity-40 hover:opacity-70'
          }`}
        >
          <div className="w-full h-full bg-cv-navy/10" />
        </Link>
      ))}
    </aside>
  );
}
