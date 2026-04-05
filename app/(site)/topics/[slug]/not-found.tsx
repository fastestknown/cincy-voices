import Link from 'next/link';

export default function TopicNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 bg-cv-cream">
      <div className="text-center">
        <h1 className="font-display text-fluid-h2 font-bold text-cv-charcoal mb-4">Topic Not Found</h1>
        <p className="text-cv-muted mb-8">This topic thread doesn&apos;t exist.</p>
        <Link href="/#topics" className="inline-block px-6 py-3 bg-cv-charcoal text-cv-light-text rounded-full text-sm hover:bg-cv-navy transition-colors">
          Browse all topics
        </Link>
      </div>
    </div>
  );
}
