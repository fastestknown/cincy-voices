# Recut Approval Sheet — 5 Pending Decisions

Open since June 1. Source: `docs/recut-plan-2026-06-01.md`. Nothing here has been uploaded to Mux or written to Supabase — all staged files are local at `/Users/fordknowlton/jun-os/data/cincy-voices/recuts/staged/`. Ford's decision on each row is the only remaining gate before local cutting proceeds. No publish happens without a separate, explicit go.

---

## 1. Will Phillips — Root Causes

**Staged file:** `will-phillips_root-causes_813000-842500_STAGED.mp4`
**Change:** 815120–844700ms (cuts off mid-word) → **813000–842500ms** (ends cleanly on "comfortable with.")
**Gemini scores:** AQ8 VQ8 MS9 SC9 BR9 LU9

**Recommendation: APPROVE.** Clean fix, no judgment call — the current clip is just cut wrong. Watch the staged file once to confirm "If" isn't clipped at the 813000ms start; if it is, use 812000ms instead.

**Decision:** ☑ **FINAL — 815120–842500ms, drop "If"** (Ford, 2026-07-09). Explicitly rejected the 813000ms staged version (2.2s of dead air) and the jump-cut splice option. Status: **final, local-approved.**

**Playback check result (2026-07-09, verified against AssemblyAI word timestamps + ffmpeg silencedetect, not by ear):** Source word timings: "...what would that be? **If**" ends at 810240ms. Then a real ~4.9s gap in the recording (no speech) until "**every** business leader..." begins at 815120ms — this is in the source footage itself, not an artifact of the trim. The original staged file (813000–842500ms) opened with 2.2s of dead silence before "every" and did not actually contain "If" either (it had already ended before the clip start), so it wasn't achieving what the recut plan's transcript assumed. The 812000ms fallback would have been worse, not better — more leading silence, still no "If."

**Resolution:** Cut a new local file, `will-phillips_root-causes_815120-842500_STAGED.mp4`, by trimming 2.120s off the front of the existing staged file (all footage needed was already local — no new Mux pull required). Re-encoded (not stream-copied) for frame-accurate start. Verified via silencedetect: clip now opens on speech within ~0.3s, no dead-air block. Duration 27.4s, matches 815120–842500ms exactly. Clip now reads: "Every business leader in the city of Cincinnati could understand one thing about my sweet spot, it would actually be understanding one thing about your business, which is if you've been trying to do something for six months to a year and the issue remains, you probably have the root cause misidentified. That's what happens time and time again because people default to solutions they're comfortable with."

The original `will-phillips_root-causes_813000-842500_STAGED.mp4` was left in place, not deleted — superseded, do not use.

---

## 2. Will Phillips — Outsider Questions

