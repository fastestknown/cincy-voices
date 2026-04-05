import { getLeadersWithTopics, getTopicsWithStats, getBrollPlaybackIds, getFeaturedQuotes } from '@/lib/queries';
import { BrollHero } from '@/components/homepage/broll-hero';
import { QuoteTicker } from '@/components/homepage/quote-ticker';
import { LeaderGrid } from '@/components/homepage/leader-grid';
import { TopicRow } from '@/components/homepage/topic-row';
import { FooterQuote } from '@/components/homepage/footer-quote';

export const revalidate = 3600;

export default async function HomePage() {
  const [leaders, topics, brollIds, quotes] = await Promise.all([
    getLeadersWithTopics(),
    getTopicsWithStats(),
    getBrollPlaybackIds(),
    getFeaturedQuotes(),
  ]);

  const footerTopic = topics.find(t => t.lead_quote);
  const footerQuote = footerTopic?.lead_quote ?? 'Real conversations. Real leaders. Real Cincinnati.';

  return (
    <>
      {/* B-roll hero — rotating background videos with centered title */}
      <BrollHero playbackIds={brollIds} />

      {/* Quote ticker marquee */}
      <QuoteTicker quotes={quotes} />

      {/* Leader grid — cream background */}
      <div className="bg-cv-cream">
        <LeaderGrid leaders={leaders} />
      </div>

      {/* Topic thread cards */}
      <TopicRow topics={topics} />

      {/* Dark footer quote */}
      <FooterQuote
        quote={footerQuote}
        leaderName={footerTopic ? `on ${footerTopic.name}` : 'Cincy Voices'}
      />
    </>
  );
}
