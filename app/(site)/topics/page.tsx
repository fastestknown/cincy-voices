import type { Metadata } from 'next';
import Link from 'next/link';
import { getTopicsWithStats } from '@/lib/queries';
import { TOPIC_COLORS } from '@/lib/constants';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Topics',
  description: 'Browse conversations by theme -- trust, origin stories, client impact, and more from Cincinnati\'s fractional leaders.',
};

export default async function TopicsPage() {
  const topics = await getTopicsWithStats();

  return (
    <div className="bg-cv-navy min-h-screen">
      <section className="pt-20 sm:pt-24 pb-10 sm:pb-14 px-4 sm:px-6">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <span className="font-mono-label text-cv-gold/60 text-xs tracking-[0.4em] block mb-4">
              CONVERSATIONS
            </span>
            <h1 className="font-display text-fluid-hero font-bold text-cv-light-text leading-tight">
              Topic Threads
            </h1>
            <p className="text-cv-light-text/45 font-body text-lg mt-4 max-w-2xl leading-relaxed">
              Every leader was asked about the same themes. Here&apos;s what they said.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {topics.map((topic, i) => {
              const color = TOPIC_COLORS[topic.slug]?.hex ?? topic.color;
              return (
                <ScrollReveal key={topic.id} delay={i * 0.05}>
                  <Link
                    href={`/topics/${topic.slug}`}
                    className="group block p-7 sm:p-8 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-all duration-300"
                    style={{ borderLeftWidth: 4, borderLeftColor: color }}
                  >
                    <h2 className="font-display text-[18px] sm:text-[20px] font-bold text-cv-light-text group-hover:text-cv-gold transition-colors leading-snug mb-2">
                      {topic.name}
                    </h2>
                    {topic.description && (
                      <p className="text-cv-light-text/40 text-sm font-body leading-relaxed line-clamp-2 mb-5">
                        {topic.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs font-mono-label">
                      <span className="text-cv-light-text/30">
                        {topic.leader_count} leader{topic.leader_count !== 1 ? 's' : ''}
                      </span>
                      <span className="text-white/10">·</span>
                      <span className="text-cv-gold/50 group-hover:text-cv-gold transition-colors">
                        Read thread →
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
