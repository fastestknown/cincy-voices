import { ScrollReveal } from '@/components/shared/scroll-reveal';

export function OriginStrip() {
  return (
    <section className="bg-cv-cream py-14 sm:py-20 px-4 sm:px-6 border-b border-cv-border/40">
      <div className="max-w-xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-cv-charcoal leading-snug">
            Cincinnati has a community of leaders who walk into companies and change things.
          </h2>
          <p className="mt-5 text-cv-muted font-body text-base sm:text-lg leading-relaxed">
            They&rsquo;re fractional executives. Trusted advisors. People who care deeply and have been through it before. We spent one day with 17 of them and hit record.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
