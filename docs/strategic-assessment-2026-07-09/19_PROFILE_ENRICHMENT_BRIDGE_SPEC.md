# Cincy Voices → WWM Platform Profile Enrichment Bridge — Design Spec

Design/spec pass only. No production code written, no bridge run, no writes to WWM Platform, Supabase, HubSpot, or Open Brain, no content sent to any external API. Everything below is architecture and design, meant to unblock a scoped implementation approval later.

## Addendum - 2026-07-09 Follow-up Scope Checks

Two follow-up checks were completed after this spec was first written:

1. `/process-leader` scope check in the WWM Platform repo: `leaders.approval_status` does exist, and there are existing operator approve/reject routes. The remaining risk is still real, but narrower: `/process-leader` mutates live `leaders` profile fields before review because there is no separate draft/versioned leader profile table. See `/Users/fordknowlton/wwm-platform/docs/process-leader-review-gate-scope-2026-07-09.md`.
2. Consent-source check in Google Drive: `FLA_Cincy_Voices_Complete_Catalogue.docx` says original consent was for WWM Marketing and Atlas use requires re-consent. The actual underlying release/form text was not found in this pass, so §5 remains a proposed default mapping and cannot be treated as validated consent language. See `21_CV_CONSENT_SOURCE_AUDIT_2026-07-09.md`.

These checks do not change the locked direction in §0: Cincy Voices profile enrichment should land in a draft table, avoid direct `leaders` writes, keep Ford review separate from leader consent, and use manual linking for v1.

**Correction to prior assumption:** `14_PROFILE_ENRICHMENT_MODEL.md` and `05_PRODUCT_AND_SOFTWARE_ARCHITECTURE.md` both assumed the leader side already has a `pending_review` gate "matching the existing business-profile pattern exactly." Having now read the actual deployed code, **that's not true.** The business side has it; the leader side does not. This changes the risk picture — see §5 and §7.

**Status (2026-07-09):** The missing leader `pending_review` gate is the main blocker before any build. Ford has made the 6 design decisions below (§0). This remains a design/spec document — nothing has been built, run, or written to any system as a result of these decisions.

---

## 0. Locked decisions (Ford, 2026-07-09)

1. **Target contract:** the actually-deployed richer path in `src/index.ts` (`LEADER_PROFILE_SYSTEM_PROMPT` / `LeaderExtractionOutput`), not the older `leader-agent.ts`. Revisit only if implementation review later proves the richer path too risky to adapt.
2. **No direct writes to `leaders`.** Cincy Voices output never lands in the live table, under any status.
3. **Draft landing zone:** a new, separate review table — `leader_profile_drafts` or equivalent — carrying `approval_status`, `source_type`, `source_ids`, provenance, `confidence`, `consent_scope`, and `reviewed_by`/`reviewed_at`. This supersedes the more open-ended §6/§8 phrasing below ("a new table or local/file-based") — the table is now the committed direction, naming TBD at build time.
4. **Ford review and leader consent are separate gates, explicitly.** Ford approving a field (e.g. internal profile intelligence) is not the same act as a leader consenting to public/commercial/demo use. Public, commercial, and demo `consent_scope` values require consent language mapped against the **actual Cincy Voices consent form** — not inferred or assumed from this spec's §5 table, which is a proposed default only until checked against real form language.
5. **Manual leader linking for v1.** No auto-match writes — `wwm_leader_id` is set by a human every time, full stop. This resolves the §8 open question in favor of the more conservative option.
6. **The `/process-leader` direct-write gap is flagged, not fixed, in this pass.** See the companion risk note (§9) below. It's a pre-existing WWM Platform risk independent of Cincy Voices; fixing it is out of scope here.

---

## 1. Current leader-agent contract summary

There are **two separate leader-extraction implementations** in the WWM Platform repo, not one:

