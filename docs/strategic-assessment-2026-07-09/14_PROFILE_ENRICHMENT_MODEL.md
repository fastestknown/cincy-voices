# Profile Enrichment Model

## What a robust fractional-leader profile should include

Based on the existing (undocumented) `leader-agent.ts` schema, which is already well-designed for this purpose:

- Career chapters / work history
- Industries worked in
- Specializations
- Working style
- Valuable situations (chaos, turnaround, scaling, etc.)
- Outcomes with metrics, where stated
- Unique differentiator
- Ideal client profile
- Availability / engagement model preference
- Bio (narrative)
- Intro snippet (one-liner for warm intros)
- `_meta`: confidence, flags, model, processing_time

To this, Cincy Voices evidence adds fields the standard 14-question intake doesn't reliably capture: voice and tone (how they actually talk, not how they describe themselves), specific stories/anecdotes with emotional texture, unscripted answers to "outsider" or challenging questions, and visible presence (how they come across on camera, relevant for sales/vault use, not for the written profile itself).

## Mapping Cincy Voices evidence into those fields

| Field | Cincy Voices source | Confidence pattern |
|---|---|---|
| Career chapters, industries | Transcript narrative, cross-check against markdown profile's "Origin Story" section | High if stated directly, medium if inferred from context |
| Differentiator | "What Makes [Name] Remarkable" section already exists in every markdown profile — this is pre-synthesized, not raw | High — already human-reviewed once in profile writing |
| Valuable situations | Transcript answers to interview questions, cross-referenced with topic-thread tagging (7 existing topics: trust-relationships, origin-stories, client-impact, culture-people, fractional-model, growth-change, collaboration) | Medium, requires extraction judgment |
| Outcomes with metrics | Only where explicitly stated in transcript — do not infer or round up | High only if a specific number is stated, otherwise omit rather than guess |
| Power quotes | `cincy_voices_quotes` table, 113 already extracted | High — already extracted and partially reviewed |
| Bio / intro snippet | Synthesize from profile + top quotes | Medium, always `pending_review` |

## Separating the four data categories

1. **Public profile facts** — things the leader has said publicly or would be comfortable seeing on a public profile page (career history, industries, general philosophy). Consent scope: public, once confirmed.
2. **Private relationship intelligence** — nuance useful to Ford/Jun internally (how this person tends to communicate, what they seemed uncertain about, relationship dynamics observed on camera). Never surfaces externally. Consent scope: internal only, no leader consent needed since it's not external-facing, but should never leak into a client-facing view (this is the same discipline as the participant-portal-safety pattern already in use elsewhere).
3. **WWM sales-use notes** — specific claims or proof points useful in a sales conversation (a strong outcome metric, a memorable quote answering a common objection). Consent scope: commercial use, requires explicit leader confirmation before use in an actual prospect conversation, not just general profile consent.
4. **Roebling demo-safe examples** — content approved specifically for demonstrating the product, internal or controlled prospect-facing only per the master prompt's instruction. Consent scope: separate from sales-use notes; a leader might be fine with their profile being used in a sales one-pager but not want their footage in a live product demo.

## Confidence, source, approval, consent fields (concrete schema, draft only)

Every extracted field carries: `confidence` (high/medium/low, following the existing `_meta.confidence` pattern), `source` (transcript ID + segment ID, so any claim is traceable back to what was actually said), `approval_status` (`pending_review` until Ford confirms, matching the existing business-profile pattern exactly), `consent_scope` (one of: internal / public / commercial / demo, per the four categories above).

## Comparison to the current WWM Platform profile agent contract, and the gaps

The current contract (`profile-agent-contract.md`, `01-profile-agent.md`) documents only the **business/buyer** side. The **leader** side exists in code (`leader-agent.ts`) but is undocumented as a formal contract, and has no field for source media type (assumes Fireflies text transcript), no provenance field distinguishing "live intake call" from "Cincy Voices interview," and no consent-scope field at all (the business side doesn't need one in the same way, since businesses aren't consenting to personal likeness use the way an individual leader is).

**Named gaps to close before Cincy Voices can safely feed this system:**
1. Formalize `leader-agent.ts` into a documented contract (parallel to the business-profile contract) — currently a documentation gap, not a code gap.
2. Add `source_type` and `source_transcript_ids` fields (drafted in `05_PRODUCT_AND_SOFTWARE_ARCHITECTURE.md`).
3. Add `consent_scope` at the leader-profile level, distinct from the general `pending_review` approval status — approval by Ford and consent by the leader are two different gates and should not be conflated into one status field.
4. Adapt the extraction prompt for Cincy Voices' interview format, which differs from the standard 14-question WWM intake structure.
