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
import { SITE } from '@/lib/constants';
import { ThreadHero } from '@/components/thread/thread-hero';
import { ThreadScroll } from '@/components/thread/thread-scroll';
import { ThreadSideRail } from '@/components/thread/thread-side-rail';
import { headshotPosition } from '@/lib/headshot-position';
import { TopicCard } from '@/components/homepage/topic-card';
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
      {/* Colored thread hero */}
      <ThreadHero topic={topic} leaders={leaders} />

      {/* Documentary scroll with side rail */}
      <section className="bg-cv-cream py-20 px-6">
        <div className="max-w-bleed mx-auto flex gap-8">
          {/* Side rail — desktop only, hidden on mobile per spec */}
          <ThreadSideRail
            leaders={leaders}
            activeLeaderId={items[0]?.leader_id ?? null}
          />

          {/* Main scroll */}
          <div className="flex-1 max-w-content">
            <ThreadScroll items={items} topic={topic} />
          </div>
        </div>
      </section>

      {/* Thread footer — explore more topics */}
      <section className="bg-cv-cream py-20 px-6 border-t border-cv-border">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-fluid-h2 font-bold text-cv-charcoal mb-10">
              Explore More Topics
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {otherTopics.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.08}>
                <TopicCard topic={{ ...t, leader_count: 0, item_count: 0, lead_quote: null }} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the leaders in this thread */}
      <section className="bg-cv-cream py-20 px-6 border-t border-cv-border">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-fluid-h2 font-bold text-cv-charcoal mb-10">
              Leaders in This Thread
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {leaders.map(leader => (
              <Link key={leader.id} href={`/leaders/${leader.slug}`} className="group text-center">
                <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-cv-border group-hover:border-cv-gold transition-colors">
                  <Image
                    src={`/headshots/${leader.slug}.jpg`}
                    alt={leader.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                    style={{ objectPosition: headshotPosition(leader.slug) }}
                  />
                </div>
                <p className="font-display text-sm font-bold text-cv-charcoal mt-2 group-hover:text-cv-navy transition-colors">
                  {leader.name}
                </p>
                {leader.role && (
                  <p className="text-cv-muted text-xs">{leader.role}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
