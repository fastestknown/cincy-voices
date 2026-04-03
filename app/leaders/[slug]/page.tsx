import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getLeaderBySlug,
  getLeaderSegments,
  getLeaderQuotes,
  getRelatedLeaders,
  getLeaderTopicCounts,
  getLeaderStats,
  getAllLeaderSlugs,
} from '@/lib/queries';
import { SITE } from '@/lib/constants';
import { ProfileHero } from '@/components/leader/profile-hero';
import { ClipSequence } from '@/components/leader/clip-sequence';
import { QuoteMosaic } from '@/components/leader/quote-mosaic';
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

  const [segments, quotes, relatedLeaders, topicCounts, stats] = await Promise.all([
    getLeaderSegments(leader.id),
    getLeaderQuotes(leader.id),
    getRelatedLeaders(leader.id),
    getLeaderTopicCounts(leader.id),
    getLeaderStats(leader.id),
  ]);

  return (
    <>
      {/* Cinematic hero — full-bleed photo left, dossier info right */}
      <ProfileHero
        leader={leader}
        clipCount={stats.clipCount}
        quoteCount={quotes.length}
        topicCount={topicCounts.length}
        totalMinutes={stats.totalMinutes}
      />

      {/* Bio section */}
      {leader.bio_summary && (
        <section className="bg-cv-cream py-10 sm:py-16 px-4 sm:px-6">
          <div className="max-w-content mx-auto">
            <ScrollReveal>
              <div className="max-w-3xl">
                <span className="font-mono-label text-cv-muted text-xs tracking-widest">BIO</span>
                <p className="mt-4 text-cv-charcoal/85 font-body text-lg leading-relaxed">
                  {leader.bio_summary}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Quotes mosaic */}
      {quotes.length > 0 && (
        <section className="bg-cv-cream py-10 sm:py-16 px-4 sm:px-6 border-t border-cv-border/50">
          <div className="max-w-content mx-auto">
            <ScrollReveal>
              <span className="font-mono-label text-cv-muted text-xs tracking-widest">QUOTES</span>
              <h2 className="font-display text-fluid-h2 font-bold text-cv-charcoal mt-2 mb-8">
                In Their Words
              </h2>
            </ScrollReveal>
            <QuoteMosaic quotes={quotes} leaderName={leader.name} />
          </div>
        </section>
      )}

      {/* Video clips */}
      {segments.length > 0 && (
        <section className="bg-cv-cream py-10 sm:py-16 px-4 sm:px-6 border-t border-cv-border/50">
          <div className="max-w-content mx-auto">
            <ScrollReveal>
              <span className="font-mono-label text-cv-muted text-xs tracking-widest">CLIPS</span>
              <h2 className="font-display text-fluid-h2 font-bold text-cv-charcoal mt-2 mb-8">
                Watch &amp; Listen
              </h2>
            </ScrollReveal>
            <ClipSequence segments={segments} leaderName={leader.name} />
          </div>
        </section>
      )}

      {/* Topic connections */}
      {topicCounts.length > 0 && (
        <section className="bg-cv-cream py-10 sm:py-16 px-4 sm:px-6 border-t border-cv-border/50">
          <div className="max-w-content mx-auto">
            <ScrollReveal>
              <span className="font-mono-label text-cv-muted text-xs tracking-widest">TOPICS</span>
              <h2 className="font-display text-fluid-h2 font-bold text-cv-charcoal mt-2 mb-8">
                What They Explore
              </h2>
            </ScrollReveal>
            <TopicMap topicCounts={topicCounts} />
          </div>
        </section>
      )}

      {/* Related leaders */}
      {relatedLeaders.length > 0 && (
        <section className="bg-cv-cream py-10 sm:py-16 px-4 sm:px-6 border-t border-cv-border/50">
          <div className="max-w-content mx-auto">
            <ScrollReveal>
              <span className="font-mono-label text-cv-muted text-xs tracking-widest">CONNECTIONS</span>
              <h2 className="font-display text-fluid-h2 font-bold text-cv-charcoal mt-2 mb-8">
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
