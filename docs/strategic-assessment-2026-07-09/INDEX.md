# Cincy Voices Strategic Assessment — Index

Prepared 2026-07-09. Acting as Fable 5 (CEO/operator mode) inside Claude Code, per `docs/fable5-strategic-assessment-prompt-2026-07-09.md`.

## Reading order

1. `00_WAKE_UP_BRIEFING.md` — read this first. One page, the decision, the 7-day plan, what not to do.
2. `01_STRATEGIC_ASSESSMENT.md` — what this actually is and where it can create value.
3. `02_CONTENT_VALUE_MAP.md` — every content unit, every possible output, consent/approval flags.
4. `03_OPERATIONAL_CAPABILITY_MAP.md` — every capability needed, owner, gap, priority.
5. `04_AGENT_ORG_CHART.md` — who does what without Ford routing every decision.
6. `05_PRODUCT_AND_SOFTWARE_ARCHITECTURE.md` — the software and schema.
7. `06_EDITORIAL_AND_DESIGN_SYSTEM.md` — standards for clips, copy, profiles, posts, collateral.
8. `07_DISTRIBUTION_AND_COMMERCIAL_USE_CASES.md` — 10+ concrete campaigns.
9. `08_IMPLEMENTATION_ROADMAP.md` — 7/30/90-day plan and backlog.
10. `09_RISKS_CONSENT_AND_GOVERNANCE.md` — consent model, this is load-bearing, read before shipping anything.
11. `10_DECISION_LOG.md` — the hard calls with rationale.
12. `11_BACKLOG.md` — assignable work items.
13. `12_EXECUTABLE_PROMPTS_AND_SOPS.md` — paste-ready prompts.
14. `13_BOARD_PACKET.md` — condensed version of all of the above.
15. `14_PROFILE_ENRICHMENT_MODEL.md` — the WWM Platform bridge.
16. `15_MAGAZINE_AND_EDITORIAL_PILOT.md` — should the magazine use this content.
17. `16_DAY1_LIVE_BUG_VERIFICATION.md` — live verification of the two P0 data bugs and the local direct-clip guard.

## What was inspected

Full reads or directory listings of: the Cincy Voices Next.js repo (`/Users/fordknowlton/cincy-voices`, app routes, components, lib, docs); all 6 named docs (audit, recut brief, vault plan/spec, recut plan, state doc); all 15 leader markdown profiles (sampled) and the 1 editorial piece; the jun-os pipeline scripts (`scripts/cincy-voices`, 17 scripts + prompts); pipeline data (`data/cincy-voices`: transcribe/, identify-clips/, gemini-checks/, recuts/staged/, playback_ids.json); pipeline logs; all 3 Cincy Voices Supabase migrations; the Desktop event overview and supercuts folder (~70 clips, 6 themed reels, 1 trailer); the magazine strategy report and both issue-00 prototypes; the wwm-platform repo, profile-agent contract and spec docs, and the actual `packages/workers/profile-agent` implementation including the undocumented leader-agent code path.

## What was not inspected

- The live Cincy Voices website in a browser (no visual QA of the deployed site was performed — this assessment is code/data/doc-based).
- Live Supabase data (no `execute_sql`/`list_tables` calls were made against production; all counts are as reported in `audit-2026-05-29.md`, not independently re-verified this session).
- HubSpot, Roebling, or WWM Platform live data.
- The 78-file `transcribe/` directory content in full (sampled via the pipeline-inventory agent's summary, not read file-by-file).
- Whether `review.html` (staged clip review UI, generated Jun 10) was ever actually opened and used by Ford.
- Whether the vault magic links were actually generated and sent to any of the 17 leaders in production.

## Open Brain status

**Unavailable this session.** No `open-brain` MCP tool was found via tool search (get_stats, brain_search, brain_capture all absent from the connected toolset). Per the master prompt's fallback instruction, this assessment proceeds entirely from local file evidence. This is a genuine limitation: the master prompt's stated Open Brain memory (mission statement, magazine framing, market context) was treated as background context, but no live semantic recall was performed. One finding worth noting: the pipeline's `embed-approved.sh` script already pushes approved segments/quotes into Open Brain via `jun-os.vercel.app/api/brain` — so some Cincy Voices content likely already lives in Open Brain, unverified this session.

## Final recommended path (10 bullets)

1. Stop treating Cincy Voices as a website feature backlog. Treat it as a media library with four live consumers: leader vault, WWM sales collateral, profile enrichment, and (later, selectively) the magazine.
2. Fix data integrity before anything else ships: the shared placeholder `mux_playback_id` marked `review_status=approved`, and the inverted-timestamp Amy Sheehy segment, are landmines sitting in "approved" state.
3. Close the loop on the 5 clips already staged and awaiting Ford's approval (Will Phillips x2, Amy Sheehy x1, Christine Bell x2) before starting any new recut work. Nothing new until this queue is empty.
4. Do not build the magazine pipeline around Cincy Voices yet. The overlap between magazine contributors and Cincy Voices subjects is real but was never designed as a pipeline — treat as v2, not now.
5. Prioritize WWM Platform leader-profile enrichment as the highest-value untapped path: the leader-agent code path already exists and is close to what Cincy Voices needs, closing the gap is design work, not a rebuild.
6. Build a minimal consent-tracking field before any leader-owned distribution or public clip use expands beyond what's already live.
7. Ford's only recurring job should be approval, not routing. Every workflow below routes to Ford for a yes/no on content he hasn't seen, never for triage.
8. Kill the "giant content factory" instinct. Ship 2-3 workflows well (clip QA + approval, leader profile enrichment, one distribution channel) before adding a fourth.
9. Roebling demos and buyer-education collateral are legitimate high-value paths but should stay internal/controlled use until a consent model exists.
10. The first 7-day sprint is entirely cleanup and closure: fix the two data bugs, clear the approval backlog, and stand up one lightweight local review tool. No new content production in week one.
