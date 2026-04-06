import type { Metadata } from 'next';
import { ConnectForm } from '@/components/connect/connect-form';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const metadata: Metadata = {
  title: 'Get Connected',
  description: 'Whether you run a business or lead a fractional practice, Work With Meaning starts with a conversation.',
};

export default function ConnectPage({ searchParams }: { searchParams: { type?: string } }) {
  const defaultType = searchParams.type === 'leader' ? 'leader' : searchParams.type === 'business' ? 'business' : undefined;

  return (
    <>
      <section className="bg-cv-navy min-h-dvh flex items-start justify-center pt-20 pb-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(212,168,67,0.06)_0%,transparent_60%)]" />

        <div className="relative w-full max-w-[680px]">
          <ScrollReveal>
            <span className="font-mono-label text-cv-gold/60 text-xs tracking-[0.4em] block mb-8">
              Work With Meaning
            </span>
            <h1 className="font-display text-fluid-h2 font-black text-cv-light-text leading-[1.15] mb-4">
              Let&apos;s start a conversation.
            </h1>
            <p className="text-cv-light-text/50 text-[17px] font-body font-light leading-relaxed mb-12">
              Whether you run a business or lead a fractional practice, the right relationship starts the same way.
            </p>
          </ScrollReveal>

          <ConnectForm defaultType={defaultType} />
        </div>
      </section>
    </>
  );
}
