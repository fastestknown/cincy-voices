# Content Value Map

## Source content units → possible outputs

| Source unit | Current state | Possible outputs | Consent/approval needed |
|---|---|---|---|
| Raw footage (per leader, panel + 1:1) | Captured, ~17 people, stored/transcoded | Transcript, clips, B-roll, sales reels, editorial base material | Leader consent for any use beyond what was verbally agreed at filming; Ford approval for any external use |
| Transcript (AssemblyAI) | 15 sources fully transcribed | Enrichment input, quote source, profile-agent input (with adaptation) | None beyond original filming consent for internal use; Ford approval before any text is quoted externally |
| Quote (113 in Supabase) | Extracted, some review-flagged | Pull-quotes for site/editorial, social copy, sales one-liners, magazine pull-quotes | Ford approval always; leader review recommended for anything with their name attached publicly |
| Clip candidate (segments, 262 scoring ≥5) | Identified, partially Gemini-QA'd | Website clip, vault clip, social video, sales reel component, Roebling demo clip | Ford approval; leader consent flag needed per clip before public use (does not exist yet) |
| Article / editorial profile | 1 published (Kevin Lawson) | WWM blog, LinkedIn long-form, magazine feature draft | Ford approval + leader review before publish (leader is the subject) |
| Leader profile insight (career chapters, differentiators, ideal client) | Captured in 15 markdown profiles, not yet fed into WWM Platform | WWM Platform leader profile, Roebling demo-safe examples, sales proof points | Ford approval; leader profile insight is lower-risk than direct video/quote since it's synthesized, but attribution of specific claims should still be leader-reviewable |
| Sales proof point | Not yet formalized as a category | One-liner for proposals, case-study fragment, buyer objection-handling clip | Ford approval always; leader consent if directly attributed |
| Social post (LinkedIn) | Not yet produced from this content | Leader-tagged post, WWM-brand post, clip + caption | Ford approval + leader tag consent |
| Magazine feature | 2 prototype issues exist, not sourced from Cincy Voices footage | Long-form profile, "conversation" format piece | Ford approval + leader review, higher bar than a social post given permanence and print |
| Internal relationship intelligence | Partially captured via Open Brain embed of approved segments | Jun's memory of leader positioning, prior statements, relationship context for future outreach | Internal use only, no external consent needed, but should stay internal per the participant-portal-safety pattern |
| Leader collateral kit | Not yet built | Leader-owned one-pager or reel they can use in their own marketing | Ford approval + leader consent, this is the one output leaders directly benefit from and will most want |
| Event follow-up / referral nurture | Not yet built | Personalized thank-you + their-clip-is-ready email | Ford approval before send (Rule: draft approval required) |
| Roebling demo | Not yet built | Screen-recorded or scripted demo showing real leader content flowing into a profile | Internal/controlled use only, treat as external-facing if shown to prospects |

## Value ladder (low-effort reuse → high-value productized workflow)

**Rung 1 — Reuse what's already produced (near-zero new effort):**
- Finish sending vault magic links to leaders who already have staged clips.
- Publish 2-3 more editorial pieces from existing rich leader-profile markdown (14 more exist beyond Kevin Lawson).

**Rung 2 — Close the loop on staged work:**
- Resolve the 5 pending recut approvals, publish those clips to the leaders' vault pages and, once cleared, the public site.

**Rung 3 — Systematize one new consumer:**
- Feed the 15 leader markdown profiles into a first pass of WWM Platform leader-profile enrichment (manual bridge, not yet automated).

**Rung 4 — Productize the QA + approval loop:**
- Extend Gemini QA + staging to the remaining 5 leaders, but only after a consent field exists and the approval backlog habit is proven.

**Rung 5 — High-value productized workflows (do later, not now):**
- Automated leader collateral kit generator (clip + caption + one-pager, triggered by approval).
- Sales/buyer-education campaign library indexed by objection or industry.
- Magazine feature pipeline sourced from Cincy Voices transcripts.

## Consent/approval flags summary

Everything that leaves the internal system (public site, social, leader-owned kits, magazine, sales collateral shown to a prospect) requires **both** Ford's approval and a leader consent signal. Internal relationship intelligence and Roebling demos used only internally do not require leader consent but still require Ford's approval before any external-facing use. See `09_RISKS_CONSENT_AND_GOVERNANCE.md` for the minimum consent model, which does not currently exist in the schema.
