# Will Phillips Outsider Questions - Gemini Re-score

Date: 2026-07-09

Scope: External Gemini QA pass on the already-staged local file:

`/Users/fordknowlton/jun-os/data/cincy-voices/recuts/staged/will-phillips_outsider-questions_561000-582000_STAGED.mp4`

This was run only after Ford approved the external check. No Mux upload, Supabase write, deploy, publish, vault update, or sales collateral update happened.

## Result

Gemini liked the substance but did not approve the cut as final.

Structured result file:

`/Users/fordknowlton/jun-os/data/cincy-voices/gemini-checks/will-phillips-outsider-questions-2026-07-09_093335-gemini.json`

Raw response file:

`/Users/fordknowlton/jun-os/data/cincy-voices/gemini-checks/will-phillips-outsider-questions-2026-07-09_093335-gemini-raw.txt`

Scores:

| Metric | Score |
|---|---:|
| Audio quality | 8 |
| Visual quality | 8 |
| Message strength | 9 |
| Standalone clarity | 8 |
| Buyer relevance | 9 |
| Leader usefulness | 9 |
| B-roll usefulness | 3 |

Flags:

| Field | Value |
|---|---|
| Starts cleanly | true |
| Ends cleanly | false |
| Contains outtake or banter | false |
| Recommended action | recut |
| Flag | MID_SENTENCE_END: clip does not end at a natural sentence boundary |

Gemini's cut note: end at 0:17.5, before the "um" and new thought.

## Operational Call

The 561000-582000ms window is no longer held for re-score. It is now held for recut.

Recommended next candidate:

| Start | End | Rationale |
|---:|---:|---|
| 561000ms | 578500ms | Keeps the approved start and follows Gemini's 17.5s relative end recommendation. |

Do not use the 561000-582000ms staged file in public_site, sales_deck, vault, Mux, or Supabase.

## Recut Result — 2026-07-09

Cut locally per the recommendation above: `will-phillips_outsider-questions_561000-578500_STAGED.mp4`, at `/Users/fordknowlton/jun-os/data/cincy-voices/recuts/staged/`.

- Duration: 17.53s (matches the 17.5s target)
- Re-encoded, not stream-copied, for an accurate trim
- Tail check (ffmpeg silencedetect): silence begins at 16.94s and runs to the end of the file — the clip ends in a natural pause, consistent with Gemini's "end before the 'um'" note, not a mid-word or mid-sentence cut
- The original 561000-582000ms staged file is untouched (verified via MD5) and remains superseded — do not use

**Status update (2026-07-09): approved.** Ford watched the local candidate and approved it. `will-phillips_outsider-questions_561000-578500_STAGED.mp4` is now **final, local-approved.** This closes the recut decision — Gemini's "recut, end before the um" recommendation has been acted on and confirmed by human review.

Local-approved does not mean production-ready. Public-ready, sales-ready, vault-ready, Mux-ready, and Supabase-ready are each separate, ungranted gates. No Mux upload, Supabase write, deploy, publish, or outbound send action has happened at any point in this recut — this was local cutting and human review only.

## Parse Note

Gemini returned malformed JSON because the phrase `"stupid questions"` was not escaped inside `one_sentence_verdict`. The saved structured JSON preserves the raw response and manually escapes that phrase without changing scores, flags, or verdict.
