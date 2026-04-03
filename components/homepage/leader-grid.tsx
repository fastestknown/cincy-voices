import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { LeaderCard } from './leader-card';
import type { LeaderWithTopics } from '@/lib/types';

interface LeaderGridProps {
  leaders: LeaderWithTopics[];
}

export function LeaderGrid({ leaders }: LeaderGridProps) {
  return (
    <section className="max-w-bleed mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <ScrollReveal>
        <h2 className="font-display text-fluid-h2 font-bold text-cv-charcoal mb-6 sm:mb-12 text-center">
          Meet the Voices
        </h2>
      </ScrollReveal>

      {/* Asymmetric grid: 1.2fr 0.8fr 1fr on desktop, single column mobile (spec §4.3, §4.6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-leaders gap-4 sm:gap-6">
        {leaders.map((leader, i) => (
          <ScrollReveal key={leader.id} delay={i * 0.1}>
            <LeaderCard leader={leader} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
