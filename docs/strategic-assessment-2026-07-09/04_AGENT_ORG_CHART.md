# Agent Org Chart

Ford sits above this chart as final approver on reputation-affecting decisions. He is not a node in the routing path for any single clip, caption, or post.

## Roles

### Executive Producer
- **Owns:** strategy, scope, judgment calls, what gets built vs. cut.
- **Inputs:** this assessment, ongoing capability/backlog status.
- **Outputs:** prioritized backlog, go/no-go calls on new workflows.
- **Decision rights:** can kill a workflow or path outright; cannot approve external publishing (that's Ford's).
- **Review gate:** reports to Ford weekly, not per-item.

### Documentary Editor
- **Owns:** clip selection standards, Gemini QA rubric, recut quality bar.
- **Inputs:** raw clip candidates from `identify-clips.py`, Gemini QA JSON.
- **Outputs:** staged, QA-passed clip recommendations with a keep/cut/escalate verdict.
- **Decision rights:** auto-reject clips below rubric threshold; auto-stage clips clearly above threshold; escalate borderline or sensitive clips to Ford.
- **Handoff:** approved clips go to Product Architect for cutting/upload; escalations go to Ford via a single weekly batch, not one at a time.

### Content Strategist
- **Owns:** turning footage/profiles into articles, posts, campaigns, collateral drafts.
- **Inputs:** leader markdown profiles, approved quotes, approved clips.
- **Outputs:** drafts only — editorial pieces, social copy, sales collateral drafts.
- **Decision rights:** none on publish; everything routes to Review.
- **Handoff:** drafts go to Ford (and, where the leader is directly quoted or featured, to the leader) before anything ships.

### Profile Intelligence Architect
- **Owns:** the bridge between Cincy Voices evidence and WWM Platform leader profiles.
- **Inputs:** leader markdown profiles, transcripts, existing `leader-agent.ts` schema.
- **Outputs:** structured profile-field proposals with confidence/source/consent metadata, written to `pending_review` (never auto-published to a live profile).
- **Decision rights:** none on publish.
- **Handoff:** Ford reviews and approves per profile, same pattern as the existing business-profile agent.

### Product Architect
- **Owns:** software, data model, workflow automation, queues, admin surfaces.
- **Inputs:** capability map, backlog.
- **Outputs:** scripts, schema proposals, the local review tool.
- **Decision rights:** can ship internal tooling/backend changes autonomously (non-user-facing, per Rule 78); cannot ship anything user-facing without Ford's review (Rule 75).
- **Handoff:** delivers built tools to Documentary Editor / Content Strategist / Ops Lead for use.

### Design Director
- **Owns:** visual asset system, templates, brand standards, thumbnail/caption polish.
- **Inputs:** approved clips/quotes, WWM brand guidelines.
- **Outputs:** templates and finished visual assets.
- **Decision rights:** none on publish.
- **Handoff:** finished assets go to Content Strategist / Distribution Lead for packaging.

### Distribution Lead
- **Owns:** LinkedIn, email, company collateral, referral, leader-owned distribution design.
- **Inputs:** approved, designed assets.
- **Outputs:** distribution plans and drafts, never sends.
- **Decision rights:** none on send.
- **Handoff:** every send-ready draft goes to Ford; leader-tagged content also needs leader sign-off.

### Operations Lead
- **Owns:** staffing, SOPs, review gates, QA cadence, Ford approval batching.
- **Inputs:** all of the above.
- **Outputs:** the actual operating cadence (e.g., weekly approval batch, not per-item interrupts).
- **Decision rights:** can set/adjust internal cadence; cannot change approval gates themselves without Ford (that's governance).
- **Handoff:** is the one who assembles Ford's weekly review batch across all workstreams.

### Risk and Consent Lead
- **Owns:** rights, consent, privacy, brand risk, public/private boundaries.
- **Inputs:** every proposed external use of a leader's likeness, quote, or profile.
- **Outputs:** consent status per leader/clip, a go/no-go on distribution readiness.
- **Decision rights:** hard veto — no other role can override a Risk and Consent block without Ford's Explicit approval.
- **Handoff:** blocks distribution until resolved; this is the one role with stop-the-line authority.

### Financial Strategist
- **Owns:** effort/cost/value estimates, sequencing recommendations.
- **Inputs:** backlog, roadmap.
- **Outputs:** what to do first, what to defer, budget assumptions (see `13_BOARD_PACKET.md`).
- **Decision rights:** advisory only.

## How agents collaborate without Ford routing every decision

The chain for a single clip: Documentary Editor scores it → if clearly good, it's auto-staged → Product Architect cuts and uploads it → Design Director adds captions/thumbnail → Content Strategist drafts any accompanying copy → Risk and Consent Lead checks consent status → Operations Lead bundles it into the weekly batch → Ford approves the batch, not each step. Only borderline editorial calls (Documentary Editor escalation) or consent blocks (Risk and Consent Lead veto) break out of the batch and go to Ford individually, and even then, batched with other genuinely hard calls rather than sent as they arise.

## Where humans are required

- Any clip involving a personal disclosure or vulnerability (e.g., Christine Bell's Bell's palsy reference) — human judgment on whether it honors or exposes the leader.
- Any first-time use of a leader's likeness in a new channel (first LinkedIn post, first sales deck inclusion) — leader should see it before it goes out, at least the first time.
- Final publish/send/deploy — always Ford, per Rule 75 and Rule 101.
- Consent policy decisions — Risk and Consent Lead recommends, Ford decides (this is a governance-adjacent call, not a routine one).
