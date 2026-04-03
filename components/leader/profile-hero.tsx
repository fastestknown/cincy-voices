'use client';

import Image from 'next/image';
import { headshotPosition } from '@/lib/headshot-position';
import type { Leader } from '@/lib/types';

interface ProfileHeroProps {
  leader: Leader;
  clipCount: number;
  quoteCount: number;
  topicCount: number;
  totalMinutes: number;
}

export function ProfileHero({ leader, clipCount, quoteCount, topicCount, totalMinutes }: ProfileHeroProps) {
  return (
    <section className="bg-cv-navy min-h-[70vh] relative overflow-hidden">
      <div className="max-w-bleed mx-auto">
        {/* Cinematic split: Photo left, info right */}
        <div className="flex flex-col lg:flex-row min-h-[70vh]">
          {/* Left — Full-bleed photo */}
          <div className="relative lg:w-[45%] aspect-[4/3] sm:aspect-[3/4] lg:aspect-auto lg:min-h-[70vh]">
            <Image
              src={`/headshots/${leader.slug}.jpg`}
              alt={leader.name}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
              style={{ objectPosition: headshotPosition(leader.slug) }}
              priority
            />
            {/* Gradient overlay for text readability on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-cv-navy via-transparent to-transparent lg:hidden" />
            {/* Right edge gradient on desktop */}
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cv-navy" />
          </div>

          {/* Right — Info panel */}
          <div className="relative lg:w-[55%] flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-20">
            {/* Dossier-style section label */}
            <span className="font-mono-label text-cv-gold/60 text-xs mb-4 tracking-widest">
              LEADER PROFILE
            </span>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cv-light-text leading-tight">
              {leader.name}
            </h1>

            {(leader.role || leader.company) && (
              <p className="text-cv-light-text/50 text-base sm:text-lg font-body mt-2 sm:mt-3">
                {leader.role}{leader.role && leader.company ? ' · ' : ''}{leader.company}
              </p>
            )}

            {/* Hero quote */}
            {leader.hero_quote && (
              <blockquote className="mt-6 sm:mt-8 font-display text-lg sm:text-xl md:text-2xl font-bold text-cv-gold/80 leading-relaxed border-l-2 border-cv-gold/30 pl-4 sm:pl-6">
                &ldquo;{leader.hero_quote}&rdquo;
              </blockquote>
            )}

            {/* Dossier stats grid */}
            <div className="mt-8 stat-grid rounded-lg overflow-hidden bg-white/5 max-w-sm">
              <div>
                <p className="text-2xl font-bold text-cv-light-text">{clipCount}</p>
                <p className="text-xs text-cv-light-text/40 font-mono-label mt-1">Clips</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cv-light-text">{quoteCount}</p>
                <p className="text-xs text-cv-light-text/40 font-mono-label mt-1">Quotes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cv-light-text">{topicCount}</p>
                <p className="text-xs text-cv-light-text/40 font-mono-label mt-1">Topics</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cv-light-text">{totalMinutes}</p>
                <p className="text-xs text-cv-light-text/40 font-mono-label mt-1">Minutes</p>
              </div>
            </div>

            {/* Expertise tags */}
            {(leader.expertise_tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {(leader.expertise_tags ?? []).map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-cv-light-text/8 text-cv-light-text/60 border border-cv-light-text/10">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* LinkedIn */}
            {leader.linkedin_url && (
              <div className="mt-6">
                <a
                  href={leader.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 text-cv-light-text/80 hover:bg-white/20 hover:text-cv-light-text border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Connect on LinkedIn
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
