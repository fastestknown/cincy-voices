import Link from 'next/link';

export default function LeaderNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 bg-cv-cream">
      <div className="text-center">
        <h1 className="font-display text-fluid-h2 font-bold text-cv-charcoal mb-4">Leader Not Found</h1>
        <p className="text-cv-muted mb-8">This leader doesn&apos;t have a profile yet.</p>
        <Link href="/" className="inline-block px-6 py-3 bg-cv-charcoal text-cv-light-text rounded-full text-sm hover:bg-cv-navy transition-colors">
          Back to all leaders
        </Link>
      </div>
    </div>
  );
}
