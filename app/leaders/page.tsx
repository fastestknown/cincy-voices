import type { Metadata } from 'next';
import { getLeadersWithTopics } from '@/lib/queries';
import { LeaderGrid } from '@/components/homepage/leader-grid';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Leaders',
  description: 'Meet the Cincinnati leaders sharing their stories.',
};

export default async function LeadersPage() {
  const leaders = await getLeadersWithTopics();

  return (
    <div className="bg-cv-cream min-h-screen">
      <section className="pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-6">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <span className="font-mono-label text-cv-muted text-xs tracking-widest">THE VOICES</span>
            <h1 className="font-display text-fluid-hero font-bold text-cv-charcoal mt-2">
              Meet the Leaders
            </h1>
            <p className="text-cv-muted font-body text-lg mt-3 max-w-2xl">
              Cincinnati&apos;s fractional leaders in unscripted, unfiltered conversation.
            </p>
          </ScrollReveal>
        </div>
      </section>
      <LeaderGrid leaders={leaders} />
    </div>
  );
}
