# Operational Capability Map

For each capability: owner (simulated agent role, see `04_AGENT_ORG_CHART.md`), current evidence, missing pieces, automation potential, manual judgment required, approval gate, priority (P0-P3).

## Video ingestion
- **Owner:** Product Architect / pipeline scripts
- **Evidence:** `transcribe.sh` pulls source, extracts audio, uploads to AssemblyAI. 15 sources ingested (Mar 17 batch).
- **Missing:** No evidence of ingestion since Mar 17 for new sources; unclear if all ~17 leaders' raw footage is even in the ingestion queue.
- **Automation potential:** High, already automated.
- **Manual judgment:** None.
- **Approval gate:** Auto.
- **Priority:** P2 (works, just confirm full roster is ingested).

## Transcription
- **Owner:** Pipeline (automated)
- **Evidence:** AssemblyAI integration proven, speaker labels for panels.
- **Missing:** Nothing structural.
- **Automation:** Full.
- **Manual judgment:** None.
- **Gate:** Auto.
- **Priority:** P3 (done).

## Clip discovery
- **Owner:** Documentary Editor (simulated) + Claude (`identify-clips.py`)
- **Evidence:** 30 candidate files across 8 leaders.
- **Missing:** Coverage for the full leader roster; transcript-only scoring is known to miss visual/audio quality (the Will Phillips outtake).
- **Automation:** High for candidate generation, but candidates require the Gemini QA gate below before they're trustworthy.
- **Manual judgment:** Editorial call on which candidates are worth pursuing.
- **Gate:** Review (Documentary Editor recommends, Ford confirms only on ambiguous cases).
- **Priority:** P1.

