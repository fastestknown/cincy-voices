import Link from 'next/link';
import { SITE } from '@/lib/constants';

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cv-cream/80 backdrop-blur-sm border-b border-cv-border/50">
      <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold text-cv-charcoal">
          {SITE.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-body text-cv-muted">
          <Link href="/" className="hover:text-cv-charcoal transition-colors">Leaders</Link>
          <Link href="/#topics" className="hover:text-cv-charcoal transition-colors">Topics</Link>
          <Link href="/about" className="hover:text-cv-charcoal transition-colors">About</Link>
        </nav>
      </div>
    </header>
  );
}
