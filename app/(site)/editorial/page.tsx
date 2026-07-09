import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getVisibleEditorialArticles } from '@/lib/editorial';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Editorial',
  description: 'Written profiles and stories from Cincinnati fractional leaders.',
  robots: { index: false, follow: false },
};

export default function EditorialPage() {
  const articles = getVisibleEditorialArticles();

  return (
    <div className="bg-cv-cream min-h-screen">
      <section className="pt-20 sm:pt-24 pb-10 sm:pb-14 px-4 sm:px-6">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <span className="font-mono-label text-cv-muted text-xs tracking-widest">EDITORIAL</span>
            <h1 className="font-display text-fluid-hero font-bold text-cv-charcoal mt-2">
              Stories From the Bench
            </h1>
            <p className="text-cv-muted font-body text-lg mt-4 max-w-2xl leading-relaxed">
              Written profiles of the fractional leaders building trust, judgment, and meaningful work across Cincinnati.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-content mx-auto">
          <div className="grid gap-8">
            {articles.map(article => (
              <ScrollReveal key={article.slug}>
                <Link
                  href={`/editorial/${article.slug}`}
                  className="group grid overflow-hidden rounded-sm border border-cv-border bg-white/45 md:grid-cols-[0.85fr_1.15fr] transition-colors hover:bg-white/70"
                >
                  <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
                    <Image
                      src={article.heroImage}
                      alt={article.leaderName}
                      fill
                      sizes="(max-width: 768px) 100vw, 42vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      priority={article.slug === articles[0]?.slug}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cv-charcoal/45 via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-cv-muted">
                      <span className="font-mono-label">{article.category}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-cv-charcoal mt-4">
                      {article.title}
                    </h2>
                    <p className="font-body text-base sm:text-lg leading-relaxed text-cv-muted mt-4">
                      {article.dek}
                    </p>
                    <div className="mt-8 text-sm font-medium text-cv-charcoal">
                      Read the profile <span className="inline-block transition-transform group-hover:translate-x-1">-&gt;</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
