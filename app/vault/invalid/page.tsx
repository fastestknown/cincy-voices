import Link from 'next/link';

export default function VaultInvalidPage() {
  return (
    <div className="min-h-screen bg-cv-dark flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-mono-label text-cv-gold text-xs tracking-widest mb-4">CINCY VOICES</p>
        <h1 className="font-display text-3xl text-white mb-4">Link expired or invalid</h1>
        <p className="text-white/60 font-body mb-8">
          This link is no longer valid. Contact Ford at{' '}
          <a href="mailto:ford@workwithmean.ing" className="text-cv-gold underline">
            ford@workwithmean.ing
          </a>{' '}
          to get a fresh one.
        </p>
        <Link href="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">
          Back to Cincy Voices
        </Link>
      </div>
    </div>
  );
}
