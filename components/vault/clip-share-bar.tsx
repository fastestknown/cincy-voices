'use client';

import { useState } from 'react';

interface ClipShareBarProps {
  clipUrl: string;
  pullQuote: string;
  leaderSlug: string;
  segmentId: string;
  downloadUrl?: string;
}

export function ClipShareBar({ clipUrl, pullQuote, downloadUrl }: ClipShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(clipUrl)}&summary=${encodeURIComponent(pullQuote)}`;
  const embedCode = `<iframe src="${clipUrl}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(clipUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-2 flex-wrap">
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0077B5] text-white text-xs font-body font-medium hover:bg-[#006097] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Share to LinkedIn
        </a>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 text-white text-xs font-body font-medium hover:bg-white/20 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy link'}
        </button>

        <button
          onClick={() => setShowEmbed(e => !e)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 text-white text-xs font-body font-medium hover:bg-white/20 transition-colors"
        >
          {showEmbed ? 'Hide embed' : 'Embed'}
        </button>

        {downloadUrl && (
          <a
            href={downloadUrl}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 text-white text-xs font-body font-medium hover:bg-white/20 transition-colors"
          >
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-current">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download
          </a>
        )}
      </div>

      {showEmbed && (
        <div className="bg-black/40 rounded-md p-3 border border-white/10">
          <p className="text-white/50 text-xs font-body mb-2">Paste this on your website:</p>
          <code className="text-white/80 text-xs font-mono break-all block mb-2">{embedCode}</code>
          <button
            onClick={handleCopyEmbed}
            className="text-cv-gold text-xs hover:text-cv-gold/80 transition-colors"
          >
            {embedCopied ? 'Copied!' : 'Copy embed code'}
          </button>
        </div>
      )}
    </div>
  );
}
