'use client';

interface QuoteTickerProps {
  quotes: { quote_text: string; leader_name: string }[];
}

export function QuoteTicker({ quotes }: QuoteTickerProps) {
  if (!quotes.length) return null;

  // Double the quotes for seamless loop
  const doubled = [...quotes, ...quotes];

  return (
    <div className="bg-cv-navy py-4 overflow-hidden border-t border-white/5 border-b border-b-white/5">
      <div className="animate-ticker flex whitespace-nowrap">
        {doubled.map((q, i) => (
          <span key={i} className="inline-flex items-center mx-8 text-cv-light-text/50 text-sm font-body">
            <span className="text-cv-gold mr-2">&ldquo;</span>
            <span className="text-cv-light-text/70">{q.quote_text}</span>
            <span className="text-cv-gold ml-2">&rdquo;</span>
            <span className="ml-3 text-cv-light-text/30">— {q.leader_name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
