# Review Flow Successor Spec

Date: 2026-07-09

Scope: Replace the one-off `review.html` habit with a repeatable local review packet workflow. This is a product and operating spec only. No Supabase write, Mux upload, deploy, publish, magic-link generation, or outbound send happened while creating it.

## Fable 5 Authority Model

This workflow must use Fable 5 as an authority structure, not as language decoration.

| Role | Decision right in this flow | Hard limit |
|---|---|---|
| CEO | Decides whether the batch supports the larger Cincy Voices trust strategy. Can kill weak or distracting workflows. | Cannot approve external publishing without Ford. |
| Operator | Owns exact status, packet completeness, and closure records. Prevents stale open loops. | Cannot blur local approval into distribution approval. |
| Product Architect | Owns the local packet generator, status model, data boundaries, and any draft-only SQL/script output. | Cannot write to Supabase, Mux, or production without explicit Ford approval. |
| Documentary Editor | Owns the watch experience, clip quality rubric, and keep/cut/trim/escalate recommendation. | Cannot mark public-ready, sales-ready, vault-ready, or publish-ready. |
| Risk and Consent Lead | Owns consent status, channel readiness, and stop-the-line blocks. | No other role can override a consent block without Ford's explicit approval. |

Ford remains final approver on reputation-affecting decisions. The review flow should give Ford a clean batch of decisions, not ask him to route the work.

## Current Problem

The existing local page at `/Users/fordknowlton/jun-os/data/cincy-voices/recuts/staged/review.html` was useful for the June 2026 batch, but it is not a durable operating surface.

What works:

- It gives Ford one place to watch clips.
- It stores lightweight decisions locally in the browser.
- It is explicit that nothing touches Mux or Supabase.
- It groups clips into a finite batch.

What fails:

- The decision output is detached from the repo docs unless someone manually transcribes it.
- It does not carry consent status as a first-class field.
- It mixes editorial approval language with recommended downstream uses.
- It cannot distinguish `local-approved` from `public-ready`, `sales-ready`, `vault-ready`, `Mux-ready`, or `Supabase-ready`.
- It is hand-built around one batch and one set of files.
- It has no durable audit trail unless the JSON is copied somewhere.

## Target Workflow

The successor is a local packet workflow, not a production admin app.

1. Product Architect generates a read-only packet from local files, staged clip files, Gemini JSON, and optional Supabase read results.
2. Documentary Editor reviews the packet and pre-fills recommendations: keep, cut, trim, escalate.
3. Risk and Consent Lead stamps each item with consent status: confirmed, unconfirmed, blocked, not-applicable.
4. Operator exports the packet as an HTML review page plus a JSON decision file.
5. Ford watches the finite batch and records decisions: approve locally, reject, request trim, hold.
6. Operator applies the decision record to local docs only.
7. Product Architect drafts any required production SQL or script separately as `DRAFT ONLY, NOT RUN`.
8. Ford gives separate explicit approval for any production write, Mux upload, deploy, publish, vault send, or external distribution.

## Status Model

Use these exact status terms.

| Status | Meaning | Allowed next step |
|---|---|---|
| `candidate` | Clip or item exists for review. No Ford decision yet. | Ford watch/review. |
| `final-local-approved` | Ford approved the editorial trim or content decision locally. | May be considered for separate distribution gates. |
| `rejected` | Ford rejected it. | Do not use. Preserve file unless Ford approves deletion. |
| `trim-requested` | Ford wants another cut. | Create a new candidate. Old candidate remains superseded. |
| `dropped` | Item is intentionally removed from consideration. | Do not use. |
| `hold` | Not decided, not rejected. | Revisit in a later batch. |

Forbidden implied statuses:

- `public-ready`
- `sales-ready`
- `vault-ready`
- `Mux-ready`
- `Supabase-ready`
- `deploy-ready`
- `publish-ready`

Those are separate gates and must only be set by explicit Ford approval for that surface.

## Packet Data Shape

Each review item should serialize to JSON with these fields.

```json
{
  "packet_id": "cv-review-YYYY-MM-DD-slug",
  "item_id": "stable-local-id",
  "leader_slug": "will-phillips",
  "leader_name": "Will Phillips",
  "title": "Outsider Questions",
  "source_file": "/absolute/path/to/local/file.mp4",
  "supersedes": ["/absolute/path/to/older/file.mp4"],
  "duration_seconds": 17.53,
  "source_window_ms": { "start": 561000, "end": 578500 },
  "current_status": "candidate",
  "documentary_editor_recommendation": "approve locally",
  "risk_consent_status": "unconfirmed",
  "downstream_gates": {
    "public_site": "blocked",
    "sales": "blocked",
    "vault": "blocked",
    "mux": "blocked",
    "supabase": "blocked",
    "publish": "blocked"
  },
  "rubric": {
    "audio_quality": 8,
    "visual_quality": 8,
    "message_strength": 9,
    "standalone_clarity": 8,
    "buyer_relevance": 9,
    "leader_usefulness": 9,
    "starts_cleanly": true,
    "ends_cleanly": true
  },
  "watch_prompt": "Approve locally, reject, request trim, or hold?",
  "ford_decision": null,
  "ford_notes": null,
  "production_action_requested": false
}
```