**Staged file:** `will-phillips_outsider-questions_561000-582000_STAGED.mp4`
**Change:** 529582–632839ms (starts with someone else's "Wow" + 33s of setup) → **561000–582000ms** ("Well, this probably — maybe I shouldn't say this — ..." through "culture shapes them.")
**Gemini scores:** Not yet valid — the existing 6/6/6 scores were run against the old, wrong window. **This clip has not been properly scored.**

**Recommendation: APPROVE the window, but re-run Gemini QA on the staged file before it moves anywhere near public_site or sales_deck.** The content itself reads strong (self-deprecating opener, complete thought) but I don't want to represent it as QA-passed until it's actually been scored on the right footage.

**Decision:** ☑ Approve the 561000–582000ms window (Ford, 2026-07-09). **Held for fresh Gemini QA** — not run in this pass (would mean sending the clip to Google's API, which is outside the local-only scope of this closure). Status: window locked, staged file already matches, but flagged do-not-use (public_site, sales_deck, vault, Mux, Supabase) until re-scored.

---

## 3. Amy Sheehy — Charity Model

**Staged file:** `amy-sheehy_charity-model_652730-669500_STAGED.mp4`
**Two versions on the table:**
- **Short (16.8s, 652730–669500ms):** "Instead of paying me, the client pays a charity... All at the same cost." Punchy, no setup.
- **Full (29s, 640360–669500ms):** Adds "So in hiring me..." lead-in for context.

**Recommendation: Short version.** This is Amy's most distinctive differentiator and the short cut is the one flagged for public_site hero + roebling_demo use. The abruptness is a feature here, not a bug — it forces a rewatch/question, which is what a hero clip should do.

**Decision:** ☑ Short version, 652730–669500ms (Ford, 2026-07-09). Staged file already matches exactly — no re-cut needed. Status: **final, local-approved.**

---

## 4. Christine Bell — Adversity (Bell's Palsy)

**Staged file:** `christine-bell_adversity_154868-177500_STAGED.mp4`
**Change:** 154868–180839ms (ends mid-sentence) → **154868–177500ms** (ends on "...I have not.")
**Open question:** there's a stumble at 159408ms ("I have been afflicted by—") mid-clip. Keep or remove?

**Recommendation: Keep the stumble.** She's talking about a condition that affects her speech — the stumble is the content, not an editing error. Removing it means a jump cut (two separate ffmpeg trims stitched together), which is more production work for a less honest result. This is her signature moment; I'd leave it alone.

**Decision:** ☑ Approve as staged, keep the stumble (Ford, 2026-07-09). 154868–177500ms, staged file already matches exactly — no re-cut needed. Status: **final, local-approved.**

---

## 5. Christine Bell — Why Fractional Growing

**Staged file:** `christine-bell_fractional-growing_589082-602580_STAGED.mp4`
**Change:** 583554–626185ms (opens with interviewer's question, 42.6s) → **589082–602580ms** (13.5s, "keep up.")
**Gemini scores:** AQ7 VQ7 MS7 SC7 BR7 LU7 — the weakest clip in the whole batch, both leaders and reviewers flagged it as generic ("AI is changing things, businesses need to keep up" — every fractional executive says some version of this).

**Recommendation: DROP.** Nothing in it is unique to Christine, and it's the only sub-8-score clip in this set. I don't think it's worth the vault slot, let alone public_site. If you want a compromise, the alternate window (589082–618500ms, adds the "afford new resources" line) is marginally more specific but still generic.

**Decision:** ☑ Drop entirely (Ford, 2026-07-09). Staged file `christine-bell_fractional-growing_589082-602580_STAGED.mp4` left in place, physically untouched (not deleted or moved — `review.html` hardcodes this filename, and nothing here is destructive/time-sensitive). Status: **dropped — do not use, do not upload, do not reference for any use case.**

---

## Closure Status (2026-07-09)

All 5 decisions are closed locally. Root Causes was finalized at 815120-842500ms after Ford chose to drop "If" and remove the dead-air opening from the 813000ms staged file. Full detail in `18_JUNE1_BATCH_CLOSURE_2026-07-09.md`.

Nothing in this batch has touched Mux, Supabase, or any deploy/publish surface.

### Outsider Questions Gemini re-score - 2026-07-09

Ford approved the external Gemini check after local closure. Gemini scored the 561000-582000ms staged clip highly on substance but recommended `recut` because the ending is not clean.

Result file: `/Users/fordknowlton/jun-os/data/cincy-voices/gemini-checks/will-phillips-outsider-questions-2026-07-09_093335-gemini.json`

Scores: AQ8 VQ8 MS9 SC8 BR9 LU9. Starts cleanly: true. Ends cleanly: false. Recommended action: recut. Note: end at 0:17.5, before the "um" and new thought.

Operational implication: the approved 561000-582000ms window is not QA-passed for use. The next candidate should keep the 561000ms start and test a 578500ms end, pending a local cut/watch. No Mux upload, Supabase write, vault use, sales use, or public use should happen until that shorter candidate is cut and approved.

### Desktop outtake file — verification result

Checked directly (not from memory): `sb_Will_Phillips.mp4` did exist at `/Users/fordknowlton/Desktop/cincy-voices-supercuts/clips/sb_Will_Phillips.mp4`, nested inside a subfolder. Ford later approved cleanup, and the Desktop outtake file was deleted on 2026-07-09. The corresponding review file, `REVIEW_will-phillips_outtake-check_0-40s.mp4`, remains in the staged folder as expected.