**A. `packages/workers/profile-agent/leader-agent.ts` + `leader-types.ts`** (the file the task named)
- Simple, single-purpose: `extractLeaderProfile(input: LeaderProfileInput): Promise<LeaderProfileOutput>`.
- Input: `{ transcript_id, transcript_text, interviewee_name?, interviewee_email?, interview_date }` (`leader-types.ts:4-19`).
- Output: flat profile object — work history, industries, specializations, working style, valuable situations, outcomes, differentiator, ideal client profile, availability, bio, intro snippet, plus `_meta.confidence` (`leader-types.ts:35-98`).
- Wired to the **root** `index.ts`'s raw-HTTP router at `/process/leader` (`index.ts:473`), which is the `dev`/`start:bun` entrypoint, not what Railway actually deploys.

**B. `packages/workers/profile-agent/src/index.ts`'s `/process-leader` Express route** (`src/index.ts:809-993`)
- This is the **actually-deployed** contract — confirmed via `Dockerfile` (`CMD ["bun", "run", "src/index.ts"]`) and `railway.toml`.
- Input schema `ProcessLeaderTranscriptSchema` (`src/index.ts:50-59`): `{ leader_id?, transcript_text, transcript_type: 'intro_call'|'intake'|'check_in'|'referral_discussion'|'client_update'|'networking'|'other', conversation_date?, participants?, duration_minutes?, external_id?, source: 'fireflies'|'manual'|'email'|'other' }`.
- Uses a richer system prompt, `LEADER_PROFILE_SYSTEM_PROMPT` (`src/index.ts:373-479`), tuned specifically to Ford's own intake-call style ("Ford Knowlton conducts these conversations with a warm, relational style...") — it expects a Ford-led 1:1 conversation, not a documentary-style interview.
- Output type `LeaderExtractionOutput` (`src/index.ts:345-367`): richer than variant A — adds `key_insights` (with verbatim quotes and confidence per insight), `summary`, per-category `confidence_scores` (identity/professional/credibility/personal), `flags` (field/issue/suggestion), `fields_extracted`, and personal-life fields (`family`, `interests`, `location`, `timezone`) that variant A doesn't have.
- **Writes directly to the live `leaders` table** (`src/index.ts:892-934`) — no draft/versioned table, no approval gate. Also inserts a row into `leader_transcripts` (`src/index.ts:936-958`) storing the raw transcript, summary, and key insights.

**leaders table schema** (`supabase/migrations/20241128000000_initial_schema.sql`, `CREATE TABLE leaders`): `id, user_id, full_name, email, title, specializations, industries, experience_years, values, working_style, bio, linkedin_url, availability_status, hours_per_week_available, do_not_match, match_vector, is_deleted, created_at, updated_at`. **No `approval_status`, `source_type`, or `consent_*` columns exist on this table today.**

For contrast, `business_profiles` (same migration file, lines ~55-91) is a **separate, versioned** table from `businesses` with `approval_status TEXT DEFAULT 'draft' CHECK (... IN ('draft','pending_review','approved','rejected'))` and `is_current`/`version` columns — and `/process-business` (`src/index.ts:1103-1129`) writes new profile versions there at `pending_review`, only flipping `businesses` fields once a human approves. **The leader path has no equivalent of `business_profiles`.** This is the real gap, not a documentation gap.

`docs/AI/profile-agent-contract.md` and `docs/AgentSpecs/01-profile-agent.md` (392 + 253 lines) document the business contract in full; neither mentions `leaders` or the leader extraction path anywhere. The leader contract is genuinely undocumented, confirming `14_PROFILE_ENRICHMENT_MODEL.md`'s original claim on that point.

---

## 2. Exact gaps for Cincy Voices input

