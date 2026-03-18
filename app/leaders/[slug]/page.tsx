import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getLeaderBySlug,
  getHeroSegment,
  getLeaderSegments,
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

  const [heroSegment, segments, relatedLeaders, topicCounts] = await Promise.all([
    leader.hero_segment_id ? getHeroSegment(leader.hero_segment_id) : null,
    getLeaderSegments(leader.id),
    getRelatedLeaders(leader.id),
    getLeaderTopicCounts(leader.id),
  ]);

  return (
    <>
      {/* Viewport-height dark hero with clip */}
      <ProfileHero leader={leader} heroSegment={heroSegment} />

      {/* Pull quote below hero — transition zone */}
      {leader.hero_quote && (
        <section className="bg-cv-navy py-16 px-6">
          <ScrollReveal>
            <blockquote className="max-w-content mx-auto font-display text-fluid-quote font-bold text-cv-light-text/90 text-center leading-relaxed">
              &ldquo;{leader.hero_quote}&rdquo;
            </blockquote>
          </ScrollReveal>
        </section>
      )}

      {/* Transition dark → cream */}
      <div className="bg-gradient-to-b from-cv-navy to-cv-cream h-24" />

      {/* "In Their Words" clip sequence */}
      <section className="bg-cv-cream py-20 px-6">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-fluid-h2 font-bold text-cv-charcoal mb-12">
              In Their Words
            </h2>
          </ScrollReveal>
          <ClipSequence segments={segments} leaderName={leader.name} />
        </div>
      </section>

      {/* Topic map */}
      {topicCounts.length > 0 && (
        <section className="bg-cv-cream py-20 px-6">
          <div className="max-w-content mx-auto">
            <ScrollReveal>
              <h2 className="font-display text-fluid-h2 font-bold text-cv-charcoal mb-12">
                What They Explore
              </h2>
            </ScrollReveal>
            <TopicMap topicCounts={topicCounts} />
          </div>
        </section>
      )}

      {/* Related leaders */}
      {relatedLeaders.length > 0 && (
        <section className="bg-cv-cream py-20 px-6 border-t border-cv-border">
          <div className="max-w-content mx-auto">
            <ScrollReveal>
              <h2 className="font-display text-fluid-h2 font-bold text-cv-charcoal mb-12">
                Also in the Conversation
              </h2>
            </ScrollReveal>
            <RelatedLeaders leaders={relatedLeaders} />
          </div>
        </section>
      )}

      {/* Leader CTAs (spec §9) */}
      {(leader.website_url || leader.linkedin_url) && (
        <section className="bg-cv-cream pb-20 px-6">
          <div className="max-w-content mx-auto flex items-center gap-6 justify-center">
            {leader.website_url && (
              <a
                href={leader.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cv-muted hover:text-cv-charcoal text-sm transition-colors underline underline-offset-2"
              >
                Visit {leader.name.split(' ')[0]}&apos;s site
              </a>
            )}
            {leader.linkedin_url && (
              <a
                href={leader.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cv-muted hover:text-cv-charcoal text-sm transition-colors underline underline-offset-2"
              >
                Connect on LinkedIn
              </a>
            )}
          </div>
        </section>
      )}
    </>
  );
}
