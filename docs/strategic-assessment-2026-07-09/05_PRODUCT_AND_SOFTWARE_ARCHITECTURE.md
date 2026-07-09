# Product and Software Architecture

No production migrations are written here. Everything below is draft SQL and proposal only, per the master prompt's hard gate.

## Existing architecture (confirmed)

- Cincy Voices: Next.js 14 App Router, Vercel-deployed, Supabase-backed, Mux for video. Core tables (from the 3 existing migrations): `cincy_voices_leaders`, `cincy_voices_sources`, `cincy_voices_source_participants`, `cincy_voices_segments`, `cincy_voices_quotes`, `cincy_voices_topics`, `cincy_voices_thread_items`.
- Pipeline scripts in `jun-os/scripts/cincy-voices`: transcribe → enrich → extract-quotes → identify-clips → gemini-check (QA) → cut-clip → upload (Mux) → embed-approved (Open Brain).
- `review-queue.sh` already provides a CLI review/approval mechanism; `review.html` is a generated static review page (last touched Jun 10).
- WWM Platform: separate monorepo, Clerk + Supabase + Railway workers, existing `leader-agent.ts` code path for text-transcript-based leader profile extraction, writes to a `leaders` table with `pending_review` status.

## Tools that should exist

### Content inventory model
A single view (not a new system) joining `cincy_voices_leaders` → `sources` → `segments` → `quotes`, exposing per-leader status: sources ingested, segments enriched, clips identified, Gemini-QA'd, staged, approved, published, and — new — consent status. This is a reporting layer, not new infrastructure. Build as a Supabase view or a small script, not a new app.

### Moment catalog
The May 29 audit's proposed `cincy_voices_moments` table (already drafted with full DDL in that doc) separating curated, QA-passed "moments" from raw transcript "segments." Recommend adopting this as-is rather than re-designing it — it already accounts for visual/emotional/buyer-persona tagging and consent status. Draft reference only, do not apply.

### Approval queue
Extend `review-queue.sh` rather than replace it. Add a `consent_status` filter and a weekly-batch export mode (so Operations Lead can hand Ford one list instead of a live queue). This directly supports the "Ford approves batches, not items" operating model in `04_AGENT_ORG_CHART.md`.

### Asset generator
New, small: given an approved segment + quote + leader profile, generate a draft LinkedIn caption, a draft one-pager text block, and a thumbnail candidate list (from Mux-generated frame thumbnails). Output goes to a `drafts/` folder for Content Strategist / Design Director review, never auto-publishes.

### Leader profile enrichment workflow
New bridge script: reads a Cincy Voices leader's transcript + enriched segments + markdown profile, calls the *existing* `leader-agent.ts` extraction logic (or a close variant of its prompt) with a Cincy-Voices-shaped input, writes output to WWM Platform's `leaders` table at `pending_review`, tagged with `source_type = 'cincy_voices'`. See `14_PROFILE_ENRICHMENT_MODEL.md` for the field-level detail.

### Clip QA workflow
Already exists (`gemini-check.py`). Recommend only two additions: (1) a documented auto-reject threshold so Documentary Editor doesn't have to eyeball every score, (2) coverage for all 8 leaders with candidates, gated behind the 7-day sprint's approval-backlog cleanup.

### Collateral generator
New, later (P2). A template-merge tool: leader profile + approved quote + approved clip → one-pager or sales-deck slide. Depends on Design Director producing templates first; do not build the generator before the templates exist.

### Magazine article pipeline
Not recommended now. See `15_MAGAZINE_AND_EDITORIAL_PILOT.md`.

### Distribution planner
New, later (P2). A simple calendar/queue mapping approved assets to planned distribution moments (LinkedIn post date, sales deck inclusion, vault delivery). Manual/spreadsheet-equivalent is fine at this scale; don't over-build.

## Proposed schema extensions (draft only, not applied)

```sql
-- DRAFT ONLY — do not apply. Consent tracking, minimum viable version.
-- Proposed addition to cincy_voices_segments and cincy_voices_leaders.

alter table cincy_voices_leaders
  add column consent_status text not null default 'unconfirmed'
    check (consent_status in ('unconfirmed', 'verbal_at_filming', 'written', 'declined', 'revoked')),
  add column consent_notes text,
  add column consent_updated_at timestamptz;

alter table cincy_voices_segments
  add column public_use_approved boolean not null default false,
  add column leader_use_approved boolean not null default false,
  add column consent_scope text; -- e.g. 'internal_only' | 'website' | 'social' | 'sales_collateral' | 'magazine'
```

```sql
-- DRAFT ONLY — do not apply. WWM Platform side: provenance for leader profiles
-- sourced from something other than a live Fireflies intake call.

alter table leaders
  add column source_type text default 'fireflies_intake'
    check (source_type in ('fireflies_intake', 'cincy_voices', 'manual')),
  add column source_transcript_ids text[],
  add column source_confidence text; -- inherits from existing _meta.confidence pattern
```

## Buyer-profile fields vs. fractional-leader-profile fields (explicit distinction)

The existing `profile-agent-contract.md` and `01-profile-agent.md` describe **buyer/company** profiles: company basics, contacts, goals, pain points, needs, fit/priority score. These live in `businesses` / `business_profiles`.

The **fractional-leader** profile (already coded in `leader-agent.ts` but undocumented) is a distinct shape: career chapters, industries, specializations, working style, valuable situations, outcomes with metrics, differentiator, ideal client profile, availability, bio, intro snippet. These live in `leaders`.

Cincy Voices only ever feeds the second shape. It has no bearing on buyer/company profiles. Any integration work should touch `leader-agent.ts` and the `leaders` table exclusively — do not conflate the two paths.

## Relation to existing Cincy Voices and WWM Platform code

- No changes are proposed to Cincy Voices' public-facing schema beyond the consent fields above.
- No changes are proposed to the WWM Platform business-profile agent.
- The only new code path is a bridge: Cincy-Voices-transcript → adapted prompt → existing `leader-agent.ts` extraction function → `leaders` table write at `pending_review`. This reuses, rather than duplicates, existing infrastructure.
