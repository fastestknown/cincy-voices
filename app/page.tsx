import { getLeadersWithTopics, getTopicsWithStats } from '@/lib/queries';
import { MontageHero } from '@/components/homepage/montage-hero';
import { CreamReveal } from '@/components/homepage/cream-reveal';
import { LeaderGrid } from '@/components/homepage/leader-grid';
import { TopicRow } from '@/components/homepage/topic-row';
import { FooterQuote } from '@/components/homepage/footer-quote';

export const revalidate = 3600; // ISR: hourly

export default async function HomePage() {
  const [leaders, topics] = await Promise.all([
    getLeadersWithTopics(),
    getTopicsWithStats(),
  ]);

  // Footer quote: first topic's lead quote (derived from thread_items quotes)
  const footerTopic = topics.find(t => t.lead_quote);
  const footerQuote = footerTopic?.lead_quote ?? 'Real conversations. Real leaders. Real Cincinnati.';

  return (
    <>
      {/* Montage hero — dark load, auto-play, timed captions */}
      <MontageHero montagePlaybackId={null /* Replace with montage Mux ID when cut */} />

      {/* Cream reveal transition — navy → cream over 200px scroll */}
      <CreamReveal>
        {/* Leader grid — asymmetric, micro-clip hover, topic tags */}
        <LeaderGrid leaders={leaders} />

        {/* Topic thread cards — horizontal scroll, color bars, stats */}
        <TopicRow topics={topics} />
      </CreamReveal>

      {/* Dark footer quote — full-width, ambient video */}
      <FooterQuote
        quote={footerQuote}
        leaderName={footerTopic ? `on ${footerTopic.name}` : 'Cincy Voices'}
      />
    </>
  );
}
