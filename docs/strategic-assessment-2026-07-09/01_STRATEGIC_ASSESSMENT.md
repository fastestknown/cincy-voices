# Strategic Assessment

## What Cincy Voices actually is

Cincy Voices is three things layered on top of each other, and the layers are at different stages of maturity:

1. **An event and a footage archive.** A Cincinnati fractional-leader event (panels + 1:1 interviews at Cincinnati Podcast Studio, ~20 attendees, $100/person economics per the planning doc) produced raw video for at least 17 named people. No confirmed event date exists in any local doc; the editing work is dated mid-April 2026.
2. **A production pipeline.** AssemblyAI transcription → Claude enrichment → Claude quote extraction → Claude clip identification → Gemini video QA → ffmpeg cutting → Mux upload → Supabase. This pipeline is real and has been run end-to-end for at least 15 sources. It is not vaporware.
3. **A Next.js website** (leader pages, topic "thread" pages, editorial, and a magic-link vault) that is built, deployed to Vercel, and structurally complete, sitting on top of the data the pipeline produces.

What it is *not*, yet: a finished editorial product. The gap between "pipeline produced 262 clips scoring ≥5" and "17 published, professional, leader-approved assets" is large. Only one editorial article exists. Only 11 clips have made it to staged-for-review status, covering 3 of 17 leaders.

## Why it matters to Work With Meaning

WWM's core asset is trust and relationship depth with fractional leaders and the SMBs who hire them. Cincy Voices is the only place in the WWM ecosystem where that trust is captured on video, in the leaders' own words, at some depth (individual 1:1 interviews plus panel discussion). That is rare raw material: sales collateral, magazine features, and profile enrichment all compete for corporate content budgets normally spent on stock footage and copywriter guesswork. WWM already has the real thing, unedited, sitting in a Supabase table.

The strategic fit is strongest in two places the master prompt correctly flags: **profile enrichment** (video captures judgment, voice, and positioning that a text intake form never will) and **buyer education / sales collateral** (a company considering a fractional leader for the first time trusts a real interview far more than a bio page).

## Where it can create value

Ranked by evidence-backed leverage, not by novelty:

1. **WWM Platform leader-profile enrichment.** The `leader-agent.ts` code path already exists, already extracts the same categories of information (career chapters, differentiators, ideal client, valuable situations) that a Cincy Voices interview naturally surfaces. This is the shortest path from footage to a durable, reusable WWM asset.
2. **Leader vault + leader-owned content kits.** The vault is built. Closing the loop (send links, confirm leaders received them, package a few clips each) is nearly free relative to net-new production.
3. **Sales / buyer-education collateral.** Companies evaluating fractional leadership want proof, not more thought leadership. A short reel of real leaders answering real objections is a differentiated asset almost nobody else in this market has.
4. **Website / editorial polish.** Real, but lower leverage than the above three — it's a content marketing play in a crowded channel (LinkedIn, blog posts), not a differentiated one.
5. **Magazine material.** Plausible later, not now (see `15_MAGAZINE_AND_EDITORIAL_PILOT.md`).
6. **Roebling demos.** Legitimate, but internal/controlled use only until a consent model exists.

## Where it is currently blocked

- **Editorial judgment is the bottleneck, not the pipeline.** The pipeline over-produces (561 segments) relative to what's been reviewed (11 staged, 1 published). More automation of clip *selection* won't fix this; automation of clip *quality gating* (Gemini) already helps, but a human still has to say yes.
- **Data integrity bugs are sitting in "approved" state.** This is not a philosophical blocker, it's an operational one that has to be fixed before anything ships wider.
- **No consent-tracking field exists anywhere in the schema.** This blocks any expansion of public or leader-owned distribution beyond what leaders have implicitly already agreed to by being filmed.
- **Ford is currently the only reviewer.** Every gate in the pipeline (clip approval, quote approval, recut approval) currently terminates at Ford. That's correct for reputation-affecting decisions, wrong for volume — see `04_AGENT_ORG_CHART.md`.

## What would make it an operating asset rather than a creative side project

Three conditions, in order: (1) the approval backlog reaches zero at least once, proving the loop can close; (2) at least one non-website consumer (profile enrichment or sales collateral) goes live and gets used in an actual deal or conversation; (3) a repeatable cadence exists (e.g., "one leader's assets fully produced per week") that doesn't require Ford to personally cut, score, or select anything, only approve finished drafts. Right now none of the three are true. All three are achievable within 30 days if the 7-day sprint in `00_WAKE_UP_BRIEFING.md` is completed first.
