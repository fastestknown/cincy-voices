# Cincy Voices Recut Brief

## Context

Ford originally built Cincy Voices as a cinematic microsite for Cincinnati fractional leaders. The first pipeline processed local videos through AssemblyAI, Claude enrichment, quote extraction, Mux upload, and ffmpeg clip trimming. The site now has public leader pages, topic pages, a rotating Mux B-roll hero, and private leader vault pages.

The current pain point is editorial quality. The site looks good, but many clips feel only okay. The next pass should make the video library more useful for Work With Meaning marketing, leader-owned content kits, B-roll, and a searchable fractional leader knowledge base.

## What Exists Locally

- Website app: `/Users/fordknowlton/cincy-voices`
- Pipeline scripts: `/Users/fordknowlton/jun-os/scripts/cincy-voices`
- Processed data: `/Users/fordknowlton/jun-os/data/cincy-voices`
- Current transcript outputs: AssemblyAI JSON, enrichment JSON, trims JSON, quote JSON
- Current clip candidates: `/Users/fordknowlton/jun-os/data/cincy-voices/identify-clips`
- Mux playback IDs: `/Users/fordknowlton/jun-os/data/cincy-voices/playback_ids.json`

## Known Current Pipeline

1. `transcribe.sh`: AssemblyAI transcription
2. `enrich.sh`: Claude segment enrichment
3. `extract-quotes.sh`: Claude quote extraction
4. `identify-clips.py`: Claude identifies 10 to 25 second clips per leader from transcripts
5. `cut-clip.sh`: ffmpeg clip cuts
6. Supabase tables drive the website and leader vault

## Main Hypothesis

The first version over-weighted transcript text and under-weighted the actual video moment. A better pipeline should score clips using both meaning and footage quality:

- Does the speaker look and sound strong?
- Is the moment emotionally complete?
- Does the clip start cleanly and end naturally?
- Is there enough visual variety for B-roll?
- Can this become a useful artifact for the speaker, WWM, or a buyer of fractional leadership?

## Claude Code Assignment

You are auditing and redesigning the Cincy Voices video pipeline. Do not reprocess the full library first. Start with a small, evidence-based audit and create a clear plan.

### Phase 1: Inventory

1. Inspect `/Users/fordknowlton/cincy-voices`.
2. Inspect `/Users/fordknowlton/jun-os/scripts/cincy-voices`.
3. Inspect `/Users/fordknowlton/jun-os/data/cincy-voices`.
4. Produce counts for:
   - sources
   - leaders
   - transcripts
   - existing segments
   - candidate clips by leader
   - Mux playback IDs
   - quotes
   - clips with trim metadata
5. Identify schema fields that can support a richer video library, and fields that are missing.

### Phase 2: Quality Audit

Pick 3 leaders and review 5 clips each:

- one clip currently shown on the public site
- one clip from the leader vault
- one high-scored candidate
- one low or rejected candidate, if available
- one raw source moment around a candidate timestamp

For each clip, score:

- message strength, 1 to 10
- visual strength, 1 to 10
- audio clarity, 1 to 10
- standalone clarity, 1 to 10
- buyer relevance, 1 to 10
- leader usefulness, 1 to 10
- B-roll usefulness, 1 to 10

Then explain why the clip works or fails in one paragraph.

### Phase 3: Gemini Test Pass

Use the newest available Google video-understanding tool that is configured in this environment. Prefer Gemini API or Vertex/Gemini Enterprise if credentials exist.

Run only a small test first:

- 1 raw source video
- 1 existing clip that feels weak
- 1 existing clip that feels strong

Ask Gemini to analyze audio and visual signals together, return timestamped moments, and produce structured JSON. Compare Gemini results against the existing Claude and AssemblyAI outputs.

### Phase 4: Proposed New Schema

Design a richer content catalog around `moments`, not only clips:

- speaker
- source video
- timestamp range
- transcript text
- clean quote
- topic tags
- visual tags
- emotional tone
- buyer persona relevance
- function relevance, CFO, CMO, COO, HR, Sales, EOS
- content use cases, public site, vault, LinkedIn, B-roll, sales deck, Roebling demo
- clip quality score
- B-roll quality score
- rights or consent status
- review status
- Mux playback ID
- raw source playback ID

### Phase 5: Rebuild Recommendation

Return a recommendation with:

1. What to keep from the current site.
2. What to change in the pipeline.
3. What to change in the website.
4. What to change in leader vaults.
5. What should become a Work With Meaning internal asset library.
6. What needs Ford review before publishing.

## Gemini Prompt Template

Use this prompt for a single video or clipped interval:

```text
You are a senior documentary editor and B2B content strategist reviewing footage for Work With Meaning.

Context:
- Brand: Work With Meaning
- Project: Cincy Voices
- Audience: Cincinnati SMB owners and fractional executives
- Goal: Find the most useful, human, specific moments from conversations with fractional leaders.

Analyze this video using both audio and visual information. Do not judge only the transcript.

Find moments that are useful for at least one of these use cases:
- public website hero or profile clip
- leader's private content kit
- LinkedIn short post
- sales conversation proof point
- B-roll for Work With Meaning
- internal knowledge base about fractional leadership

For each moment, return JSON only:
[
  {
    "start_time": "MM:SS",
    "end_time": "MM:SS",
    "suggested_title": "",
    "verbatim_transcript": "",
    "clean_pull_quote": "",
    "why_it_matters": "",
    "primary_use_case": "",
    "secondary_use_cases": [],
    "topic_tags": [],
    "visual_tags": [],
    "emotional_tone": "",
    "buyer_relevance": 1,
    "leader_usefulness": 1,
    "broll_usefulness": 1,
    "audio_quality": 1,
    "visual_quality": 1,
    "standalone_clarity": 1,
    "clip_quality_score": 1,
    "recommended_action": "keep | recut | use_as_broll | reject",
    "recut_notes": ""
  }
]

Rules:
- Prefer 12 to 30 second moments.
- Start and end on natural sentence boundaries.
- Avoid setup, throat clearing, inside jokes, and moments that need too much context.
- Do not over-polish the speaker. Keep the human voice.
- Penalize moments with weak framing, awkward expressions, bad audio, or unclear audience value.
- If the best use is only B-roll, say that clearly.
```

## Website Direction

The site should shift from "nice clips embedded on profiles" to a useful media library:

- Public site: fewer, stronger clips with tighter topic paths.
- Leader pages: one hero moment, 3 to 5 supporting moments, and cleaner social proof.
- Topic pages: buyer-facing themes, not generic tags.
- Vault: all approved clips, embed/share/download options, captions, suggested LinkedIn copy drafts.
- Internal WWM library: searchable B-roll, quotes, topic clips, and proof points for sales and marketing.

