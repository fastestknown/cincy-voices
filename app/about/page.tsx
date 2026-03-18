import type { Metadata } from 'next';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const metadata: Metadata = {
  title: 'About',
  description: 'What Cincy Voices is and why it exists.',
};

export default function AboutPage() {
  return (
    <article className="bg-cv-cream py-24 px-6">
      <div className="max-w-[720px] mx-auto">
        <ScrollReveal>
          <h1 className="font-display text-fluid-hero font-bold text-cv-charcoal mb-8">
            About Cincy Voices
          </h1>
        </ScrollReveal>

        <ScrollReveal>
          <div className="prose prose-lg font-body text-cv-charcoal/85 space-y-6">
            <p>
              Cincinnati has one of the most connected fractional leadership communities in the country.
              Ten of those leaders sat down for real, unscripted conversations about trust, growth,
              collaboration, and what it actually means to lead without a full-time seat at the table.
            </p>
            <p>
              <strong>Cincy Voices</strong> is those conversations — curated into topics, cut into
              moments, and presented as a documentary-style experience. No scripts. No polish.
              Just real leaders being honest about how the work actually gets done.
            </p>
            <p>
              This project is built by{' '}
              <a
                href="https://workwithmeaning.com"
                className="text-cv-gold hover:text-cv-charcoal transition-colors underline underline-offset-2"
              >
                Work With Meaning
              </a>
              , a Cincinnati company that connects businesses with fractional leaders who fit.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </article>
  );
}
