# Board Packet — Cincy Voices

## Strategy

Cincy Voices is a proven video-to-Supabase-to-website pipeline sitting on real, valuable, under-used raw material: interview footage with 17 Cincinnati fractional leaders. The strategic opportunity is not "more content," it's converting existing footage into two specific durable assets — enriched WWM Platform leader profiles, and differentiated buyer-education/sales proof — while closing a five-week-old editorial approval backlog that's currently blocking everything downstream. The magazine is a legitimate future destination for this content but is deliberately deferred; pursuing it now would compound risk on top of an already-unproven publication.

## Capability gaps

The pipeline (transcription → enrichment → clip ID → Gemini QA → cutting → Mux upload) is proven end-to-end for 15 sources. The gap is entirely downstream: editorial judgment/approval throughput, a missing consent-tracking layer, two live data-integrity bugs sitting in "approved" state, and an unbuilt (but largely reusable) bridge into WWM Platform's existing leader-profile agent. No new core technology needs to be invented — every major gap closes with existing tools extended, not new systems built from scratch.

## Org model

Ten simulated specialist roles (Executive Producer, Documentary Editor, Content Strategist, Profile Intelligence Architect, Product Architect, Design Director, Distribution Lead, Operations Lead, Risk and Consent Lead, Financial Strategist) handle the full pipeline from clip QA through distribution. Ford's only recurring involvement is a weekly approval batch plus explicit sign-off on anything that touches consent, publishing, or a new external channel. He is not the router for individual clips, captions, or posts.

## First sprint (7 days)

Days 1-2: fix the shared placeholder Mux ID bug and the inverted-timestamp segment. Days 3-4: Ford resolves the 5-item recut approval backlog; stand up a lightweight weekly-batch review flow if the existing one isn't working. Day 5: close the June 1 recut batch locally (no uploads without a further explicit go). Days 6-7: scope (not build) the WWM Platform profile-enrichment bridge. No new content production in week one — this sprint is entirely cleanup and closure.

## Budget assumptions

No new headcount required through the 30-day mark; existing Claude-subagent roles plus Ford's approval time cover it. The first place a real budget line appears is Design Director work (visual templates) in the 90-day window, if professional-grade collateral becomes a priority — treat as a small contractor engagement, not a hire, until volume justifies more. The magazine, if ever revisited, already has its own separate budget assumption in the existing strategy report ($55-65K Year 1) and should not be conflated with Cincy Voices' own (near-zero incremental) budget needs.

## Success metrics

- Approval backlog reaches zero at least once (proves the loop can close).
- At least one enriched WWM Platform leader profile goes live from Cincy Voices evidence and gets used in an actual conversation.
- At least one sales collateral piece gets used in a real, live prospect conversation, not just produced as a demo.
- Zero known data-integrity bugs remain in "approved" state.
- A consent-status field exists and every one of the 17 leaders has a non-`unconfirmed` value within 30 days.

## Statement

Nothing in this assessment, or in the process of producing it, was sent, published, deployed, uploaded to Mux, or written to production Supabase, HubSpot, or any public system. All 17 documents in this folder are local planning artifacts.
