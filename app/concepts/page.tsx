import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Concept Gallery',
  description: 'Browse design concepts for Cincy Voices.',
};

const CONCEPTS = [
  {
    category: 'Homepage',
    items: [
      { file: 'homepage-a-billboard.html', name: 'Concept A: The Living Billboard', desc: 'Full-screen video grid hero with rotating clips' },
      { file: 'homepage-b-editorial.html', name: 'Concept B: Editorial', desc: 'Magazine-style editorial homepage' },
      { file: 'homepage-c-kinetic.html', name: 'Concept C: Kinetic', desc: 'Motion-first kinetic type hero' },
      { file: 'homepage-d-horizontal.html', name: 'Concept D: Horizontal', desc: 'Horizontal scroll-driven experience' },
      { file: 'homepage-e-broll.html', name: 'Concept E: B-Roll', desc: 'Rotating B-roll background videos' },
    ],
  },
  {
    category: 'Leader Profiles',
    items: [
      { file: 'profile-a-cinematic.html', name: 'Concept A: Cinematic Split', desc: 'Full-bleed photo with split-screen info panel' },
      { file: 'profile-b-immersive.html', name: 'Concept B: Immersive', desc: 'Full-screen immersive video hero' },
      { file: 'profile-c-dossier.html', name: 'Concept C: Dossier', desc: 'JetBrains Mono labels, sidebar stats, intelligence-style' },
      { file: 'profile-d-timeline.html', name: 'Concept D: Timeline', desc: 'Vertical career timeline format' },
    ],
  },
  {
    category: 'Topic Threads',
    items: [
      { file: 'topic-a-vertical-scroll.html', name: 'Concept A: Vertical Conversation', desc: 'Vertical timeline with alternating quote/video cards' },
      { file: 'topic-b-magazine.html', name: 'Concept B: Magazine', desc: 'Magazine-style editorial layout' },
      { file: 'topic-c-mosaic.html', name: 'Concept C: Mosaic', desc: 'Masonry grid of mixed media' },
      { file: 'topic-d-podcast.html', name: 'Concept D: Podcast', desc: 'Audio-first podcast player style' },
      { file: 'topic-e-immersive.html', name: 'Concept E: Immersive', desc: 'Full-screen immersive scroll' },
    ],
  },
  {
    category: 'About Page',
    items: [
      { file: 'about-a-manifesto.html', name: 'Concept A: The Manifesto', desc: 'Dark navy, giant serif hero, chapter sections' },
      { file: 'about-b-documentary.html', name: 'Concept B: Documentary', desc: 'Documentary-style behind-the-scenes' },
      { file: 'about-c-interactive.html', name: 'Concept C: Interactive', desc: 'Interactive data-driven experience' },
    ],
  },
];

export default function ConceptsPage() {
  return (
    <article className="bg-cv-navy min-h-screen py-24 px-6">
      <div className="max-w-content mx-auto">
        <span className="font-mono-label text-cv-gold/60 text-xs tracking-[0.3em] block mb-4">
          Design Exploration
        </span>
        <h1 className="font-display text-fluid-hero font-bold text-cv-light-text mb-4">
          Concept Gallery
        </h1>
        <p className="text-cv-light-text/45 font-body text-lg max-w-2xl mb-16">
          Browse all design concepts explored for Cincy Voices. Each is a standalone HTML prototype
          showing a different approach to the same content.
        </p>

        {CONCEPTS.map(group => (
          <section key={group.category} className="mb-16">
            <h2 className="font-display text-fluid-h3 font-bold text-cv-light-text mb-6 border-b border-white/10 pb-3">
              {group.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map(item => (
                <a
                  key={item.file}
                  href={`/concepts/${item.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
                >
                  <h3 className="font-display text-base font-bold text-cv-light-text group-hover:text-cv-gold transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-cv-light-text/35 text-sm mt-2 font-body">
                    {item.desc}
                  </p>
                  <span className="inline-block mt-4 text-cv-gold/60 text-xs font-mono-label group-hover:text-cv-gold transition-colors">
                    View Prototype &rarr;
                  </span>
                </a>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-8 pt-8 border-t border-white/10">
          <Link
            href="/"
            className="text-cv-light-text/40 hover:text-cv-light-text text-sm transition-colors"
          >
            &larr; Back to Homepage
          </Link>
        </div>
      </div>
    </article>
  );
}
