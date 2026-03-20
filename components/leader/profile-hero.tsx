'use client';

import Image from 'next/image';
import type { Leader } from '@/lib/types';

interface ProfileHeroProps {
  leader: Leader;
}

export function ProfileHero({ leader }: ProfileHeroProps) {
  return (
    <section className="bg-cv-navy py-14 px-6">
      <div className="max-w-content mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Headshot — visible face, proper sizing */}
          <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-cv-light-text/10">
            <Image
              src={`/headshots/${leader.slug}.jpg`}
              alt={leader.name}
              fill
              sizes="(max-width: 768px) 144px, 192px"
              className="object-cover object-top"
              priority
            />
          </div>

          {/* Profile info */}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-cv-light-text">
              {leader.name}
            </h1>
            {(leader.role || leader.company) && (
              <p className="text-cv-light-text/60 text-base font-body mt-1.5">
                {leader.role}{leader.role && leader.company ? ' · ' : ''}{leader.company}
              </p>
            )}

            {/* Expertise tags */}
            {(leader.expertise_tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {(leader.expertise_tags ?? []).map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-cv-light-text/10 text-cv-light-text/70">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Hero quote */}
            {leader.hero_quote && (
              <blockquote className="mt-5 font-display text-lg md:text-xl font-bold text-cv-gold/90 leading-relaxed">
                &ldquo;{leader.hero_quote}&rdquo;
              </blockquote>
            )}

            {/* Bio summary */}
            {leader.bio_summary && (
              <p className="mt-4 text-cv-light-text/55 text-sm font-body leading-relaxed line-clamp-4">
                {leader.bio_summary}
              </p>
            )}

            {/* Links */}
            {(leader.website_url || leader.linkedin_url) && (
              <div className="flex items-center gap-4 mt-4">
                {leader.linkedin_url && (
                  <a
                    href={leader.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cv-light-text/50 hover:text-cv-light-text text-sm transition-colors"
                  >
                    LinkedIn &rarr;
                  </a>
                )}
                {leader.website_url && (
                  <a
                    href={leader.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cv-light-text/50 hover:text-cv-light-text text-sm transition-colors"
                  >
                    Website &rarr;
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
