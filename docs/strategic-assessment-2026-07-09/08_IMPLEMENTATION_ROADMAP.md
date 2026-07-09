# Implementation Roadmap

## 7-day sprint (minimum useful system, closure not expansion)

**Day 1-2: Fix what's broken.**
- Identify and fix the shared placeholder `mux_playback_id` segments marked `review_status=approved` (confirm scope: how many segments, which leaders, is any of it live/public).
- Fix the inverted-timestamp Amy Sheehy segment.
- Confirm whether vault magic links were ever sent; if not, generate/send for leaders with staged/approved clips (Review gate: Ford).

**Day 3-4: Close the approval backlog.**
- Ford makes the 5 pending recut calls (Will Phillips Root Causes + Outsider Questions, Amy Sheehy Charity Model, Christine Bell Adversity + Fractional Growing) — decisions and rationale in `10_DECISION_LOG.md`.
- If `review.html` wasn't actually used, stand up the minimal local review flow (extend `review-queue.sh`, don't build a new app).

**Day 5: Close the June 1 batch.**
- Execute the approved recut decisions locally (cut/re-cut as needed). Do not upload to Mux or write to production Supabase without a separate, explicit go from Ford.

**Day 6-7: Scope the profile-enrichment bridge.**
- Draft the bridge script design (transcript → adapted leader-agent prompt → `pending_review` write) per `14_PROFILE_ENRICHMENT_MODEL.md`. Scope only — do not touch WWM Platform production code without Ford's explicit approval per its own governance.

## Minimum useful system

A closed loop for one leader, end to end: footage → transcript → enriched segments → Gemini-QA'd clips → staged → Ford approval → vault delivery to that leader → (optional) one enriched WWM Platform profile record. If this loop can run for one leader without Ford doing any editorial labor beyond approval, the system is minimally useful. Everything else is scale, not capability.

## Do not build yet

- Automated collateral/kit generator (needs design templates first, which don't exist).
- Magazine article pipeline.
- Public objection-handling reel (needs consent model first).
- Distribution planner/calendar tooling (manual/spreadsheet is sufficient at current volume).
- Gemini QA + staging for the 5 leaders not yet started (Carter Varn, Brennan Sweeney, Meredith Arlinghaus, Susannah Strydom, Ford) — wait until the approval habit is proven on the 3 already in motion.

## 30-day plan

- Consent field added to schema (draft reviewed, Ford approves, then applied — this is the one schema change worth prioritizing early because it unblocks everything else).
- Profile-enrichment bridge built and run for the 3 leaders with the most complete Cincy Voices evidence (Will Phillips, Amy Sheehy, Christine Bell — already furthest along in the pipeline).
- One sales collateral one-pager built and used in an actual live conversation, as a real test rather than a demo.
- 2 more editorial pieces published from existing rich leader profiles (14 more exist beyond Kevin Lawson).
- Gemini QA extended to the remaining 5 leaders, now that the approval loop is proven.

## 90-day plan

- Leader-owned content kits designed and delivered to at least 5 leaders.
- A buyer-education objection-handling reel built and tested with at least one prospect conversation.
- Full leader roster (17) has at least one enriched WWM Platform profile record.
- Revisit the magazine question with real evidence from the above (does leader-profile-enrichment work reveal anything worth a magazine feature, rather than starting from the footage cold).
- Decide whether a second Cincy Voices event is worth running, informed by what worked/didn't in this cycle.

## Staffing / agent-capability requirements

No new hires required for the 7/30-day work — Documentary Editor, Content Strategist, and Product Architect roles (Claude subagents or Ford wearing those hats) cover it. The 90-day plan's Design Director role (visual templates) is the first place a human designer or contractor may be worth bringing in, since template quality directly determines whether assets look professional rather than AI-generic.

## Software backlog (priority / effort / risk / dependencies)

| Item | Priority | Effort | Risk | Depends on |
|---|---|---|---|---|
| Fix shared placeholder segment bug | P0 | S | Low | none |
| Fix inverted-timestamp segment | P0 | S | Low | none |
| Consent schema fields (draft → apply) | P0 | S | Low | Ford approval |
| Close 5-item approval backlog | P0 | S | Low | Ford decisions |
| Confirm/send vault magic links | P1 | S | Low | none |
| Extend review-queue.sh for weekly batching | P1 | M | Low | none |
| Profile-enrichment bridge script | P0 | M | Medium | WWM Platform access, Ford approval |
| Gemini QA for remaining 5 leaders | P2 | M | Low | approval backlog closed first |
| Design templates (one-pager, social card) | P2 | M | Low | none |
| Collateral generator | P2 | M | Low | templates exist |
| Distribution planner | P3 | S | Low | none |
| Magazine bridge | P3, deferred | L | Medium | see `15_MAGAZINE_AND_EDITORIAL_PILOT.md` |

Effort: S = under a day, M = a few days, L = a week or more, at Ford-plus-agents pace.
