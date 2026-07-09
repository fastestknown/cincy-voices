# June 1 Recut Batch — Local Closure Record (2026-07-09)

Local-only closure of the 5-clip approval backlog from `docs/recut-plan-2026-06-01.md`. No Mux upload, no Supabase write, no deploy, no external send happened as part of this closure. All files referenced below are local, at `/Users/fordknowlton/jun-os/data/cincy-voices/recuts/staged/`.

This is a plain local record, not a database write — nothing here touches `cincy_voices_segments.review_status` in Supabase.

## Final status per clip

| Clip | Window | Status | Notes |
|---|---|---|---|
| Will Phillips — Root Causes | 815120–842500ms | **Final, local-approved** | Ford chose to drop "If" rather than keep the 2.2s dead-air open or do a jump-cut splice. New file `will-phillips_root-causes_815120-842500_STAGED.mp4` cut locally from the existing staged file (no new Mux pull), re-encoded for a frame-accurate start, verified silence-free via silencedetect. Old `..._813000-842500_STAGED.mp4` left in place, superseded, do not use. |
| Will Phillips — Outsider Questions | 561000-582000ms | **Window approved, held for recut** | Gemini re-score completed after Ford approved the external check. Scores were strong (AQ8 VQ8 MS9 SC8 BR9 LU9), but Gemini recommended recut because the clip does not end cleanly. Next candidate should test 561000-578500ms. Do not use in public_site, sales_deck, vault, Mux, or Supabase until recut and approval. |
| Amy Sheehy — Charity Model | 652730–669500ms | **Final, local-approved** | Short version. Staged file matches exactly, no re-cut needed. |
| Christine Bell — Adversity | 154868–177500ms | **Final, local-approved** | Stumble kept intentionally. Staged file matches exactly, no re-cut needed. |
| Christine Bell — Fractional Growing | 589082–602580ms | **Dropped** | Do not use for any purpose. File left in place (not deleted) since `review.html` references it by name and nothing about leaving it is harmful. |

## Batch status: closed

All 5 decisions are now locked in locally. Nothing remaining requires a Ford call to consider this round's local closure complete.

## What's still deliberately held (not part of this closure, not forgotten)

1. **Outsider Questions recut** - Gemini re-score was run after Ford approved the external check. It recommends a shorter end at 578500ms. Clip remains flagged do-not-use for public_site, sales_deck, vault, Mux, or Supabase until that candidate is cut and approved.
2. **Desktop outtake file** - confirmed to exist at `~/Desktop/cincy-voices-supercuts/clips/sb_Will_Phillips.mp4`, then deleted after Ford approved cleanup.

## What did not need any new cutting

3 of the 5 staged files (Charity Model, Adversity, Fractional Growing) already exactly matched their approved windows from the June 1 pass. Root Causes was the only clip that needed a new local cut this round (813000ms → 815120ms start, trimmed from the existing staged file, no new Mux pull). No staged .mp4 files were moved, renamed, or deleted — the superseded Root Causes file and the dropped Fractional Growing file were both left in place.

## Confirmation

No Mux upload, no Supabase write, no deploy/publish happened at any point in this closure. Gemini was run only after Ford approved that external check. The Desktop outtake file was deleted only after Ford approved cleanup.
