# Decision Log

Each entry: decision, rationale, evidence, rejected alternative, reversibility.

## 1. Prioritize closing the existing approval backlog over starting any new recut work
- **Rationale:** 5 clips have sat pending Ford's decision since June 1 (5+ weeks). Starting new work while this queue is open compounds the backlog instead of proving the loop can close.
- **Evidence:** `recut-plan-2026-06-01.md` and `state-2026-06-01.md`, no newer state doc exists.
- **Rejected alternative:** Start fresh QA/staging on the remaining 5 leaders in parallel. Rejected because it multiplies open loops instead of closing one.
- **Reversibility:** Fully reversible, this is a sequencing choice not an irreversible action.

## 2. Fix the shared placeholder Mux ID bug before any other production work
- **Rationale:** Segments marked `review_status=approved` pointing at seed/test data (`mux_playback_id = HIvQHHLBGx...`, `clip_quality_score=1`) is a live risk if it's public — a leader could see broken content under their name.
- **Evidence:** `recut-plan-2026-06-01.md`, flagged as "dozens" of affected segments.
- **Rejected alternative:** Leave it, since the audit already flagged it and nothing broke visibly yet. Rejected — silent risk is still risk, and it's cheap to check.
- **Reversibility:** Fully reversible, this is a data correction.

## 3. Do not build a magazine-to-Cincy-Voices pipeline now
- **Rationale:** The overlap between magazine contributors and Cincy Voices subjects is real (6 of 7 issue-00 contributors also have Cincy Voices footage) but was never designed as a deliberate pipeline. Building it under assessment-driven momentum risks a rushed, unreviewed bridge between two projects that currently have independent quality bars.
- **Evidence:** `wwm-magazine-issue-00`, `magazine-strategy-report.md` — zero references to Cincy Voices anywhere in either.
- **Rejected alternative:** Build the bridge now, since the overlap looks obvious. Rejected — obvious overlap in subjects is not the same as a designed editorial workflow; see `15_MAGAZINE_AND_EDITORIAL_PILOT.md`.
- **Reversibility:** Fully reversible — nothing is lost by waiting, the footage isn't going anywhere.

## 4. Prioritize WWM Platform leader-profile enrichment as the top new-capability investment
- **Rationale:** The `leader-agent.ts` code path already exists and does structurally similar extraction from a different input format. This is the shortest distance from "footage exists" to "durable, reusable WWM asset."
- **Evidence:** `packages/workers/profile-agent/leader-agent.ts`, `leader-types.ts`, existing `/process/leader` endpoint, `pending_review` pattern already proven on the business-profile side.
- **Rejected alternative:** Prioritize the magazine or a new public website feature instead. Rejected — both require more net-new design work for less durable value.
- **Reversibility:** Fully reversible, this is additive (a new `source_type`), doesn't touch existing profile logic.

## 5. Treat Roebling demos as internal/controlled use only
- **Rationale:** Direct instruction from the master prompt; also consistent with the standing rule that client-facing deliverables require Ford's review and that no publish happens without explicit approval.
- **Evidence:** Master prompt language, Rule 101.
- **Rejected alternative:** Build a public-facing Roebling demo using Cincy Voices content now, to accelerate sales. Rejected — no consent model exists yet for this specific commercial use.
- **Reversibility:** Fully reversible, can be revisited once consent model exists.

## 6. Ford makes the 5 specific pending recut calls this week, not later
- **Rationale:** These are small, bounded decisions (keep/cut/pick-a-version) that have been open over a month. Bundling them into "someday" delays the entire downstream pipeline for 3 leaders.
- **Evidence:** `recut-plan-2026-06-01.md`, specific clips: Will Phillips Root Causes (needs fresh Gemini re-score, wrong time window originally scored), Will Phillips Outsider Questions, Amy Sheehy Charity Model (short vs. long cut), Christine Bell Adversity (keep the Bell's palsy stumble or not), Christine Bell Fractional Growing (recommend drop — all-7 scores, weakest of the batch).
- **Rejected alternative:** Auto-resolve using the Documentary Editor's recommendation without Ford's input. Rejected for the two sensitive/ambiguous ones (Adversity, and the dropped one); acceptable pattern for future similarly-scored batches once trust is established, not yet.
- **Reversibility:** Reversible up until public/Mux publish; the recommendation here is local-only cutting, no upload without a further explicit go.

## 7. Do not expand Gemini QA to the remaining 5 leaders until the current backlog is proven closeable
- **Rationale:** Demonstrating the loop can close for 3 leaders is more valuable right now than proving the QA tool works on more subjects — the tool already works, the bottleneck is downstream approval, not upstream QA coverage.
- **Evidence:** Pipeline inventory: 11 staged clips across 3 leaders, zero for the other 5 despite candidates existing.
- **Rejected alternative:** Run Gemini QA on all 8 in parallel for efficiency. Rejected — doesn't address the actual bottleneck (approval), just produces more unreviewed inventory.
- **Reversibility:** Fully reversible, just a sequencing call.

## 8. Adopt the May 29 audit's proposed `cincy_voices_moments` schema as-is rather than redesigning it
- **Rationale:** It already addresses the known gaps (consent status field, visual/emotional/buyer-persona tagging) that this assessment independently identified as necessary. Redesigning from scratch would be redundant.
- **Evidence:** `audit-2026-05-29.md`, lines ~495-555, full DDL included.
- **Rejected alternative:** Design a new schema from this assessment's own analysis. Rejected — no evidence the existing proposal is wrong, only that it wasn't yet applied.
- **Reversibility:** Fully reversible, still draft-only, not applied.

## 9. Treat the hardcoded Supabase anon key in `upload.mjs` as low-severity, log it, don't block on it
- **Rationale:** Anon keys are semi-public by Supabase's own design (row-level security is the actual control), so this is a hygiene issue worth fixing but not an active vulnerability requiring emergency action.
- **Evidence:** Pipeline inventory finding in `upload.mjs`.
- **Rejected alternative:** Treat as P0 security incident. Rejected — no evidence this key grants elevated access beyond what RLS policies already permit; still worth moving to env vars as routine cleanup.
- **Reversibility:** Fully reversible, straightforward fix whenever convenient.

## 10. Keep Ford's approval batched weekly, not per-item, once the backlog is cleared
- **Rationale:** The current system already over-relies on Ford as a per-item router (every clip, quote, and recut currently terminates at him individually). This doesn't scale and isn't necessary for most decisions once quality gates (Gemini QA, Documentary Editor escalation rules) are trusted.
- **Evidence:** Master prompt's own operating principle: "Ford should make high-value approval decisions. He should not be the router for every clip, caption, visual, post, and profile update."
- **Rejected alternative:** Keep the current per-item approval pattern since it's proven safe so far. Rejected — safe but not scalable, and the backlog itself (5+ weeks unresolved) is evidence the current pattern is already failing under its own weight.
- **Reversibility:** Fully reversible, an operating cadence choice, not an irreversible system change.