1. **No review/staging table for leaders.** `/process-leader` writes straight to the live `leaders` record. Feeding Cincy Voices transcripts through this path today would silently overwrite a real leader's live `bio`, `title`, `working_style`, etc. with unreviewed AI output the moment the endpoint is called. This is the single largest risk, independent of Cincy Voices — it's a pre-existing production gap this bridge would otherwise inherit and amplify.
2. **No `source_type` column** on `leaders` or `leader_transcripts` to distinguish a Cincy Voices documentary interview from a live Ford intake call. `transcript_type` on `leader_transcripts` (`fireflies|manual|email|other`... actually `source` enum) has no `cincy_voices` value.
3. **No `consent_scope` or `consent_status` field anywhere in WWM Platform.** Approval (Ford reviewed and confirmed it's accurate) and consent (the leader agreed to this specific use) are conflated into nothing at all right now — there's no field for either on `leaders`.
4. **Prompt mismatch.** `LEADER_PROFILE_SYSTEM_PROMPT` is written for Ford's own 1:1 intake calls (`transcript_type: intro_call|intake|check_in|...`) and expects Ford's specific 14-question structure. Cincy Voices is a third-party documentary interview with different questions, an interviewer who isn't Ford, and often panel/multi-speaker audio — the prompt's framing ("Ford Knowlton conducts these conversations...") is simply wrong for this input and would bias the extraction if used unmodified.
5. **No field for footage-specific evidence.** Neither leader-agent variant has a slot for "voice/tone as it actually sounds," "verbatim story with emotional texture," or "answer to an unscripted/challenging question" — the categories `14_PROFILE_ENRICHMENT_MODEL.md` correctly identified as Cincy Voices' unique contribution over a standard intake call.
6. **No provenance trace back to segment/quote level.** `leader_transcripts.raw_text` stores the full transcript, but nothing traces an individual extracted claim back to the specific `cincy_voices_segments` row or `cincy_voices_quotes` row it came from.

---

## 3. Proposed input format from Cincy Voices transcript/profile/quote data

A new input shape, `CincyVoicesLeaderInput`, distinct from `ProcessLeaderTranscriptSchema` (it should *not* reuse that schema, since the two source types have materially different provenance and consent needs):

```ts
interface CincyVoicesLeaderInput {
  cincy_voices_leader_id: string        // FK into cincy_voices_leaders, not a WWM leaders.id
  wwm_leader_id?: string                // set only if a human has already matched this person to an existing WWM leader record
  full_name: string
  source_type: 'cincy_voices'           // literal, always this value for this path

  // Raw evidence, not a single flat transcript blob:
  transcript_segments: Array<{
    segment_id: string                  // FK into cincy_voices_segments
    text: string
    start_ms: number
    end_ms: number
    topic_tags?: string[]               // the 7 existing topic threads, if tagged
    review_status: string               // must be 'approved', never pull 'rejected' or placeholder rows (see 16_DAY1_LIVE_BUG_VERIFICATION.md)
  }>
  power_quotes: Array<{
    quote_id: string                     // FK into cincy_voices_quotes
    text: string
    segment_id: string
  }>
  markdown_profile_excerpt?: {
    origin_story?: string
    what_makes_them_remarkable?: string  // pre-synthesized differentiator, already human-reviewed once
  }
  interview_date: string                // ISO 8601
  consent_status: 'unconfirmed' | 'verbal_at_filming' | 'written' | 'declined' | 'revoked'  // read from Cincy Voices' own schema (see 05_PRODUCT_AND_SOFTWARE_ARCHITECTURE.md consent DDL), never inferred
}
```

Design notes:
- Segment-level input (not one flattened transcript string) so every extracted claim can carry a `source_segment_id` in the output — this is what closes gap §2.6.
- `consent_status` is read, not written, by this bridge — Cincy Voices already owns that field per the draft `cincy_voices_moments` schema (05, lines 48-50). The bridge must refuse to process (or must mark output `consent_scope: 'internal_only'` regardless of extraction) for any leader whose `consent_status` is `unconfirmed`, `declined`, or `revoked`.
- Only `review_status = 'approved'` segments should ever be included — this directly reuses the same gate the recut backlog work just closed (`18_JUNE1_BATCH_CLOSURE_2026-07-09.md`), so a rejected/placeholder segment can never leak into a profile.

---

## 4. Proposed output format

`CincyVoicesLeaderProfileDraft` — deliberately **not** `LeaderExtractionOutput`, and deliberately never written directly to `leaders`. This is the row shape for `leader_profile_drafts` (§0.3):

```ts
interface CincyVoicesLeaderProfileDraft {
  cincy_voices_leader_id: string
  wwm_leader_id: string | null          // null until a human links it manually (§0.5) — never auto-set
  source_type: 'cincy_voices'
  source_ids: string[]                  // segment_ids + quote_ids used, for traceability
  extracted_at: string                  // ISO 8601
  model: string

  fields: {
    [fieldName: string]: {
      value: unknown
      confidence: 'high' | 'medium' | 'low'
      source_segment_id: string | null  // null only for synthesized fields like bio/intro_snippet that blend multiple segments
      approval_status: 'pending_review'   // always this value at creation; nothing here writes 'approved' itself
      consent_scope: 'internal' | 'public' | 'commercial' | 'demo'   // per-field, not one blanket value — see §5
    }
  }

  reviewed_by: string | null            // set only when Ford reviews (approval gate — §0.4)
  reviewed_at: string | null            // consent is tracked separately, in Cincy Voices' own schema, never here

  flags: Array<{ field: string; issue: string }>
  overall_confidence: number
}
```

Why per-field `consent_scope` and `approval_status` rather than one top-level pair: a single leader's draft profile will legitimately mix categories — e.g. `industries` might be `public` once Ford approves it, while `family` or an off-camera aside captured on tape stays `internal` forever, regardless of Ford's review. Collapsing that into one profile-level status would force an all-or-nothing publish decision that doesn't match how this content actually needs to be gated.

---

## 5. Internal-only vs public/profile-safe vs commercial/demo-gated

Following the four-category split already established in `14_PROFILE_ENRICHMENT_MODEL.md §"Separating the four data categories"`, mapped onto the concrete fields above:

| Category | `consent_scope` value | Example fields | Gate to publish |
|---|---|---|---|
| Public profile facts | `public` | career chapters, industries, specializations, general philosophy, differentiator (if sourced from the already-reviewed "What Makes Remarkable" section) | Ford approval + leader consent confirmed `written` or `verbal_at_filming` |
| Private relationship intelligence | `internal` | communication style observed on camera, uncertainty/hesitation noted, relationship dynamics, anything from `flags` | **Never** promotable to public/commercial/demo scope by this bridge under any circumstance — no UI path should exist to change this value for these fields |
| WWM sales-use notes | `commercial` | specific outcome metrics, objection-handling quotes | Ford approval + leader's **explicit** confirmation for commercial use specifically (distinct from general profile consent) |
| Roebling demo-safe examples | `demo` | curated clips/quotes cleared for product demonstration | Separate leader sign-off from `commercial` — a leader may allow a sales one-pager but not a live product demo |

This table itself is the enforcement spec for §7 below — the field/category mapping must be hardcoded at extraction time, not left to the model to decide per-field, since an LLM asked to freely assign consent scope will be inconsistent and is the wrong place to put a safety boundary.

---

## 6. Minimal script design

A single offline script, not a service: `cincy-voices-to-wwm-bridge.ts` (name only, not written).

```
1. Load CincyVoicesLeaderInput for one leader
   - Pull approved segments + quotes from Cincy Voices Supabase (read-only)
   - Pull consent_status; abort if unconfirmed/declined/revoked
2. Build the adapted extraction prompt
   - Base: LEADER_PROFILE_SYSTEM_PROMPT, with the Ford-intake framing
     replaced by a Cincy-Voices-appropriate framing (documentary interview,
     third-party interviewer, may include panel/multi-speaker segments)
   - Inject segment_id markers inline in the transcript text sent to the
     model, so returned claims can be matched back to a segment_id in
     post-processing (the model cannot be trusted to echo IDs precisely
     unprompted, so this needs a light regex/text-match reconciliation step
     after the response, not a fully model-owned mapping)
3. Call Claude (Anthropic API) — THIS is the one step that is a real
   external send; not executed in this design pass
4. Parse response into CincyVoicesLeaderProfileDraft
   - Apply the hardcoded field -> consent_scope table from §5
     (post-process, not model-decided)
   - Set approval_status = 'pending_review' on every field, unconditionally
5. Write draft to `leader_profile_drafts` (or equivalent name at build time — locked per §0.3)
   - NOT `leaders` (no gate exists there today, see §1-2)
   - NOT `business_profiles` (wrong entity)
   - Columns: `approval_status`, `source_type`, `source_ids`, provenance
     (segment/quote IDs per field, per §4/§7.5), `confidence`,
     `consent_scope` (per field, per §5), `reviewed_by`, `reviewed_at`
   - `wwm_leader_id` set only by a human (§0.5) — this script never
     auto-matches or auto-creates a leader record
6. Surface via a review UI or a flat export for Ford's weekly batch review
   (matching the "Ford approves batches, not items" operating model).
   Ford's review action updates `approval_status`/`reviewed_by`/
   `reviewed_at` — this is a separate action from consent, which is never
   set or changed by this review step (§0.4, §7.6)
```

Nothing past step 2 should run without this spec being separately approved; step 3 (the actual API call) needs its own explicit go regardless, since it's the external-send boundary.

---

## 7. Risk controls to prevent private intelligence leaking into public/client-facing fields

1. **Hardcode the field → `consent_scope` mapping outside the LLM.** Per §5, this must be a static lookup table in the bridge script, applied after extraction, not a value the model assigns per-field. An LLM given "assign public/internal/commercial/demo per field" will be inconsistent, and getting this wrong is exactly the failure mode this control exists to prevent.
2. **No write path from `internal` to any other scope.** The review UI / batch export tooling should not offer a control that lets `internal`-scoped fields be reclassified — if something needs to move from internal to public, that should require deleting the internal record and re-extracting under an explicit public framing, not a status flip, so there's no accidental one-click leak.
3. **New table, not a shortcut through `leaders` or `business_profiles`.** Writing Cincy Voices drafts into the existing `leaders` table (even flagged `pending_review` in application logic only, since the column doesn't exist) risks a future code path — e.g. some other script or a UI "quick edit" — reading/updating `leaders` directly and silently promoting unreviewed content, since there'd be no schema-level gate. A dedicated drafts table with a real `approval_status` column enforced at the DB layer is the actual fix, matching the existing `business_profiles` pattern instead of trying to retrofit `leaders`.
4. **Consent check happens before extraction, not after.** If `consent_status` is `unconfirmed`, `declined`, or `revoked`, the bridge should refuse to run the extraction at all for that leader, not extract-then-gate. This avoids ever having unreviewed AI output sitting anywhere, even in draft form, for a leader who hasn't agreed to this use of their footage.
5. **Segment-level provenance is mandatory, not optional.** Every field in the output must carry a `source_segment_id` (or explicitly `null` for a stated synthesis field like `bio`). A field with no traceable source should be dropped, not included with lower confidence — this prevents an ungrounded model inference from later being treated as if it came from something the leader actually said on camera.
6. **This bridge should never be the trigger for consent status changes.** Consent lives and changes only in Cincy Voices' own schema and workflow (per the May 29 audit's proposed DDL) — the bridge reads it, never writes it, so consent state can't drift because of a profile-enrichment run.

---

## 8. No-build implementation checklist for the next approval gate

Everything below is unbuilt. §0 locked the direction; what's left are build-time specifics, not open design questions.

- [x] ~~Decide leader-extraction contract to target~~ — **locked (§0.1):** richer `src/index.ts` path.
- [x] ~~Decide where drafts land~~ — **locked (§0.3):** dedicated `leader_profile_drafts` table (or equivalent name at build time), not local/file-based, not a shortcut through `leaders` or `business_profiles`.
- [ ] **Build-time:** finalize exact table/column names and migration for `leader_profile_drafts` — this spec fixes the *shape* (§4, §0.3), not the literal SQL.
- [ ] **Decide:** who executes Ford's review action day-to-day — Ford directly, or does this feed the existing weekly-batch review model from `04_AGENT_ORG_CHART.md`? (§0.4 fixes that review and consent are separate gates; it doesn't fix who operates the review step.)
- [ ] **Confirm against real consent form language:** the field → `consent_scope` table in §5 is this spec's proposed default mapping, not yet checked against how Cincy Voices' actual leader consent forms are worded (§0.4). This needs the real form text before any field is marked `public`/`commercial`/`demo`-eligible in practice.
- [x] ~~Decide auto-match vs. manual linking~~ — **locked (§0.5):** manual-only for v1. No auto-match writes, regardless of how `/process-leader`'s existing auto-match logic (`src/index.ts:859-889`) behaves for other sources.
- [ ] **Scope:** which Cincy Voices leaders (of the 8 total) are actually candidates for this bridge first — likely the 3 with closed recut batches (Will Phillips, Amy Sheehy, Christine Bell) as covered in `18_JUNE1_BATCH_CLOSURE_2026-07-09.md`, not all 8 at once.
- [x] ~~Decide whether to flag the pre-existing `/process-leader` direct-write gap~~ — **locked (§0.6):** flagged, not fixed, in this pass. See §9.

