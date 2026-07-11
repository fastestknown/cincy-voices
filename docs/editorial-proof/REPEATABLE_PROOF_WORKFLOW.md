# Repeatable Evidence-to-Editorial Proof Workflow

Built 2026-07-09, from the Kevin Lawson pilot pass (`kevin-lawson/00_SOURCE_INVENTORY.md` through `03_EDITORIAL_PLACEMENT_PLAN.md`). This is the reusable process for building evidence-backed editorial proof around any Cincy Voices fractional leader — evidence first, attribution second, editorial packaging third, permission before external use.

The core discipline this workflow protects: **finding a true, specific, human proof point is not the same as being allowed to publish it.** Every step below exists to keep those two things separate until permission closes the gap.

---

## The eight stages

### 1. Source discovery

Search Fireflies (keyword + participant-email queries), Google Drive, Open Brain, and relevant local file trees (`cincy-voices`, `jun-os`, and any client-specific project folders) for the leader's name, their known clients, their known referral partners, and any Vistage/peer-group affiliation.

**Do not over-collect.** The goal is a source *map*, not a full transcript archive. Read full transcripts only for the handful of sources most likely to contain usable third-party evidence (a client call, a peer-group call, a colleague conversation) — not every meeting that happens to mention the leader's name in passing.

**Output:** `docs/editorial-proof/<leader-slug>/00_SOURCE_INVENTORY.md` — every candidate source, with type, date, participants, location/link, relevance, category (first-party / customer / peer / Vistage / Ford observation), permission risk, and next action.

### 2. Evidence extraction

For each source worth reading in full, extract exact quotes or tight paraphrases — never invented or reconstructed from memory. Every fragment must be traceable back to a specific transcript ID, document, or memory record.

**Do not paraphrase loosely and call it a quote.** If the exact wording matters (it usually does for a testimonial), use the verbatim transcript text, not a summary of it.

**Output:** `docs/editorial-proof/<leader-slug>/01_EVIDENCE_LEDGER.md` — one entry per fragment, with exact quote/paraphrase, speaker, source, date, context, claim supported, confidence, attribution status, consent status, editorial use case, and a Risk and Consent Lead note.

### 3. Claim validation