## Human editorial review / clip QA
- **Owner:** Documentary Editor + Gemini (`gemini-check.py`)
- **Evidence:** Gemini QA proven for 3 of 8 leaders with candidates (Amy Sheehy, Christine Bell, Will Phillips); catches outtakes, filler, mid-sentence starts.
- **Missing:** QA for 5 remaining leaders; a documented rubric threshold for auto-reject vs. auto-stage vs. escalate to Ford (see `06_EDITORIAL_AND_DESIGN_SYSTEM.md`).
- **Automation:** High (Gemini already does the heavy lifting), but final "ship it" call needs a human.
- **Manual judgment:** Borderline scores, and any clip touching a sensitive personal disclosure (e.g., the Christine Bell "Adversity" Bell's palsy clip).
- **Gate:** Review (Documentary Editor) → Explicit (Ford) only for borderline/sensitive.
- **Priority:** P0 — this is today's actual bottleneck.

## Recut / ffmpeg cutting
- **Owner:** Product Architect (script) executed after QA approval
- **Evidence:** `cut-clip.sh` proven, 11 staged MP4s exist.
- **Missing:** Nothing structural; blocked on upstream approval, not on the tool.
- **Automation:** Full once approved.
- **Gate:** Auto (once clip is approved upstream).
- **Priority:** P1.

## Captions
- **Owner:** Design Director
- **Evidence:** `lib/captions.ts` exists in the website codebase; no evidence of a caption generation step in the pipeline itself.
- **Missing:** Whether captions are auto-generated from the AssemblyAI transcript or hand-written is unconfirmed.
- **Automation potential:** High (transcript already exists, timing data too).
- **Gate:** Auto for generation, Review for accuracy on any public clip.
- **Priority:** P2.

## Thumbnails
- **Owner:** Design Director
- **Evidence:** None found this session.
- **Missing:** Entire capability.
- **Automation potential:** Medium (Mux can generate frame thumbnails; picking the flattering frame needs a human or a simple heuristic).
- **Gate:** Review.
- **Priority:** P2.

## Design (visual asset system)
- **Owner:** Design Director
- **Evidence:** None found beyond the website's own component styling.
- **Missing:** No leader collateral templates, no sales one-pager templates, no social card templates.
- **Automation potential:** Low to medium once templates exist (template + data merge is automatable, template design is not).
- **Gate:** Review.
- **Priority:** P2.

## Copywriting
- **Owner:** Content Strategist
- **Evidence:** 15 rich leader profiles exist as source material; only 1 editorial piece written from them.
- **Missing:** Cadence, not capability. The raw material to write from already exists for 14 more leaders.
- **Automation potential:** High (Claude can draft from the existing markdown profiles) with Ford/leader review before publish.
- **Gate:** Review (Content Strategist drafts) → Explicit (Ford + leader before publish).
- **Priority:** P1.

## Social copy
- **Owner:** Distribution Lead
- **Evidence:** None produced yet from this content specifically.
- **Missing:** A LinkedIn post template tied to a clip + leader tag.
- **Automation potential:** High for drafting.
- **Gate:** Review + Explicit (leader tag consent).
- **Priority:** P1.

## Profile writing (WWM Platform enrichment)
- **Owner:** Profile Intelligence Architect
- **Evidence:** `leader-agent.ts` exists and does structurally similar extraction from Fireflies transcripts; no Cincy Voices integration exists in code.
- **Missing:** Prompt adaptation for Cincy Voices interview format; source-provenance field; bridge script to feed Cincy Voices transcripts into the existing leader-agent endpoint.
- **Automation potential:** High once bridged — this reuses existing infrastructure.
- **Gate:** Review (agent drafts) → Ford approval (`pending_review` status already exists in the schema pattern).
- **Priority:** P0 — highest strategic leverage, closest to shovel-ready.

## Asset packaging (leader kits)
- **Owner:** Design Director + Distribution Lead
- **Evidence:** None yet.
- **Missing:** Whole capability — a "package clip + quote + one-pager for leader X" workflow.
- **Automation potential:** Medium, depends on design templates existing first.
- **Gate:** Review + Explicit (leader consent for their kit).
- **Priority:** P2.

## Rights tracking
- **Owner:** Risk and Consent Lead
- **Evidence:** None. Flagged in the May 29 audit as a legal risk with zero existing field.
- **Missing:** Entire capability.
- **Automation potential:** Low (this is a data model + process problem, not an AI problem).
- **Gate:** Explicit — this itself is a governance decision.
- **Priority:** P0.

## Publishing
- **Owner:** Product Architect (mechanism) / Ford (gate)
- **Evidence:** Site is live, vault feature built.
- **Missing:** Nothing structural; blocked upstream on approvals and consent.
- **Automation potential:** High mechanically, zero on the judgment call.
- **Gate:** Explicit, always.
- **Priority:** P1.

## Distribution
- **Owner:** Distribution Lead
- **Evidence:** None yet beyond the website itself.
- **Missing:** LinkedIn, email, leader-owned distribution paths all undesigned.
- **Automation potential:** Medium.
- **Gate:** Explicit.
- **Priority:** P2.

## Analytics
- **Owner:** Product Architect
- **Evidence:** `lib/analytics.ts` and `@vercel/analytics` present; vault spec explicitly scopes out vault-specific analytics.
- **Missing:** Any content-performance analytics (which clips get watched, shared).
- **Automation potential:** High once instrumented.
- **Gate:** Auto.
- **Priority:** P3.

## CRM / HubSpot logging
- **Owner:** Operations Lead
- **Evidence:** None found connecting Cincy Voices activity to HubSpot.
- **Missing:** Entire capability; per Rule 103 (HubSpot engagement logging), any leader-facing action here should eventually log to HubSpot.
- **Automation potential:** High once the "leader received their vault link" or "leader profile enriched" event exists.
- **Gate:** Auto (internal logging), no external effect.
- **Priority:** P2.

## Leader feedback
- **Owner:** Risk and Consent Lead + Operations Lead
- **Evidence:** None. No mechanism for a leader to say "don't use this clip" or "this profile is wrong."
- **Missing:** Entire capability — this is part of the minimum consent model.
- **Automation potential:** Low, this needs to be a real human-facing feedback loop.
- **Gate:** Explicit.
- **Priority:** P0 (tied to rights tracking).

## Sales collateral production
- **Owner:** Content Strategist + Financial Strategist (prioritization)
- **Evidence:** None produced yet.
- **Missing:** Whole workflow.
- **Automation potential:** Medium.
- **Gate:** Review + Explicit before showing a prospect.
- **Priority:** P1.

## Magazine editorial production
- **Owner:** Content Strategist
- **Evidence:** Two magazine prototypes exist, not sourced from Cincy Voices.
- **Missing:** Any actual bridge between the two projects.
- **Automation potential:** Medium, later.
- **Gate:** Explicit.
- **Priority:** P3, deliberately deferred (see `15_MAGAZINE_AND_EDITORIAL_PILOT.md`).

## WWM Platform profile enrichment (system-level, distinct from "profile writing" above)
- **Owner:** Profile Intelligence Architect + Product Architect
- **Evidence:** See `14_PROFILE_ENRICHMENT_MODEL.md` for full detail.
- **Missing:** Schema bridge, provenance field, prompt variant.
- **Automation potential:** High.
- **Gate:** Review → Explicit.
- **Priority:** P0.
