# Wake-Up Briefing — Cincy Voices, 2026-07-09

## The big decision

Cincy Voices is not a website problem. It's a media library with four real consumers (leader vault, WWM sales collateral, WWM Platform profile enrichment, and a possible future magazine slice) sitting behind an unfinished editorial QA loop. The decision in front of you isn't "what do we build next," it's **"do we finish closing the loop on what's already shot, or keep opening new fronts."** Close the loop first.

Three things are true at once: the pipeline works (transcription through Mux upload is proven on 15 sources), the editorial judgment layer is incomplete (only 3 of 8 leaders with clip candidates have been through Gemini QA and staging), and there are at least two live data bugs sitting in "approved" state right now. That last part is the actual emergency, not a strategy question.

## Do this in the next 7 days

1. Fix the shared placeholder `mux_playback_id` (dozens of segments, `quality_score=1`, `review_status=approved`) — someone or something marked test/seed data as approved. Find out if it's public-facing right now.
2. Fix the inverted-timestamp Amy Sheehy segment (`start_ms > end_ms`).
3. Make the five pending recut approvals (Will Phillips Root Causes + Outsider Questions, Amy Sheehy Charity Model, Christine Bell Adversity + Fractional Growing) and give the answers back so the June 1 batch can close. Details in `10_DECISION_LOG.md`.
4. Build the local `review.html`-successor approval flow described in `05_PRODUCT_AND_SOFTWARE_ARCHITECTURE.md` if the existing one isn't actually being used.
5. Confirm whether vault magic links were ever sent to any leader. If not, that's a small, high-value, zero-new-content task.

## Do not do yet

- Do not start Gemini QA or staging for the remaining 5 leaders (Carter Varn, Brennan Sweeney, Meredith Arlinghaus, Susannah Strydom, Ford) until the approval backlog above is clear.
- Do not build the magazine-to-Cincy-Voices pipeline. The contributor overlap is real (see `15_MAGAZINE_AND_EDITORIAL_PILOT.md`) but nobody has designed how footage becomes a magazine feature. Don't improvise it under time pressure.
- Do not expand public/leader-owned distribution (LinkedIn kits, more editorial posts) until a minimum consent field exists (`09_RISKS_CONSENT_AND_GOVERNANCE.md`).
- Do not write production Supabase migrations for the new schema proposed here. Draft only.

## Hard calls (5, full list of 10 in `10_DECISION_LOG.md`)

1. **Recut quality over volume.** Finish the QA+approval loop for the 3 leaders already in progress before touching the other 5.
2. **Profile enrichment beats magazine as the next big investment.** The WWM Platform leader-agent code path is closer to done than anyone building magazine tooling would be starting from scratch.
3. **Kill the shared-placeholder segments**, don't patch around them. If they're live on the site, that's a credibility risk with real leaders watching.
4. **The magazine does not need Cincy Voices right now.** Treat as a 2027 idea, not a current dependency.
5. **Ford approves content, not process.** Every SOP in this assessment routes yes/no decisions to Ford on finished drafts, never asks him to triage or route.

## First 7-day sprint (see `08_IMPLEMENTATION_ROADMAP.md` for full detail)

Day 1-2: data bug fixes + backlog approval decisions. Day 3-4: minimal local review page (if the existing `review.html` isn't sufficient) + vault link status check. Day 5: close June 1 recut batch, publish nothing new. Day 6-7: scope (not build) the leader-profile enrichment bridge to WWM Platform.

## Blockers / missing evidence

- Whether the shared placeholder segments are actually visible on the live public site (not checked this session, browser wasn't used).
- Whether vault magic links were sent (no confirmation doc found).
- Whether `review.html` was ever opened by Ford.
- Live Supabase state was not queried this session; all counts are from the May 29 audit doc.

## Statement

Nothing in this assessment was sent, published, deployed, uploaded to Mux, or written to production Supabase, HubSpot, or any public system. Everything is local docs, drafts, and proposals.
