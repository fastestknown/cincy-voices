import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { getGlobalStats, getLeadersWithTopics } from '@/lib/queries';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'About',
  description: 'One day. Seventeen leaders. Real conversations about fractional leadership in Cincinnati.',
};

// Version 2: CTAs point to /connect (email capture) instead of external WWM site

export default async function AboutPage() {
  const [stats, leaders] = await Promise.all([
    getGlobalStats(),
    getLeadersWithTopics(),
  ]);

  const facesDouble = [...leaders, ...leaders];

  return (
    <>
      {/* Hero */}
      <section className="bg-cv-navy min-h-dvh flex items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,168,67,0.08)_0%,transparent_60%)]" />

        <div className="relative max-w-[900px] px-4 sm:px-6 py-16 sm:py-20">
          <ScrollReveal>
            <span className="font-mono-label text-cv-gold/60 text-xs tracking-[0.4em] block mb-10">
              About Cincy Voices
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="font-display text-fluid-giant font-black text-cv-light-text leading-[1.15]">
              One day.{' '}
              <span className="text-cv-gold">
                Seventeen leaders. Real conversations.
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-cv-light-text/45 text-lg font-body font-light mt-8 max-w-[600px] mx-auto leading-relaxed">
              Cincy Voices is what happens when you stop asking for a resume and start watching someone work.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <div className="mt-14">
              <span className="text-[10px] tracking-[3px] uppercase text-white/20">The Story</span>
              <div className="w-px h-12 mx-auto mt-3 bg-gradient-to-b from-cv-gold/50 to-transparent animate-pulse" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Chapter 1: The Day */}
      <section className="bg-cv-navy py-14 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-[800px] mx-auto relative">
          <div className="chapter-number font-display">01</div>
          <ScrollReveal>
            <span className="font-mono-label text-cv-gold text-xs tracking-[0.3em] block mb-4">
              The Day
            </span>
            <h2 className="font-display text-fluid-h2 font-bold text-cv-light-text leading-snug mb-8">
              These weren&apos;t interviews. They weren&apos;t panels. They were conversations.
            </h2>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2]">
              On one day at{' '}
              <strong className="text-cv-light-text font-medium">Cincinnati Podcast Studio</strong>,
              seventeen fractional leaders gathered and did something simple: they talked. About their
              clients, their origins, their failures, and what it actually takes to earn someone&apos;s
              trust. No scripts, no teleprompters, no pitches.
            </p>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2] mt-8">
              They built new connections. They strengthened old ones. They spent the day in room with
              people who understand the work because they&apos;re doing the same work. And they
              demonstrated on camera, without preparation, the kind of{' '}
              <strong className="text-cv-light-text font-medium">
                character, values, and leadership
              </strong>{' '}
              that most Cincinnati businesses have never had a chance to see.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="bg-cv-navy flex justify-center">
        <div className="w-[60px] h-[2px] bg-cv-gold/40" />
      </div>

      {/* Chapter 2: The Opportunity */}
      <section className="bg-cv-navy py-14 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-[800px] mx-auto relative">
          <div className="chapter-number font-display">02</div>
          <ScrollReveal>
            <span className="font-mono-label text-cv-gold text-xs tracking-[0.3em] block mb-4">
              The Opportunity
            </span>
            <h2 className="font-display text-fluid-h2 font-bold text-cv-light-text leading-snug mb-8">
              Fractional leadership is one of the most underutilized opportunities for small businesses right now.
            </h2>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2]">
              The model is proven. The talent exists. Most business owners know they have problems they
              can&apos;t solve internally. But they don&apos;t act.
            </p>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2] mt-8">
              The reason isn&apos;t cost. It isn&apos;t awareness. It&apos;s{' '}
              <strong className="text-cv-light-text font-medium">trust</strong>.
            </p>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2] mt-8">
              When a business has a challenge they can&apos;t handle on their own, the barrier to
              getting help isn&apos;t finding someone qualified. It&apos;s trusting someone enough to
              let them in. To give them real access. To bet the relationship on it.
            </p>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2] mt-8">
              Most businesses don&apos;t act on it because they don&apos;t know who to trust. Cincy
              Voices exists to change that.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="bg-cv-navy flex justify-center">
        <div className="w-[60px] h-[2px] bg-cv-gold/40" />
      </div>

      {/* Chapter 3: How We Help */}
      <section className="bg-cv-navy py-14 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-[800px] mx-auto relative">
          <div className="chapter-number font-display">03</div>
          <ScrollReveal>
            <span className="font-mono-label text-cv-gold text-xs tracking-[0.3em] block mb-4">
              How We Help
            </span>
            <h2 className="font-display text-fluid-h2 font-bold text-cv-light-text leading-snug mb-8">
              We don&apos;t match people because their resume looks good.
            </h2>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2]">
              <strong className="text-cv-light-text font-medium">Work With Meaning</strong> was built
              around one idea: the most successful business relationships are built on a foundation of
              trust, not credentials. We make introductions because these leaders are trusted by people
              already in your network. Because peers have watched them work. Because clients will
              vouch for them directly.
            </p>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2] mt-8">
              When relationship and trust are the infrastructure for a partnership, it is far more
              likely to succeed. That&apos;s what we&apos;re building in Cincinnati, one introduction
              at a time.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="bg-cv-navy py-14 sm:py-24 px-4 sm:px-6 text-center">
        <ScrollReveal>
          <span className="font-mono-label text-cv-gold text-xs tracking-[0.3em] block mb-14">
            By The Numbers
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 max-w-[900px] mx-auto">
            <div className="text-center">
              <p className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-cv-gold leading-none">
                {stats.leaders}
              </p>
              <p className="text-cv-light-text/40 text-sm mt-3 leading-snug">
                Leaders<br />Captured
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-cv-gold leading-none">
                {stats.clips}
              </p>
              <p className="text-cv-light-text/40 text-sm mt-3 leading-snug">
                Video<br />Clips
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-cv-gold leading-none">
                {stats.quotes}
              </p>
              <p className="text-cv-light-text/40 text-sm mt-3 leading-snug">
                Pull<br />Quotes
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-cv-gold leading-none">
                {stats.topics}
              </p>
              <p className="text-cv-light-text/40 text-sm mt-3 leading-snug">
                Topic<br />Threads
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Faces Marquee Strip */}
      <section className="bg-cv-navy py-12 sm:py-20 overflow-hidden">
        <ScrollReveal>
          <p className="text-center font-mono-label text-cv-gold text-xs tracking-[0.3em] mb-10">
            The Voices
          </p>
        </ScrollReveal>
        <div className="animate-marquee flex gap-5 w-max hover:[animation-play-state:paused]">
          {facesDouble.map((leader, i) => (
            <Link
              key={`${leader.id}-${i}`}
              href={`/leaders/${leader.slug}`}
              className="w-[72px] h-[72px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden flex-shrink-0 border-2 border-cv-gold/20 hover:border-cv-gold hover:scale-110 hover:shadow-[0_0_30px_rgba(212,168,67,0.3)] transition-all duration-400 group"
            >
              <Image
                src={`/headshots/${leader.slug}.jpg`}
                alt={leader.name}
                width={100}
                height={100}
                className="w-full h-full object-cover object-top grayscale-[40%] group-hover:grayscale-0 transition-[filter] duration-400"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA: Businesses */}
      <section className="bg-cv-navy py-14 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white/[0.03] border border-cv-gold/20 rounded-2xl p-8 sm:p-12">
            <ScrollReveal>
              <span className="font-mono-label text-cv-gold text-xs tracking-[0.3em] block mb-4">
                For Business Owners
              </span>
              <h2 className="font-display text-fluid-h2 font-bold text-cv-light-text leading-snug mb-6">
                Curious about what a fractional leader could do for your business?
              </h2>
              <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2] mb-8">
                Work With Meaning helps you find the right fractional leader for your specific
                situation, with a background uniquely suited to your industry and a track record
                you can verify through people you already trust. No cold searches, no blind
                interviews. Just warm introductions built on real relationships.
              </p>
              <Link
                href="/connect?type=business"
                className="inline-flex items-center gap-2 bg-cv-gold text-cv-navy font-body font-semibold px-7 py-3.5 rounded-full hover:bg-cv-gold/90 transition-colors text-sm"
              >
                Get introduced
                <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA: Fractional Leaders */}
      <section className="bg-cv-navy py-0 pb-14 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 sm:p-12">
            <ScrollReveal>
              <span className="font-mono-label text-cv-light-text/40 text-xs tracking-[0.3em] block mb-4">
                For Fractional Leaders
              </span>
              <h2 className="font-display text-fluid-h2 font-bold text-cv-light-text leading-snug mb-6">
                Building a practice on trust and long-term relationships?
              </h2>
              <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2] mb-8">
                If you&apos;re a fractional leader who wants to grow your practice through relationships
                rather than cold outreach, we&apos;d like to know you. Work With Meaning connects
                leaders who are serious about earning trust with the businesses that need exactly what
                you offer.
              </p>
              <Link
                href="/connect?type=leader"
                className="inline-flex items-center gap-2 border border-cv-gold/40 text-cv-gold font-body font-semibold px-7 py-3.5 rounded-full hover:border-cv-gold hover:bg-cv-gold/5 transition-colors text-sm"
              >
                Request an invite
                <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Credit Section */}
      <section className="bg-cv-navy py-14 sm:py-24 px-4 sm:px-6 border-t border-white/[0.06]">
        <ScrollReveal>
          <div className="max-w-[700px] mx-auto text-center space-y-10">
            <div>
              <p className="font-mono-label text-cv-gold text-xs tracking-[0.3em] mb-4">
                FILMED &amp; PRODUCED BY
              </p>
              <p className="text-cv-light-text/60 text-[16px] font-body leading-[2]">
                <strong className="text-cv-light-text font-medium">Brian and Josh</strong> at{' '}
                <strong className="text-cv-light-text font-medium">Cincinnati Podcast Studio</strong>{' '}
                filmed, edited, and made this day possible. They created a space where leaders could
                show up as themselves and a final product that does them justice.
              </p>
            </div>

            <div className="w-[40px] h-px bg-cv-gold/30 mx-auto" />

            <div>
              <p className="font-mono-label text-cv-gold text-xs tracking-[0.3em] mb-4">
                A PROJECT BY
              </p>
              <p className="text-cv-light-text/60 text-[16px] font-body leading-[2]">
                Cincy Voices is produced by{' '}
                <a
                  href="https://workwithmean.ing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cv-gold border-b border-cv-gold/30 hover:border-cv-gold transition-colors"
                >
                  Work With Meaning
                </a>{' '}
                -- a Cincinnati firm dedicated to helping businesses find fractional leaders they can
                trust, and helping fractional leaders build the relationships that make their practice
                sustainable.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
