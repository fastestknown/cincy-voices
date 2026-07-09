# Backlog

Grouped by category. Each item assignable to an agent role or to Ford directly.

## Docs
- [ ] Write a new `state-2026-07-XX.md` once the 7-day sprint closes, replacing the stale June 1 doc as the canonical current-state reference. — Owner: Operations Lead
- [ ] Document the leader-agent.ts code path formally in `wwm-platform/docs/AI/` (currently exists only in code, undocumented as a contract). — Owner: Profile Intelligence Architect

## Data
- [x] ~~Investigate and fix the shared placeholder `mux_playback_id` segments (`review_status=approved`, `clip_quality_score=1`). Confirm scope and whether any are public-facing.~~ — **Resolved 2026-07-09.** Scope confirmed at 3 rows (not "dozens"). Not exposed on public leader pages (score-filtered), but was reachable via direct `/vault/[slug]/clip/[segmentId]` URLs (HTTP 200) before a code guard. Ford approved a production Supabase write (`mux_playback_id=null`, `clip_candidate=false`, `review_status='needs_review'`) and a production deploy (commit `b8dca12`, live on `voices.workwithmean.ing`). Post-deploy verification: affected URLs now return 404. Full detail in `16_DAY1_LIVE_BUG_VERIFICATION.md`. — Owner: Product Architect
- [x] ~~Fix the inverted-timestamp Amy Sheehy segment (`start_ms > end_ms`).~~ — **Resolved 2026-07-09.** Affected row: `f79c1039-3518-44de-872b-4de9bcf0b0fc` (Amy Sheehy, source `4a4c3945-b700-437e-91e6-0d1024d5ae18`). Was a production Supabase data issue, not just a docs/local artifact — same standalone-clip-URL exposure risk as the placeholder rows above. Ford approved the same write pass: corrected to `start_time_ms=602540, end_time_ms=619080, trim_start_ms=602540, trim_end_ms=619080, review_status='needs_review'`. Included in the same `b8dca12` deploy; post-deploy URL check confirms the corrected trim values render. Full detail in `16_DAY1_LIVE_BUG_VERIFICATION.md`.
- [ ] Draft (not apply) the consent-field migration from `05_PRODUCT_AND_SOFTWARE_ARCHITECTURE.md`. — Owner: Product Architect
- [ ] Draft (not apply) the `source_type`/`source_transcript_ids` addition to WWM Platform `leaders` table. — Owner: Profile Intelligence Architect
- [ ] Move the hardcoded Supabase anon key in `upload.mjs` to an env var. — Owner: Product Architect

## Product
- [ ] Extend `review-queue.sh` with a `consent_status` filter and weekly-batch export mode. — Owner: Product Architect
- [x] ~~Confirm whether `review.html` was ever opened/used; if not, rebuild as a simpler weekly-batch view rather than a one-off static page.~~ - **Scoped 2026-07-09.** The successor should be a local review packet workflow, not a production admin surface. See `22_REVIEW_FLOW_SUCCESSOR_SPEC_2026-07-09.md`. Next build step: create `docs/review-packets/YYYY-MM-DD/<packet_id>.json`, a static HTML review page, and a local decision export. No Supabase, Mux, deploy, publish, or outbound action is part of the review page itself. Owner: Product Architect
- [ ] Build the first local review packet from `22_REVIEW_FLOW_SUCCESSOR_SPEC_2026-07-09.md` using either a historical-test packet or the next genuinely pending 3-5 item batch after consent status is checked. Owner: Product Architect + Operations Lead + Risk and Consent Lead
- [ ] Build the Cincy-Voices-to-leader-agent bridge script (scope in week 1, build in the 30-day window). — Owner: Product Architect + Profile Intelligence Architect

## Automation
- [ ] Document an auto-reject / escalate / auto-stage threshold for `gemini-check.py` output so Documentary Editor doesn't manually eyeball every score. — Owner: Documentary Editor
- [ ] Confirm `embed-approved.sh`'s Open Brain push is still working (no verification performed this session). — Owner: Product Architect

## Editorial
- [x] ~~Ford resolves the 5 pending recut decisions (see `10_DECISION_LOG.md` #6).~~ — **Resolved 2026-07-09.** All 5 closed: Root Causes, Outsider Questions, Charity Model, and Adversity final/local-approved; Fractional Growing dropped. Detail in `17_RECUT_APPROVAL_SHEET.md` and `18_JUNE1_BATCH_CLOSURE_2026-07-09.md`. Local-approval only — none marked public/sales/vault/Mux/Supabase-ready. — Owner: Ford
- [ ] Draft 2 more editorial pieces from existing rich leader profiles (candidates: any of the 14 beyond Kevin Lawson with strong "Power Quotes" sections). — Owner: Content Strategist
- [ ] Write the clip auto-reject/escalate rubric into a reusable prompt addendum for `gemini-check.py`. — Owner: Documentary Editor

## Design
- [ ] Design the leader one-pager template. — Owner: Design Director
- [ ] Design the social clip card template (reuse existing `quote-mosaic` visual language). — Owner: Design Director
- [ ] Confirm whether Mux auto-generated thumbnails are usable as-is or need a manual best-frame pick per clip. — Owner: Design Director

## Video
- [x] ~~Execute Ford's 5 recut decisions locally (no Mux/Supabase writes without a further explicit go).~~ — **Resolved 2026-07-09.** All 5 cut/finalized locally, no Mux or Supabase writes made for any of them. See `18_JUNE1_BATCH_CLOSURE_2026-07-09.md`. — Owner: Documentary Editor + Product Architect
- [ ] Extend Gemini QA coverage to the remaining 5 leaders (Carter Varn, Brennan Sweeney, Meredith Arlinghaus, Susannah Strydom, Ford) — only after the current backlog closes. — Owner: Documentary Editor

## Profile enrichment
- [ ] Scope the profile-enrichment bridge (input mapping, prompt adaptation, output field mapping) — Owner: Profile Intelligence Architect
- [ ] Run the bridge (once built) for Will Phillips, Amy Sheehy, Christine Bell first (furthest-along leaders). — Owner: Profile Intelligence Architect
- [ ] Ford reviews and approves the first 3 resulting profile drafts. — Owner: Ford

## Distribution
- [ ] Confirm whether vault magic links were ever sent to any leader; send for those with approved clips if not. — Owner: Operations Lead
- [ ] Draft one sales collateral one-pager and use it in a real, live prospect conversation as a test. — Owner: Content Strategist + Ford

## Governance
- [ ] Ford makes a one-time consent-status pass across all 17 leaders: what do we actually know they agreed to. — Owner: Risk and Consent Lead + Ford
- [ ] Decide (Ford, explicit) whether the magazine bridge is worth revisiting after the 90-day mark. — Owner: Ford
