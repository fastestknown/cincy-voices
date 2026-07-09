# Risks, Consent, and Governance

## Rights and consent

No consent-tracking field exists anywhere in the current Cincy Voices schema. This was flagged as a legal risk in the May 29 audit and nothing found this session indicates it has been addressed since. Every leader was filmed under some implicit understanding (an event they attended, presumably briefed on general use), but there is no record of what each leader actually agreed to: internal use only, website use, social use, sales collateral use, magazine use. Treat this as a real gap, not a formality.

## Public vs. private boundaries

Currently binary in practice (segment is either not public or it's on the live website/vault), but the actual risk surface has more gradations: internal-only (Open Brain, Roebling internal demos), leader-controlled (vault, leader-owned kits), WWM-controlled public (website, editorial), WWM-controlled commercial (sales collateral shown to prospects), and permanent/high-visibility (magazine, if ever pursued). Each gradation should require a different consent bar, with print/magazine at the top.

## Leader approval

Recommend: any first-time use of a leader's likeness in a new channel gets shown to that leader before it goes live, not after. Ongoing/repeat use in a channel they've already approved (e.g., their vault) doesn't need re-approval every time, but any use in a new channel does.

## Clip misuse

Two concrete known risks, both already surfaced by pipeline QA: (1) an outtake or non-content moment gets treated as legitimate content — the Will Phillips "Hey Adam" clip is the proof case this already happened once at the identification stage, caught before publish by Gemini QA, not before. (2) A clip capturing a vulnerable personal disclosure (Christine Bell's Bell's palsy reference) gets used in a way that reads as exploitative rather than authentic — this is a judgment call, not a technical filter, and should always escalate to a human.

## Brand risk

The shared placeholder `mux_playback_id` bug (dozens of segments marked `review_status=approved` pointing at what appears to be seed/test data) is the most urgent brand risk in this assessment. If any of those segments are live on the public site or vault, a leader or prospect could see broken, wrong, or placeholder content attributed to a real person. This should be checked and fixed before any other work in this system proceeds.

## Accuracy risk in leader profiles

Any profile field derived from Cincy Voices video/transcript evidence carries the same risk as any AI extraction: confident-sounding but wrong. The existing WWM Platform pattern (`_meta.confidence`, `pending_review` status) already handles this correctly — the discipline is to not skip it under time pressure when the profile-enrichment bridge is built. See `14_PROFILE_ENRICHMENT_MODEL.md`.

## Publishing gates

Restated from the master prompt and standing operating rules: no publish, Mux upload, Supabase write, or public change happens without Ford's explicit approval in-session. This assessment produced zero such actions. Every future workflow described in this folder should preserve that gate at the tool-call layer (per Rule 88, not just in a system prompt that can be compacted away).

## Data governance between Cincy Voices, WWM Platform, Roebling, HubSpot, and client-specific use

- **Cincy Voices → WWM Platform:** one-directional, via the proposed profile-enrichment bridge. WWM Platform should never write back into Cincy Voices tables.
- **Cincy Voices → Roebling:** demo use only, treated as internal/controlled per the master prompt's instruction, never a live data integration without separate design work and Ford's explicit approval.
- **Cincy Voices → HubSpot:** none currently exists. If leader-facing actions (vault delivery, kit delivery) are logged to HubSpot per Rule 103, that's a one-directional event log, not a data sync.
- **Cincy Voices → client-specific use (e.g., a specific WWM engagement):** should never happen without both Ford's explicit approval and the specific leader's consent for that specific commercial context — a leader agreeing to appear in general WWM sales collateral is not the same as agreeing to be used in a specific client's proposal.

## Minimum consent model (before any public or leader-owned distribution expands)

1. Add the consent fields drafted in `05_PRODUCT_AND_SOFTWARE_ARCHITECTURE.md` (`consent_status`, `consent_scope` at the leader and segment level).
2. For each of the 17 leaders, do a one-time pass: what do we actually know they agreed to? Mark `unconfirmed` where genuinely unclear rather than assuming permissive defaults.
3. For any leader marked `unconfirmed` whose content is about to be used beyond what's already live, get an explicit confirmation before proceeding — a short, warm, no-pressure message (per voice rules), not a legal-sounding release form, unless volume or risk later justifies formalizing one.
4. Do not backfill consent by inference. If it's not confirmed, treat it as internal-use-only until it is.
