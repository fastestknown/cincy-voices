# Editorial and Design System

## Clip quality rubric

Based on the Gemini QA fields already in production (`gemini-check.py`) plus the recut plan's documented axes (AQ/VQ/MS/SC/BR/LU):

| Axis | Question | Auto-reject if |
|---|---|---|
| Audio quality | Clean, no dropout/clipping? | Below threshold and unfixable |
| Visual quality | Well-framed, lit, in focus? | Below threshold |
| Message strength | Says something real, not filler? | Score ≤ 2/5 |
| Standalone clarity | Makes sense with zero context? | Requires setup that can't fit in a caption |
| Buyer relevance | Would a company evaluating fractional leadership care? | N/A for internal-only use |
| Leader usefulness | Would the leader be proud to share this? | This is the tie-breaker on any borderline call |
| Clean starts/ends | No mid-sentence cut? | Auto-reject, send back for re-trim |
| Outtake/banter flag | Is this actually content, or a greeting/joke aside? | Auto-reject (this is what caught the Will Phillips "Hey Adam" clip) |

**Decision rule:** all axes ≥7/10 and no outtake flag → auto-stage. Any axis 4-6 → escalate to Documentary Editor for a human call. Any axis ≤3 or an outtake flag → auto-reject, no escalation needed. Anything touching a personal disclosure (health, family, past failure) always escalates regardless of score — that's a leader-usefulness judgment call, not a technical one.

## Copy standards

All outbound copy drafts (LinkedIn captions, email copy, sales collateral text) follow Ford's voice rules: warm, vulnerable, specific, curious, no pressure, no corporate language. Concretely: contractions, 2-4 questions per message, specific names and numbers, no em-dashes, no banned words (synergize, leverage, utilize, disrupt, revolutionary, game-changing), no long paragraphs (max 3-4 sentences), no guru positioning. Score every draft against the 5-point Quick Check before it's shown to Ford: would Ford say this, is there a question, is there vulnerability or uncertainty, are there specific details, is it clean of forbidden words/em-dashes. 4/5 minimum before it's presentable.

## Leader profile standards

Every profile field written from Cincy Voices evidence carries: source (which transcript/segment), confidence (Claude's self-rated confidence), approval status (`pending_review` until Ford confirms), and consent scope (internal / sales / public). No profile field ships without at least the leader-review pass on anything directly quoted or attributed. See `14_PROFILE_ENRICHMENT_MODEL.md` for the full field list.

## Social post formats

LinkedIn: 150-250 words, conversational, one clip or one quote as the anchor, one engagement question at the end, link in first comment never in the post body. Every leader-tagged post requires the leader's consent before the tag goes live, not just before the post ships.

## Sales collateral formats

One-pagers: leader photo/clip thumbnail, 2-3 sentence bio pulled from the enriched profile (not the raw transcript), one power quote, one outcome-with-metric if available. Objection-handling reels: 30-45 second clips organized by the buyer question they answer (e.g., "how do I know a fractional leader will actually show up"), drawn only from clips scoring ≥7 on buyer relevance.

## Magazine feature formats

Deferred (see `15_MAGAZINE_AND_EDITORIAL_PILOT.md`). If revisited, should follow the existing "Practice" issue-00 prototype's established formats: Feature, Column, Field Note, Conversation, Long Read — do not invent new formats without reason.

## Design templates needed

1. Leader one-pager (PDF/HTML, matches WWM brand).
2. Social clip card (thumbnail + quote overlay, matches site's `quote-mosaic` visual language already built).
3. Sales deck slide (single-leader proof point).
4. Vault clip share card (already exists per `clip-share-bar.tsx` — reuse, don't rebuild).

## Visual QA standards for professional-looking assets

No clip ships publicly with: a mid-sentence start/end, visible outtake behavior, a shared placeholder Mux ID (see the known data bug), or a thumbnail frame with an awkward expression. Every new template gets a one-time Design Director pass against 2-3 real leaders' content before it's approved for repeated use — don't approve a template on a mockup alone.

## Ford voice rules for any outbound copy drafts (restated for this system)

Warm, vulnerable, specific, curious. No sales pressure, no FOMO, no urgency language. Every draft is exactly that — a draft — until Ford has seen it and, where a leader is featured, until the leader has too.
