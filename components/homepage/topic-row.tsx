import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { TopicCard } from './topic-card';
import type { TopicWithStats } from '@/lib/types';

interface TopicRowProps {
  topics: TopicWithStats[];
}

export function TopicRow({ topics }: TopicRowProps) {
  return (
    <section id="topics" className="py-12 sm:py-20 bg-cv-cream">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <h2 className="font-display text-fluid-h2 font-bold text-cv-charcoal mb-10">
            Explore by Topic
          </h2>
        </ScrollReveal>
      </div>

      {/* Horizontal scroll on desktop, vertical stack on mobile (spec §4.6) */}
      <div className="max-w-bleed mx-auto px-4 sm:px-6">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 md:flex-row flex-col md:overflow-visible md:flex-wrap lg:flex-nowrap lg:overflow-x-auto">
          {topics.map((topic, i) => (
            <ScrollReveal key={topic.id} delay={i * 0.08}>
              <TopicCard topic={topic} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
