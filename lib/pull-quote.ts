/**
 * Extracts the most compelling sentence from a transcript segment
 * to use as a pull quote / hook next to the video player.
 */
export function extractPullQuote(text: string): string {
  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  const fillerStarts = /^(uh|um|so|and\s|but\s|like\s|yeah|well\s|I mean|you know|right|okay|sorry)/i;
  const metaPatterns = /^(as we|take it back|let me|going back to)/i;

  const candidates = sentences
    .map(s => s.trim())
    .filter(s => s.length >= 25 && s.length <= 160)
    .filter(s => !fillerStarts.test(s))
    .filter(s => !metaPatterns.test(s));

  if (candidates.length > 0) {
    // Prefer medium-length sentences (not too short, not too long)
    // Score by how "punchy" they are — shorter is better within range
    candidates.sort((a, b) => {
      const aScore = Math.abs(a.length - 70);
      const bScore = Math.abs(b.length - 70);
      return aScore - bScore;
    });
    return candidates[0].replace(/^\s*,\s*/, '');
  }

  // Fallback: first non-filler sentence, trimmed
  const fallback = sentences.find(s => !fillerStarts.test(s.trim()))?.trim() || sentences[0]?.trim() || text;
  return fallback.length > 120 ? fallback.slice(0, 117) + '...' : fallback;
}
