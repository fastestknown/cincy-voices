import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getLeaderBySlug,
  getLeaderSegments,
  getLeaderQuotes,
  getRelatedLeaders,
  getLeaderTopicCounts,
  getAllLeaderSlugs,
} from '@/lib/queries';
import { SITE } from '@/lib/constants';
import { ProfileHero } from '@/components/leader/profile-hero';
import { ClipSequence } from '@/components/leader/clip-sequence';
import { TopicMap } from '@/components/leader/topic-map';
import { RelatedLeaders } from '@/components/leader/related-leaders';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllLeaderSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const leader = await getLeaderBySlug(slug);
  if (!leader) return {};

  return {
    title: leader.name,
    description: leader.hero_quote ?? `${leader.name} — ${leader.role ?? 'fractional leader'} in Cincinnati`,
    openGraph: {
      title: `${leader.name} | ${SITE.name}`,
      description: leader.hero_quote ?? SITE.tagline,
      url: `${SITE.url}/leaders/${leader.slug}`,
    },
  };
}

export default async function LeaderProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const leader = await getLeaderBySlug(slug);
  if (!leader) notFound();

  const [segments, quotes, relatedLeaders, topicCounts] = await Promise.all([
    getLeaderSegments(leader.id),
    getLeaderQuotes(leader.id),
    getRelatedLeaders(leader.id),
    getLeaderTopicCounts(leader.id),
  ]);

  return (
    <>
      {/* Profile hero — headshot + info side by side */}
      <ProfileHero leader={leader} />

      {/* Transition dark → cream */}
      <div className="bg-gradient-to-b from-cv-navy to-cv-cream h-16" />

      {/* Featured quotes */}
      {quotes.length > 0 && (
        <section className="bg-cv-cream py-12 px-6">
          <div className="max-w-content mx-auto">
            <ScrollReveal>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-cv-charcoal mb-8">
                What They Said
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quotes.map((quote, i) => (
                <ScrollReveal key={quote.id} delay={i * 0.08}>
                  <blockquote className="p-5 bg-white rounded-xl border border-cv-border/50 shadow-sm">
                    <p className="font-display text-base md:text-lg font-bold text-cv-charcoal leading-relaxed">
                      &ldquo;{quote.quote_text}&rdquo;
                    </p>
                  </blockquote>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* "In Their Words" clip sequence */}
      {segments.length > 0 && (
        <section className="bg-cv-cream py-12 px-6">
          <div className="max-w-content mx-auto">
            <ScrollReveal>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-cv-charcoal mb-8">
                In Their Words
              </h2>
            </ScrollReveal>
            <ClipSequence segments={segments} leaderName={leader.name} />
          </div>
        </section>
      )}

      {/* Topic map */}
      {topicCounts.length > 0 && (
        <section className="bg-cv-cream py-12 px-6">
          <div className="max-w-content mx-auto">
            <ScrollReveal>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-cv-charcoal mb-8">
                What They Explore
              </h2>
            </ScrollReveal>
            <TopicMap topicCounts={topicCounts} />
          </div>
        </section>
      )}

      {/* Related leaders */}
      {relatedLeaders.length > 0 && (
        <section className="bg-cv-cream py-12 px-6 border-t border-cv-border">
          <div className="max-w-content mx-auto">
            <ScrollReveal>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-cv-charcoal mb-8">
                Also in the Conversation
              </h2>
            </ScrollReveal>
            <RelatedLeaders leaders={relatedLeaders} />
          </div>
        </section>
      )}
    </>
  );
}