---

## 9. Companion risk note: pre-existing `/process-leader` direct-write behavior

Separate from the Cincy Voices bridge, surfaced here because it would otherwise be inherited silently by any future build on top of this path.

**What it is:** `/process-leader` (`src/index.ts:809-993`), the actually-deployed leader-extraction endpoint, writes AI-extracted fields directly onto a live `leaders` record — `title`, `bio`, `intro_sentence`, `specializations`, `industries`, `story`, `working_style`, and more (`src/index.ts:892-921`) — with **no approval step, no draft/versioned table, and no way to review before it lands**. This applies today, right now, to any transcript run through this endpoint, regardless of source — a live Ford intake call, a Fireflies auto-ingest, anything. It is not specific to, or caused by, Cincy Voices.

**Why it's separate from this spec:** this bridge (§0.2, §0.3) deliberately routes around the problem by never writing to `leaders` at all. Fixing `/process-leader` itself — adding an approval gate parallel to `business_profiles`' `pending_review` pattern — is a WWM Platform change with its own blast radius (it would affect every existing leader-intake workflow, not just Cincy Voices), and is explicitly out of scope for this pass per Ford's decision (§0.6).

**What it means in practice, while unfixed:** anyone (Ford, or any future automation) who calls `/process-leader` on a real transcript today is already writing unreviewed AI extraction straight into a live leader's profile. This isn't a new risk this bridge creates — it's a standing one, worth Ford's awareness independent of whether the Cincy Voices bridge is ever built.

**Recommended next step (not started, not approved, listed for awareness only):** at some future point, add an `approval_status` column to `leaders` (or introduce a `leader_profile_drafts`-style staging table generally, not just for Cincy Voices) so `/process-leader` stops writing directly to the live record for any source. This is a distinct project from the Cincy Voices bridge and would need its own scoping pass.

---

## Summary of open decisions (for Ford)

Locked (§0): target contract, no direct `leaders` writes, dedicated drafts table, Ford-review/consent as separate gates, manual-only linking for v1, flag-not-fix on `/process-leader`.

Still open, for whenever this moves toward a build:

1. Exact table/column names and migration for `leader_profile_drafts`.
2. Who operates the day-to-day review step — Ford directly, or the weekly-batch model.
3. Whether the §5 consent-scope-per-field table matches the real Cincy Voices consent form language — needs a check against actual form text, not just this spec's proposed default mapping.
4. Which of the 8 Cincy Voices leaders are v1 candidates — recommend starting with the 3 whose recut batches just closed (Will Phillips, Amy Sheehy, Christine Bell).
5. Whether/when to separately scope a fix for the pre-existing `/process-leader` direct-write gap (§9) — independent project, not part of this bridge.
