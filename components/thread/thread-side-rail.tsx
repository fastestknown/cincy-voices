'use client';

import Link from 'next/link';
import Image from 'next/image';
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
          className={`relative block w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 ${
            activeLeaderId === leader.id
              ? 'border-cv-gold scale-110 shadow-md'
              : 'border-cv-border/50 opacity-40 hover:opacity-70'
          }`}
        >
          <Image
            src={`/headshots/${leader.slug}.jpg`}
            alt={leader.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </Link>
      ))}
    </aside>
  );
}
