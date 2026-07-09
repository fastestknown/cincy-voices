# Cincy Voices Consent Source Audit

Date: 2026-07-09

Scope: Find evidence for the consent language that should govern Cincy Voices to WWM Platform profile enrichment.

Actions:

- Searched local files under `/Users/fordknowlton`.
- Searched Google Drive through the connected Drive plugin.
- Fetched the most relevant Drive result, `FLA_Cincy_Voices_Complete_Catalogue.docx`.
- Did not write to Drive, Cincy Voices production, WWM Platform production, Supabase, HubSpot, or any public system.

## Search Terms Used

Drive searches included:

- `Cincy Voices consent`
- `Cincy release`
- `media release`
- `video consent`

Local search included variants of:

- `Cincy Voices`
- `consent`
- `release`
- `permission`
- `media`

## Relevant Evidence Found

Source:

`FLA_Cincy_Voices_Complete_Catalogue.docx`

Drive URL:

`https://drive.google.com/file/d/1XSg4REF_Y7rojsz26nNn6jKMWp-g06CU`

The catalogue states:

- Participants consented to WWM marketing use.
- Atlas use requires re-consent because it is a different editorial context.
- The asset catalogue treats all 9 panelists as having original consent = WWM Marketing and Atlas consent = TBD.
- It also treats 5 headshot-only participants as original consent = WWM Marketing and Atlas consent = TBD.

## What Was Not Found

I did not find the actual signed consent form, release form, registration waiver, or participant permission text.

That means this pass confirms a high-level consent category but does not confirm exact language, permitted channels, commercial terms, revocation language, AI/profile-enrichment rights, or whether "WWM Marketing" includes WWM Platform leader profile enrichment.

## Implication For Profile Enrichment

Do not treat the §5 consent-scope table in `19_PROFILE_ENRICHMENT_BRIDGE_SPEC.md` as legally or operationally validated.

Until the actual form text is found or a new consent path is created:

| Use | Status |
|---|---|
| Internal profile draft generation for Ford review | Possible only if source-system consent status permits internal WWM marketing review and no public/export action occurs. |
| Public WWM Platform profile fields | Not validated by this audit. Needs actual consent text or re-consent. |
| Sales collateral enrichment | Not validated by this audit. Needs explicit commercial-use consent. |
| Demo material | Not validated by this audit. Needs explicit demo-use consent. |
| Atlas or magazine use | Known re-consent requirement per the catalogue. |

## Recommended Gate

For v1 of the Cincy Voices to WWM Platform bridge:

1. Treat Cincy Voices evidence as internal-only until consent is confirmed per leader.
2. Let extraction create `leader_profile_drafts`, not live profile writes.
3. Require Ford review before any field can be considered approved.
4. Require separate consent confirmation before any approved field can move to public, commercial, demo, Atlas, or magazine use.
5. Keep the bridge read-only against consent state. It can read consent evidence, but it must never set or upgrade consent.

## Remaining Evidence Gap

Find one of these before build moves beyond internal draft review:

- Signed Cincy Voices participant release.
- Registration form consent language.
- Email or Doc that contains the exact consent terms.
- A new re-consent workflow for WWM Platform profile enrichment.

No external publishing, profile update, Mux upload, Supabase write, or downstream sales/magazine use should rely on this audit alone.
