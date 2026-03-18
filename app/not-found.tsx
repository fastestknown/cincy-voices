import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display text-fluid-hero font-bold text-cv-charcoal mb-4">Not Found</h1>
        <p className="text-cv-muted mb-8">This page doesn&apos;t exist yet.</p>
        <Link href="/" className="inline-block px-6 py-3 bg-cv-charcoal text-cv-light-text rounded-full text-sm hover:bg-cv-navy transition-colors">
          Back to Voices
        </Link>
      </div>
    </div>
  );
}