Before treating any fragment as usable evidence, check:
- Is the speaker correctly identified? (Multi-speaker transcripts with unlabeled "Speaker 1/2/3" require cross-referencing against other transcripts or context clues — do not guess.)
- Is this actually third-party praise, or is it Ford's own words being misread as a customer's? (This is the single most common failure mode — see the Kevin Lawson pilot's E-05 entry for a caught example.)
- Does the claim involve client results, revenue, sales performance, or business problems? If so, it needs extra verification before use anywhere, per the hard gate below — confirm the number/claim is accurately transcribed and not out of context.

### 4. Consent and attribution review

Classify every fragment into one of these attribution statuses, and never let it move to editorial packaging without one:
- **Named** — cleared for use with the speaker's name attached.
- **Anonymous** — cleared for use without identifying the speaker (check that anonymization actually anonymizes — a specific-enough anonymized detail can still be identifiable).
- **Internal-only** — useful for Ford's/the team's own understanding, never externally usable regardless of who "approves" it (this includes Ford's own observations about a leader, which are never testimonials).
- **Needs permission** — real, usable evidence, but no consent has been sought yet. This is the default status for any new third-party fragment.
- **Do-not-use** — evidence that should not be used even internally (e.g. something said in a context that makes any downstream use inappropriate, regardless of technical consent).

**Output:** captured directly in the Evidence Ledger's `attribution status` and `consent status` fields — no separate file needed unless the leader's evidence set is large enough to warrant its own consent-tracking table.

### 5. Editorial packaging

Draft candidate testimonial-style blocks in three tiers, always tied back to a specific evidence entry:
- **Tier 1** — direct quote candidates requiring explicit permission (named, strongest, highest permission bar).
- **Tier 2** — anonymized proof points requiring review (weaker specificity, lower but nonzero permission bar — check that anonymization is real, not cosmetic).
- **Tier 3** — internal-only insight, not for publication under any permission scenario.

Each candidate block must state: the source evidence it's built from, why it supports the leader's story, exactly what permission is needed before use, and a suggested placement.

**Output:** `docs/editorial-proof/<leader-slug>/02_TESTIMONIAL_CANDIDATES.md`.

### 6. Ford approval

Ford reviews the tiered candidates and decides which are worth pursuing at all, and in what order. This is a strategic/story-fit decision (does this actually serve the leader's narrative, is it worth the relationship cost of asking), separate from whether permission exists yet.

### 7. Leader/customer permission

For anything Ford wants to pursue, a direct, specific ask goes to the actual speaker — showing them the exact proposed wording, not a general "can we use something you said" request. If the speaker is also a current client on a separate engagement (as with Craig Freeman in the Kevin Lawson pass), the ask must be handled as its own respectful, standalone conversation, never bundled into unrelated project work.

**Vistage content is presumed confidential unless proven otherwise** — if a fragment originates from or references a Vistage meeting, treat it as blocked until explicit, documented confirmation exists that it's shareable outside that room.

### 8. Final channel approval

Even after a fragment is named/permissioned, each specific channel (public site, sales collateral, LinkedIn, newsletter, vault, WWM Platform profile) needs its own explicit go — permission to quote someone in one context doesn't imply permission everywhere. Use the Editorial Placement Plan to track which channels are actually cleared versus still pending.

**Output:** `docs/editorial-proof/<leader-slug>/03_EDITORIAL_PLACEMENT_PLAN.md` — placement options by channel, gated explicitly on permission status, plus a sequencing note (dependency order, not a schedule) and an explicit "what is not happening yet" statement.

---

## Status model

Every evidence fragment moves through these statuses, in roughly this order (though `rejected` and `internal-only` can happen at any point):

1. **raw source** — a transcript, document, or memory identified as a candidate source, not yet read for extractable evidence.
2. **evidence candidate** — a specific fragment has been extracted and logged in the Evidence Ledger, but claim validation hasn't happened yet.
3. **verified evidence** — claim validated (correct speaker, correct context, accurate if it involves numbers/results).
4. **permission needed** — verified, but no consent sought yet. Default status for new third-party evidence.
5. **internal-only** — verified, but will never be externally usable regardless of permission (Ford's own observations, or content someone explicitly restricted to internal use).
6. **approved for named use** — the speaker has explicitly approved a specific named use.
7. **approved for anonymous use** — the speaker (or Ford, if genuinely anonymized and no permission risk remains) has approved an anonymized use.
8. **rejected** — evidence considered but decided against, whether for permission reasons, story-fit reasons, or accuracy concerns. Keep the record; don't delete it, so the same ground isn't re-covered later.
9. **published** — actually live somewhere. This status should always be traceable to a specific channel and date, not applied blanket to a whole evidence fragment if only one placement went live.

---

## Hard gates (apply to every leader, not just Kevin Lawson)

- Customer quotes need explicit permission before named external use.
- Vistage content is presumed confidential unless proven otherwise.
- A client's comments discovered through an unrelated engagement (like Steel It's automation work) are internal-only until Ford confirms a permission path — and that permission ask must be its own standalone conversation, not bundled into the existing paid relationship.
- Ford's own interpretation of a leader can inform internal strategy, but must never be presented as if it came from a customer or peer.
- Anything involving client results, revenue, sales performance, or specific business problems needs extra verification before it's treated as usable evidence at all, let alone published.
- No public, sales, website, LinkedIn, newsletter, vault, Mux, Supabase, deploy, or outbound action happens as a byproduct of building this evidence system. Building the proof system and clearing something for use are two different, separately-gated activities.
