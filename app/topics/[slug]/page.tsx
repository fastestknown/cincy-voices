import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  getTopicBySlug,
  getThreadItems,
  getTopicLeaders,
  getAllTopics,
  getAllTopicSlugs,
} from '@/lib/queries';
import { SITE, TOPIC_COLORS } from '@/lib/constants';
import { ThreadHero } from '@/components/thread/thread-hero';
import { ThreadTimeline } from '@/components/thread/thread-timeline';
import { headshotPosition } from '@/lib/headshot-position';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllTopicSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) return {};

  return {
    title: topic.name,
    description: topic.description ?? `${topic.name} — perspectives from Cincinnati's fractional leaders`,
    openGraph: {
      title: `${topic.name} | ${SITE.name}`,
      description: topic.description ?? SITE.tagline,
      url: `${SITE.url}/topics/${topic.slug}`,
    },
  };
}

export default async function TopicThreadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();

  const [items, leaders, allTopics] = await Promise.all([
    getThreadItems(topic.id),
    getTopicLeaders(topic.id),
    getAllTopics(),
  ]);

  const otherTopics = allTopics.filter(t => t.id !== topic.id);

  return (
    <>
      {/* Full-screen immersive topic hero */}
      <ThreadHero topic={topic} leaders={leaders} />

      {/* Vertical Conversation Timeline */}
      <section className="bg-cv-cream py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-[800px] mx-auto relative">
          {/* Timeline header */}
          <ScrollReveal>
            <div className="mb-8 sm:mb-12 pl-14 md:pl-[56px]">
              <h2 className="font-display text-[22px] sm:text-[28px] font-bold text-cv-charcoal">
                The Conversation
              </h2>
              <p className="text-cv-muted text-sm mt-1.5 font-body">
                {leaders.length} leader{leaders.length !== 1 ? 's' : ''} weigh in on {topic.name.toLowerCase()}
              </p>
            </div>
          </ScrollReveal>

          {/* Timeline items */}
          <ThreadTimeline items={items} topic={topic} />
        </div>
      </section>

      {/* Explore More Topics — dark section with gradient transition */}
      <section className="bg-cv-navy relative pt-12 sm:pt-20 pb-12 sm:pb-20 px-4 sm:px-6">
        {/* Cream-to-navy gradient */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-cv-cream to-cv-navy" />

        <div className="max-w-[1000px] mx-auto pt-10">
          <ScrollReveal>
            <h2 className="font-display text-[22px] sm:text-[28px] font-bold text-cv-light-text mb-6 sm:mb-8 text-center">
              More Conversations
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {otherTopics.map((t, i) => {
              const topicColor = TOPIC_COLORS[t.slug]?.hex ?? t.color;
              return (
                <ScrollReveal key={t.id} delay={i * 0.06}>
                  <Link
                    href={`/topics/${t.slug}`}
                    className="block p-7 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-400"
                    style={{ borderLeftWidth: 4, borderLeftColor: topicColor }}
                  >
                    <h3 className="font-display text-base font-bold text-cv-light-text mb-1.5">
                      {t.name}
                    </h3>
                    {t.description && (
                      <p className="text-cv-light-text/35 text-xs line-clamp-2">
                        {t.description}
                      </p>
                    )}
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leaders in this thread */}
      <section className="bg-cv-navy py-10 sm:py-16 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-[1000px] mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-[22px] sm:text-[28px] font-bold text-cv-light-text mb-6 sm:mb-10 text-center">
              Voices in This Thread
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {leaders.map(leader => (
              <Link key={leader.id} href={`/leaders/${leader.slug}`} className="group text-center">
                <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-white/20 group-hover:border-cv-gold transition-colors">
                  <Image
                    src={`/headshots/${leader.slug}.jpg`}
                    alt={leader.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                    style={{ objectPosition: headshotPosition(leader.slug) }}
                  />
                </div>
                <p className="font-display text-sm font-bold text-cv-light-text mt-2 group-hover:text-cv-gold transition-colors">
                  {leader.name}
                </p>
                {leader.role && (
                  <p className="text-cv-light-text/40 text-xs">{leader.role}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
