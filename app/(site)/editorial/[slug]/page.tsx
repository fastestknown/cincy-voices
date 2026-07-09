import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllEditorialArticles,
  getAllEditorialSlugs,
  getEditorialArticleBySlug,
  renderArticleParagraphs,
} from '@/lib/editorial';
import { getLeaderBySlug } from '@/lib/queries';
import { SITE } from '@/lib/constants';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllEditorialSlugs().map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getEditorialArticleBySlug(params.slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.dek,
    ...(article.hidden ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: `${article.title} | ${SITE.name}`,
      description: article.dek,
      url: `${SITE.url}/editorial/${article.slug}`,
      images: [{ url: article.heroImage }],
    },
  };
}

export default async function EditorialArticlePage({ params }: { params: { slug: string } }) {
  const article = getEditorialArticleBySlug(params.slug);
  if (!article) notFound();

  const [leader, articles] = await Promise.all([
    getLeaderBySlug(article.leaderSlug),
    Promise.resolve(getAllEditorialArticles()),
  ]);
  const relatedArticles = articles.filter(item => item.slug !== article.slug).slice(0, 2);
  const paragraphs = renderArticleParagraphs(article.body);

  return (
    <article className="bg-cv-cream min-h-screen">
      <section className="bg-cv-navy text-cv-light-text pt-16">
        <div className="max-w-bleed mx-auto grid lg:grid-cols-[0.9fr_1.1fr] min-h-[72vh]">
          <div className="relative min-h-[420px] lg:min-h-[72vh]">
            <Image
              src={article.heroImage}
              alt={article.leaderName}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cv-navy via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-cv-navy" />
          </div>

          <div className="flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-10 sm:py-14 lg:py-20">
            <ScrollReveal>
              <div className="flex flex-wrap items-center gap-3 text-xs text-cv-light-text/50">
                <span className="font-mono-label text-cv-gold/70">{article.category}</span>
                <span>{article.publishedAt}</span>
                <span>{article.readTime}</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-5">
                {article.title}
              </h1>
              <p className="text-cv-light-text/65 font-body text-lg sm:text-xl leading-relaxed mt-6 max-w-2xl">
                {article.dek}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {article.topics.map(topic => (
                  <span key={topic} className="rounded-full border border-cv-light-text/15 bg-cv-light-text/8 px-3 py-1 text-xs text-cv-light-text/65">
                    {topic}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-content mx-auto grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="max-w-3xl">
            {paragraphs.map((paragraph, index) => {
              const isQuote = paragraph.startsWith('"') && paragraph.endsWith('"');
              const shouldShowPullQuote = index === 10 && article.pullQuotes[0];

              return (
                <div key={`${paragraph.slice(0, 24)}-${index}`}>
                  {shouldShowPullQuote && (
                    <ScrollReveal>
                      <blockquote className="my-10 border-l-2 border-cv-gold pl-5 sm:pl-7 font-display text-2xl sm:text-3xl leading-snug text-cv-charcoal">
                        &ldquo;{article.pullQuotes[0]}&rdquo;
                      </blockquote>
                    </ScrollReveal>
                  )}

                  <ScrollReveal>
                    {isQuote ? (
                      <blockquote className="my-7 border-l-2 border-cv-gold/60 pl-5 font-display text-xl sm:text-2xl leading-snug text-cv-charcoal">
                        &ldquo;{paragraph.slice(1, -1)}&rdquo;
                      </blockquote>
                    ) : (
                      <p className="font-body text-lg leading-8 text-cv-charcoal/82 mb-6">
                        {paragraph}
                      </p>
                    )}
                  </ScrollReveal>
                </div>
              );
            })}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit border-t border-cv-border pt-6 lg:border-t-0 lg:border-l lg:pl-8">
            <div>
              <span className="font-mono-label text-cv-muted text-xs">FEATURED LEADER</span>
              <h2 className="font-display text-2xl font-bold text-cv-charcoal mt-2">
                {article.leaderName}
              </h2>
              <p className="text-cv-muted mt-1">{article.leaderRole}</p>
              {leader?.bio_summary && (
                <p className="text-sm leading-6 text-cv-charcoal/70 mt-5">
                  {leader.bio_summary}
                </p>
              )}
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={`/leaders/${article.leaderSlug}`}
                  className="inline-flex justify-center rounded-full border border-cv-charcoal/15 px-5 py-2.5 text-sm font-medium text-cv-charcoal transition-colors hover:bg-cv-charcoal hover:text-cv-light-text"
                >
                  View leader profile
                </Link>
                <Link
                  href="/editorial"
                  className="inline-flex justify-center rounded-full border border-cv-charcoal/15 px-5 py-2.5 text-sm font-medium text-cv-charcoal transition-colors hover:bg-white"
                >
                  More editorial stories
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-cv-border px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-content mx-auto">
          <span className="font-mono-label text-cv-muted text-xs">NEXT STORIES</span>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {relatedArticles.length > 0 ? (
              relatedArticles.map(item => (
                <Link key={item.slug} href={`/editorial/${item.slug}`} className="border border-cv-border bg-white/40 p-5 transition-colors hover:bg-white/70">
                  <h3 className="font-display text-2xl font-bold text-cv-charcoal">{item.title}</h3>
                  <p className="text-cv-muted text-sm leading-6 mt-3">{item.dek}</p>
                </Link>
              ))
            ) : (
              <div className="border border-cv-border bg-white/35 p-5">
                <h3 className="font-display text-2xl font-bold text-cv-charcoal">More fractional leader stories are coming.</h3>
                <p className="text-cv-muted text-sm leading-6 mt-3">
                  This editorial section will grow as new Cincy Voices profiles are published.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </article>
  );
}