## MVP Build

Build this as local tooling first.

### 1. Packet manifest

Create a local manifest file per batch:

`docs/review-packets/YYYY-MM-DD/<packet_id>.json`

This is the canonical working artifact for the packet. It can be generated by a script later, but hand-authored JSON is acceptable for the next batch if it keeps the fields above.

### 2. Static review page

Generate:

`docs/review-packets/YYYY-MM-DD/<packet_id>.html`

The page should:

- Load the packet JSON or embed it directly.
- Show one item at a time or a compact list with stable dimensions.
- Play local files by relative path when possible.
- Show Fable 5 stamps for each item: CEO fit, Operator status, Product boundary, Documentary recommendation, Risk/Consent gate.
- Let Ford choose only: approve locally, reject, request trim, hold.
- Export decision JSON.
- Never call Supabase, Mux, Vercel, Gmail, Slack, HubSpot, or any external service.

### 3. Decision record

Save Ford's decisions as:

`docs/review-packets/YYYY-MM-DD/<packet_id>-decisions.json`

This is the only artifact the Operator uses to update docs. It does not trigger production actions.

### 4. Closure note

After the decision record exists, create or update a local closure doc:

`docs/review-packets/YYYY-MM-DD/<packet_id>-closure.md`

The closure note must say:

- final status per item
- whether anything is local-approved
- what remains blocked
- whether any production, Mux, Supabase, deploy, publish, or outbound action happened
- the next Ford decision needed, if any

## Review Packet UI Requirements

- First screen must be the review queue, not a marketing or explainer page.
- Each card must show status and blocked downstream gates before the video controls.
- Buttons must be constrained to local decision choices.
- No "publish", "upload", "send", or "approve for use" buttons.
- Use plain language: "Approve locally" instead of "Approve".
- Show a persistent footer with packet progress and an export decision button.
- Include a visible boundary line: "This page cannot write to production."
- Keep recommendation copy short enough that Ford is deciding, not reading a report.

## Operating Rules

1. Local editorial approval and distribution approval are separate decisions.
2. A clip can be final-local-approved and still blocked everywhere externally.
3. Risk and Consent Lead can block an item before Ford sees it if consent is unknown or the proposed channel is outside known scope.
4. Product Architect may draft SQL or scripts but cannot run them without explicit Ford approval.
5. Operations Lead batches decisions so Ford is not interrupted item by item.
6. Documentary Editor can recommend, but Ford decides all sensitive/vulnerable/personally identifying uses.
7. Every closure note must state whether production was touched.

## First Packet To Build

The first successor packet should not re-open the closed June 1 batch. It should be a smoke test using either:

- a read-only packet containing the already-closed June 1 decisions, marked `historical-test`, or
- the next genuinely pending batch after consent status has been reviewed.

Recommended first real use:

1. Confirm consent status fields or source evidence per leader.
2. Select a small 3 to 5 item batch.
3. Generate packet JSON and HTML.
4. Ford reviews locally.
5. Operator writes closure note.
6. Stop. Do not run production actions in the same pass.

## Build Prompt

```text
You are working in `/Users/fordknowlton/cincy-voices`.

Use the Fable 5 authority model explicitly. This is a local review-flow successor build, not a publishing task.

Decision rights:
- CEO: protect Cincy Voices as a trust-building media library.
- Operator: make status and closure unambiguous.
- Product Architect: build local packet artifacts and preserve production boundaries.
- Documentary Editor: make clip review humane and quality-centered.
- Risk and Consent Lead: keep consent and external-use gates hard-blocked unless explicitly cleared.

Task:
Build the first local review packet successor described in `docs/strategic-assessment-2026-07-09/22_REVIEW_FLOW_SUCCESSOR_SPEC_2026-07-09.md`.

Rules:
- Do not touch Mux.
- Do not write to Supabase.
- Do not deploy.
- Do not publish.
- Do not send anything.
- Do not generate or send vault magic links.
- Do not mark anything public-ready, sales-ready, vault-ready, Mux-ready, Supabase-ready, deploy-ready, or publish-ready.
- Use `Approve locally`, not `Approve`, in the UI.
- Export decisions to local JSON only.

Output:
1. Create a packet folder under `docs/review-packets/YYYY-MM-DD/`.
2. Create packet JSON.
3. Create a static HTML review page.
4. If Ford decisions are already known, create a closure note. Otherwise leave a clear pending-decision note.
5. Run a local build or static-file sanity check if applicable.
6. State exactly whether any production, Mux, Supabase, deploy, publish, or outbound action happened.
```

## Decision

Build the successor as a local packet system first. Do not build a production admin screen until the packet flow has been used at least once and the consent model is clearer.
