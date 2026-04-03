/**
 * Extracts the most compelling sentence from a transcript segment
 * to use as a pull quote / hook next to the video player.
 *
 * Scores sentences by content quality signals rather than length alone.
 */
export function extractPullQuote(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  const candidates = sentences
    .map(s => s.trim())
    .filter(s => s.length >= 30 && s.length <= 180)
    .map(s => ({ text: s, score: scoreSentence(s) }))
    .filter(c => c.score > -10);

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0].text.replace(/^\s*,\s*/, '');
  }

  // Fallback: longest non-filler sentence, truncated
  const fallback = sentences
    .map(s => s.trim())
    .filter(s => s.length >= 20)
    .sort((a, b) => b.length - a.length)[0] || sentences[0]?.trim() || text;

  return fallback.length > 140 ? fallback.slice(0, 137) + '...' : fallback;
}

function scoreSentence(s: string): number {
  let score = 0;

  // ── Positive signals ──────────────────────────────

  // First-person insight / conviction — the speaker owns the statement
  if (/\b(i (learned|realized|believe|think|discovered|decided|knew|felt)|we (built|created|learned|realized))\b/i.test(s)) score += 6;

  // Declarative "is/are/was" statements — strong assertions
  if (/\b(it('s| is)|that('s| is)|this is|trust is|leadership is|the (key|secret|truth|reality|answer|difference))\b/i.test(s)) score += 5;

  // Metaphor / analogy markers
  if (/\b(like a|it('s| is) (like|about)|not .+ it('s| is)|the (foundation|engine|bridge|fabric|currency|operating system))\b/i.test(s)) score += 4;

  // Contrast / tension — "not X, but Y" structures
  if (/\b(not (just|only|about)|but (rather|actually|really)|instead of|the difference between|isn't .+ it's)\b/i.test(s)) score += 5;

  // Strong action/impact language
  if (/\b(transform|build|create|unlock|invest|earn|risk|grow|trust|empower|impact|matter|change|lead|serve)\b/i.test(s)) score += 3;

  // Emotional / values language
  if (/\b(trust|vulnerability|courage|integrity|authentic|purpose|passion|wisdom|genuine|honest|belief|conviction|heart)\b/i.test(s)) score += 3;

  // Universality — speaks beyond the individual
  if (/\b(every|everyone|people|anyone|nobody|the (world|city|community|industry|profession))\b/i.test(s)) score += 2;

  // Good length for a pull quote (sweet spot 60-130 chars)
  if (s.length >= 60 && s.length <= 130) score += 3;
  else if (s.length >= 45 && s.length <= 160) score += 1;

  // ── Negative signals ──────────────────────────────

  // Filler / hedging openers
  if (/^(uh|um|so,?\s|and\s|but\s|like\s|yeah|well\s|I mean|you know|right|okay|sorry|honestly)\b/i.test(s)) score -= 8;

  // Meta-commentary about the conversation
  if (/\b(as we (were|discussed|talked)|take it back|let me|going back to|earlier (you|we)|that('s| is) a (great|good) (question|point))\b/i.test(s)) score -= 10;

  // Questions — don't work as pull quotes
  if (s.endsWith('?')) score -= 6;

  // Starts with a conjunction (fragment feel)
  if (/^(And|But|Or|So|Because)\s/i.test(s)) score -= 3;

  // Name-drops the interviewer or references "this show/podcast/conversation"
  if (/\b(this (show|podcast|conversation|episode|interview)|Ford|the host)\b/i.test(s)) score -= 5;

  // Very generic / low-content
  if (/\b(it('s| is) (interesting|funny|cool|nice|great|amazing|awesome))\b/i.test(s)) score -= 4;

  // Trailing off / incomplete
  if (/\.\.\.$/.test(s)) score -= 3;

  // Too short to be impactful
  if (s.length < 40) score -= 2;

  return score;
}
