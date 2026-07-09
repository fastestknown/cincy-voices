# Executable Prompts and SOPs

Paste-ready. All outputs from these prompts are drafts requiring Review or Explicit approval per the gates in `04_AGENT_ORG_CHART.md`.

## Clip review (human SOP)

1. Pull the week's staged clips via `review-queue.sh --status staged`.
2. For each clip: watch it, check against the rubric in `06_EDITORIAL_AND_DESIGN_SYSTEM.md`.
3. Mark keep / cut / escalate. Escalations go to Ford in the weekly batch, not individually.
4. Confirm consent status before marking anything "ready to publish," not just "ready to stage."

## Gemini video scoring prompt (reuse existing, documented here for completeness)

```
You are a documentary editor reviewing a candidate video clip for a professional media library.
Score the clip 1-10 on each axis: audio_quality, visual_quality, message_strength, standalone_clarity,
buyer_relevance, leader_usefulness. Flag starts_cleanly (bool), ends_cleanly (bool),
contains_outtake_or_banter (bool). Prefer 12-30 second moments. Avoid inside jokes.
Penalize weak framing. If the clip requires context not present in the clip itself to make sense,
score standalone_clarity low. Return structured JSON only.
```

## LinkedIn post generation prompt

```
Draft a LinkedIn post in Ford Knowlton's voice: warm, vulnerable, specific, curious, contractions,
no em-dashes, no corporate language (never: synergize, leverage, utilize, disrupt, revolutionary,
game-changing). 150-250 words. Anchor on this clip/quote: [INSERT]. End with one genuine engagement
question. Do not include any link in the post body — link goes in the first comment, drafted separately.
Label output clearly: DRAFT ONLY, NOT SEND-READY.
```

## Leader profile enrichment prompt (bridge to leader-agent.ts)

```
You are extracting a fractional-leader profile from Cincy Voices interview evidence for [LEADER NAME].
Source: transcript [ID], enriched segments [IDs], existing markdown profile at content/leaders/[slug].md.
Extract: career chapters, industries, specializations, working style, valuable situations
(chaos/turnaround/scaling/etc.), outcomes with metrics if stated, unique differentiator,
ideal client profile, one-line intro snippet. For each field, include confidence (high/medium/low),
source (which transcript/segment), and flag anything that sounds like an unverified claim rather than
a stated fact. Do not write to any live profile table. Output as a pending_review draft with
source_type = 'cincy_voices'.
```

## Company-facing collateral prompt

```
Draft a one-pager proof point for [LEADER NAME] to support a WWM sales conversation with [PROSPECT/none
specified]. Use only: the enriched profile bio, one approved power quote, one outcome-with-metric if
available. No sales pressure language. Label DRAFT ONLY — requires Ford approval and leader consent
confirmation before any external use.
```

## Magazine feature drafting prompt (hold for future use, not to be run without Ford's explicit go per `15_MAGAZINE_AND_EDITORIAL_PILOT.md`)

```
Draft a magazine feature in the "Practice" issue-00 format ([Feature/Column/Field Note/Conversation/
Long Read], choose based on content) for [LEADER NAME], sourced from Cincy Voices transcript [ID] and
existing markdown profile. Match the tone of the existing issue-00 pieces (e.g., "She Hugged Me at
Payroll," "The Stupid Questions"). Label DRAFT ONLY, requires leader review given print/permanence.
```

## Visual asset brief (for Design Director / external designer)

```
Brief: [template name, e.g. leader one-pager]. Brand: WWM (ivory, teal, DM Serif Display per
wwm-marketing-site-design-system). Content slots: [leader photo/thumbnail, bio block, power quote,
outcome metric]. Tone: professional, warm, not corporate-glossy. Deliver as a reusable template,
not a one-off design.
```

## Ford approval briefing (format for the weekly batch)

```
Subject: [N] items ready for your review — [date]
1. [Item type] — [leader/subject] — [one-line what it is] — [why it's ready] — [any flag/escalation reason]
...
Everything below is a draft. Nothing has been sent, published, or uploaded. Reply approve/cut/hold per item.
```

## Agent handoff (internal, role-to-role)

```
From: [role]. To: [role]. Item: [clip/quote/profile/draft ID]. Status: [what's been done].
Next action needed: [specific ask]. Blockers: [if any]. Consent status: [confirmed/unconfirmed/n-a].
```

## Consent review (Risk and Consent Lead SOP)

1. Before any new external use of a leader's content, check `consent_status` on that leader/segment.
2. If `unconfirmed`, do not proceed. Draft a short, warm confirmation message (voice rules apply) and route to Ford for send approval.
3. If `declined` or `revoked`, hard stop — escalate to Ford immediately, do not proceed under any circumstance.
4. Log the check itself (who checked, when, what was found) so this isn't repeated redundantly.

## Local-only production update checklist (pre-flight, every session touching this system)

- [ ] Confirm no Mux upload will occur without explicit Ford go-ahead this session.
- [ ] Confirm no Supabase write (dev or prod) will occur without explicit Ford go-ahead this session.
- [ ] Confirm no leader, prospect, or partner is being contacted this session.
- [ ] Confirm no magic link is being created or sent this session.
- [ ] Confirm all outputs are saved locally as drafts, not published anywhere.
