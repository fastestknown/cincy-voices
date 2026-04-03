import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { getGlobalStats, getLeadersWithTopics } from '@/lib/queries';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'About',
  description: 'Every city has a story. This one is told by the people building it.',
};

export default async function AboutPage() {
  const [stats, leaders] = await Promise.all([
    getGlobalStats(),
    getLeadersWithTopics(),
  ]);

  // Double array for seamless marquee loop
  const facesDouble = [...leaders, ...leaders];

  return (
    <>
      {/* Hero — Giant Serif Manifesto */}
      <section className="bg-cv-navy min-h-dvh flex items-center justify-center text-center relative overflow-hidden">
        {/* Subtle gold radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,168,67,0.08)_0%,transparent_60%)]" />

        <div className="relative max-w-[900px] px-4 sm:px-6 py-16 sm:py-20">
          <ScrollReveal>
            <span className="font-mono-label text-cv-gold/60 text-xs tracking-[0.4em] block mb-10">
              About This Project
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="font-display text-fluid-giant font-black text-cv-light-text leading-[1.15]">
              Every city has a story.{' '}
              <span className="text-cv-gold">
                This one is told by the people building it.
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-cv-light-text/45 text-lg font-body font-light mt-8 max-w-[600px] mx-auto leading-relaxed">
              Cincy Voices captures Cincinnati&apos;s business leaders in unscripted, unfiltered conversation — preserving the wisdom that usually disappears after the meeting ends.
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

      {/* Chapter 1: The Problem */}
      <section className="bg-cv-navy py-14 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-[800px] mx-auto relative">
          <div className="chapter-number font-display">01</div>
          <ScrollReveal>
            <span className="font-mono-label text-cv-gold text-xs tracking-[0.3em] block mb-4">
              The Problem
            </span>
            <h2 className="font-display text-fluid-h2 font-bold text-cv-light-text leading-snug mb-8">
              The best conversations happen off the record.
            </h2>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2]">
              Every week in Cincinnati, business leaders sit across from each other and share{' '}
              <strong className="text-cv-light-text font-medium">hard-won lessons</strong> — about
              turnarounds they navigated, relationships they built, risks they took. And then the
              conversation ends. The insight evaporates. The wisdom stays locked in a conference room.
            </p>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2] mt-8">
              We wanted to change that.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-cv-navy flex justify-center">
        <div className="w-[60px] h-[2px] bg-cv-gold/40" />
      </div>

      {/* Chapter 2: The Approach */}
      <section className="bg-cv-navy py-14 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-[800px] mx-auto relative">
          <div className="chapter-number font-display">02</div>
          <ScrollReveal>
            <span className="font-mono-label text-cv-gold text-xs tracking-[0.3em] block mb-4">
              The Approach
            </span>
            <h2 className="font-display text-fluid-h2 font-bold text-cv-light-text leading-snug mb-8">
              No scripts. No teleprompters. Just real people talking about real work.
            </h2>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2]">
              We brought Cincinnati&apos;s leaders together for{' '}
              <strong className="text-cv-light-text font-medium">facilitated conversations</strong> — not
              interviews, not panels, not pitches. Authentic dialogue about the topics that matter most:{' '}
              <strong className="text-cv-light-text font-medium">
                trust, growth, origin stories, client impact, culture, collaboration, and the fractional model
              </strong>.
            </p>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2] mt-8">
              Then we captured everything. Every insight, every story, every moment of vulnerability.
              And we built this site to let you experience it as if you were in the room.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-cv-navy flex justify-center">
        <div className="w-[60px] h-[2px] bg-cv-gold/40" />
      </div>

      {/* Chapter 3: The Vision */}
      <section className="bg-cv-navy py-14 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-[800px] mx-auto relative">
          <div className="chapter-number font-display">03</div>
          <ScrollReveal>
            <span className="font-mono-label text-cv-gold text-xs tracking-[0.3em] block mb-4">
              The Vision
            </span>
            <h2 className="font-display text-fluid-h2 font-bold text-cv-light-text leading-snug mb-8">
              A living archive of Cincinnati&apos;s leadership wisdom.
            </h2>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2]">
              Cincy Voices isn&apos;t a one-time project. It&apos;s{' '}
              <strong className="text-cv-light-text font-medium">a growing collection</strong> — a place
              where the perspectives of this city&apos;s most thoughtful leaders are preserved, connected,
              and made accessible to anyone who wants to learn from them.
            </p>
            <p className="text-cv-light-text/60 text-[17px] font-body font-light leading-[2] mt-8">
              Browse by leader. Explore by topic. Watch the clips that resonate.{' '}
              <strong className="text-cv-light-text font-medium">
                This is Cincinnati, in its own words.
              </strong>
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

      {/* Credit Section */}
      <section className="bg-cv-navy py-14 sm:py-24 px-4 sm:px-6">
        <ScrollReveal>
          <div className="max-w-[600px] mx-auto text-center">
            <p className="font-display text-sm font-bold text-cv-gold tracking-[0.3em] mb-6">
              A PROJECT BY
            </p>
            <p className="text-cv-light-text/40 text-[15px] font-body leading-[1.8]">
              Cincy Voices is produced by{' '}
              <a
                href="https://workwithmean.ing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cv-gold border-b border-cv-gold/30 hover:border-cv-gold transition-colors"
              >
                Work With Meaning
              </a>{' '}
              — a Cincinnati-based firm that helps leaders build businesses rooted in purpose,
              relationships, and strategic clarity.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
