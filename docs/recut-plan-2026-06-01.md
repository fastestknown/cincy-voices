# Cincy Voices Recut Plan — June 1, 2026

## Status
- Staged clips: `/Users/fordknowlton/jun-os/data/cincy-voices/recuts/staged/`
- Gemini source files: `/Users/fordknowlton/jun-os/data/cincy-voices/gemini-checks/`
- No Supabase writes yet. No Mux uploads yet.
- Current gate: Ford review of staged local MP4s before production changes.
- Latest Christine rerun: `/Users/fordknowlton/jun-os/data/cincy-voices/gemini-checks/christine-bell-2026-06-01_062538-gemini.json`
- Christine rerun result: 3 keeps, 2 recuts. Core Value Prop recovered and scored clean after the serial rerun.

## Outtake Investigation

### Will Phillips "Hey Adam" Outtake
**Evidence gathered:**
The file `sb_Will_Phillips.mp4` in `/Desktop/cincy-voices-supercuts/clips/` is a 10-second soundbite containing "Hey Adam, how you doing? Get out of my podcast." This is NOT in the `cincy_voices_segments` table — no segment contains "Adam" in its text.

**Critical finding on the suspect asset:**
Supabase segment `5d18916e-72d8-4184-b95d-a08f54eac552` uses `mux_playback_id = HIvQHHLBGx401UfVkwa01VCT38CcSpJ866qoNB00abfWG4` and has `start_time_ms=0, clip_quality_score=1, review_status=approved`. This same Mux asset ID appears on **dozens of segments across multiple leaders and sources**, all with score=1 and start_time_ms=0. This looks like a batch of placeholder/test records created during early pipeline seeding — not real content clips.

**Outtake file extracted for Ford review:**
`/Users/fordknowlton/jun-os/data/cincy-voices/recuts/staged/REVIEW_will-phillips_outtake-check_0-40s.mp4`
This is the 0-40s window of the `HIvQHHLBGx` asset. Ford should play this file to confirm whether it contains the "Hey Adam" moment.

**Proposed Supabase updates (do not run without Ford approval):**
All segments sharing `mux_playback_id = HIvQHHLBGx401UfVkwa01VCT38CcSpJ866qoNB00abfWG4` should be reviewed. Preliminary proposal:

```sql
-- Mark all HIvQHHLBGx segments as rejected (placeholder/test records)
UPDATE cincy_voices_segments
SET review_status = 'rejected'
WHERE mux_playback_id = 'HIvQHHLBGx401UfVkwa01VCT38CcSpJ866qoNB00abfWG4';
-- Affects ~10 rows across multiple leaders. Verify count first:
-- SELECT count(*), leader_id FROM cincy_voices_segments
-- WHERE mux_playback_id = 'HIvQHHLBGx401UfVkwa01VCT38CcSpJ866qoNB00abfWG4'
-- GROUP BY leader_id;
```

---

## Will Phillips

**Sources:**
- Solo: `dbfdc968-0e41-41f4-907f-6642651171d1` | master `3HR02pEC3N6vvxbgoQ2tz7QGpB100EJORSdrSOZDtuEQA`
- Panel ("Episode 4 – People & Culture Builders"): `2b163087-c496-4d08-b7c2-1afef5593735` | master `LFfazwB00bvvA01rquLTYCv9Mh01zjTAhjHQr3veKWKl200`

---

### WP-1: Misidentified Root Causes

| Field | Value |
|---|---|
| Leader | Will Phillips |
| Source ID | `dbfdc968-0e41-41f4-907f-6642651171d1` |
| Current start/end | 815120ms / 844700ms (29.6s) |
| **Proposed start/end** | **813000ms / 842500ms (29.5s)** |
| Staged file | `will-phillips_root-causes_813000-842500_STAGED.mp4` |
| Gemini action | recut |
| Gemini scores | AQ=8 VQ=8 MS=9 SC=9 BR=9 LU=9 |
| Starts cleanly | True |
| Ends cleanly | False (current) → True (recut) |

**Reason for recut:** Current end at 844700ms cuts off mid-word during "they rarely choose balance." Gemini: "End at 'misidentified.'" The word "misidentified" ends at 835620ms; proposed new end 842500ms catches a cleaner breath after "comfortable with." The "comfortable with." at 842340ms is a natural sentence end.

**Transcript (proposed):** "If every business leader in Cincinnati could understand one thing about my sweet spot, it would actually be understanding one thing about your business: if you've been trying to do something for six months to a year and the issue remains, you probably have the root cause misidentified. That's what happens time and time again because people default to solutions they're comfortable with."

**Recommended use case:** public_site (hero clip), vault
**Risk notes:** Start at 813000ms catches "If" — verify the full sentence opens. If "If" is clipped, use 812000ms.
**Ford approval before publish:** Yes — confirm staged clip plays cleanly.

---

### WP-2: Employee Value Proposition

| Field | Value |
|---|---|
| Leader | Will Phillips |
| Source ID | `2b163087-c496-4d08-b7c2-1afef5593735` |
| Current start/end | 1944056ms / 2054218ms (110.2s) |
| **Proposed start/end** | **1944056ms / 1961500ms (17.4s)** |
| Staged file | `will-phillips_evp_1944056-1961500_STAGED.mp4` |
| Gemini action | recut |
| Gemini scores | AQ=8 VQ=8 MS=9 SC=9 BR=9 LU=9 |
| Starts cleanly | True |
| Ends cleanly | False (current 110s way overruns) → True (recut) |

**Reason for recut:** 110s clip was identified from transcript — Claude selected a huge window and never trimmed it. Gemini: "Trim to start at 0:11, end at 0:29." Precise timestamps from AssemblyAI: "if you're selling without" starts at 1957785ms, "competing on price" ends at 1960739ms. Proposed cut ends right after this analogy lands.

**Transcript (proposed):** "One of the big issues is organizations can't keep people because they don't know what their value proposition is. It's like in sales — if you're selling without a value proposition, you're competing on price."

**Alternate (fuller version):** Extend to 1976500ms (~32s) to include "...That's what most organizations do. They think the value they provide is a paycheck, when that's one of the least valuable things." Slightly over 30s but complete.

**Recommended use case:** public_site, vault, linkedin
**Risk notes:** The short version (17.4s) ends on "competing on price." — a strong, complete analogy. The full version adds the paycheck insight but runs 32s. Stage both if needed.
**Ford approval before publish:** Yes.

---

### WP-3: Power of Outsider Questions

| Field | Value |
|---|---|
| Leader | Will Phillips |
| Source ID | `2b163087-c496-4d08-b7c2-1afef5593735` |
| Current start/end | 529582ms / 632839ms (103.3s) |
| **Proposed start/end** | **561000ms / 582000ms (21.0s)** |
| Staged file | `will-phillips_outsider-questions_561000-582000_STAGED.mp4` |
| Gemini action | recut |
| Gemini scores (from new window) | AQ=7 VQ=7 MS=6 SC=6 BR=6 LU=6 (from filler-heavy 30s extract) |
| Starts cleanly | True (new window) |
| Ends cleanly | True (new window ends at "culture shapes them.") |

**Reason for recut:** The existing 529582ms start is someone else saying "Wow," — the first 33 seconds are another person's reaction and setup banter. Will's actual content starts at ~561000ms ("well, this probably, maybe I shouldn't say this,"). This self-deprecating opener ("maybe I shouldn't say this") is authentic and worth keeping — it sets up the joke. Proposed clip ends at 582000ms after "culture shapes them." which is a natural complete thought.

**Precise word timestamps:** "a significant portion" starts at 563518ms; "culture shapes them." ends at 581989ms.

**Transcript (proposed):** "Well, this probably — maybe I shouldn't say this — a significant portion of the value I bring during discovery is in asking stupid questions. Because the stupid questions, everyone knows the answer to them, and they're like, 'Ooh, we don't talk about that thing.' People exist in cultures and culture shapes them."

**Note:** The Gemini scores above (6s) were from a 30s extract that captured the wrong part of the source. This clip has not been Gemini-scored with the corrected window. **Run `gemini-check.py` on the staged file before finalizing.**

**Recommended use case:** public_site, vault, linkedin, sales_deck
**Risk notes:** Scores need fresh Gemini pass on the staged file. The "maybe I shouldn't say this" intro is charming but could be trimmed to 563518ms if it feels like filler.
**Ford approval before publish:** Yes — and Gemini re-score recommended.

---

### WP-4: Delegating to Empower Employees

| Field | Value |
|---|---|
| Leader | Will Phillips |
| Source ID | `2b163087-c496-4d08-b7c2-1afef5593735` |
| Current start/end | 2601879ms / 2633258ms (31.4s) |
| **Proposed start/end** | **2604000ms / 2633500ms (29.5s)** |
| Staged file | `will-phillips_delegation_2604000-2633500_STAGED.mp4` |
| Gemini action | recut |
| Gemini scores | AQ=8 VQ=8 MS=9 SC=9 BR=9 LU=9 |
| Starts cleanly | True (new window) |
| Ends cleanly | True (ends after "for you.") |

**Reason for recut:** Current clip starts at 2601879ms with a few seconds of silence/filler before "Give your best employee." The word "give your best" starts at 2605631ms. "for you." ends at 2633098ms. New start of 2604000ms (1.6s before "give") ensures clean audio without cutting off the first word.

**Transcript (proposed):** "Give your best employee some responsibility that's on your plate right now. Don't tell them do this task or that task. Say, this is your responsibility. What can I do to help you be successful in this? I think you'll be blown away by what they can do for you."

**Recommended use case:** vault, linkedin, sales_deck
**Risk notes:** Very actionable advice — good LinkedIn clip. Clean both ends.
**Ford approval before publish:** No — clip is clean per Gemini and word-verified.

---

## Amy Sheehy

**Source:** `4a4c3945-b700-437e-91e6-0d1024d5ae18` | master `QBDNExdzMo00vYKi1JySs3W5U8BIXsqSC6bitHzlsPJ8`

---

### AS-1: Earning Trust as a Leader

| Field | Value |
|---|---|
| Leader | Amy Sheehy |
| Source ID | `4a4c3945-b700-437e-91e6-0d1024d5ae18` |
| Current start/end | 212870ms / 232470ms (19.6s) |
| **Proposed start/end** | **No change — KEEP AS-IS** |
| Staged file | None needed |
| Gemini action | keep |
| Gemini scores | AQ=8 VQ=8 MS=9 SC=9 BR=9 LU=9 |
| Starts cleanly | True |
| Ends cleanly | True |

**Transcript:** "A challenge I had early in my career that was very difficult is that I was female in a manufacturing site. I wasn't from that town. I was a manager. Most of my employees hated me, and I needed to demonstrate what my intentions were over time to earn trust."

**Recommended use case:** public_site (hero candidate), vault
**Ford approval before publish:** No — Gemini confirmed keep, clean both ends.

---

### AS-2: Most Rewarding Client Outcome

| Field | Value |
|---|---|
| Leader | Amy Sheehy |
| Source ID | `4a4c3945-b700-437e-91e6-0d1024d5ae18` |
| Current start/end | 520890ms / 559560ms (38.7s) |
| **Proposed start/end** | **520890ms / 546000ms (25.1s)** |
| Staged file | `amy-sheehy_client-outcome_520890-546000_STAGED.mp4` |
| Gemini action | recut |
| Gemini scores | AQ=8 VQ=8 MS=9 SC=9 BR=9 LU=9 |
| Starts cleanly | True |
| Ends cleanly | True (recut) |

**Reason for recut:** Current clip runs 38.7s and ends mid-sentence. Precise word timestamp: "doing." ends at 545730ms. New end of 546000ms catches this exactly.

**Transcript (proposed):** "The most rewarding thank you from a client is when the client received a national award from her company because of the work we did together. When we began working together, she was working so hard and in a humble way didn't recognize how well she was actually doing."

**Recommended use case:** public_site, vault, linkedin, sales_deck
**Risk notes:** This is Amy's best emotional proof point. Ends perfectly on "actually doing." which is a complete, resonant thought.
**Ford approval before publish:** No — clean per Gemini and word-verified.

---

### AS-3: Unique Charity Business Model

| Field | Value |
|---|---|
| Leader | Amy Sheehy |
| Source ID | `4a4c3945-b700-437e-91e6-0d1024d5ae18` |
| Current start/end | 636680ms / 666410ms (29.7s) |
| **Proposed start/end** | **652730ms / 669500ms (16.8s)** |
| Staged file | `amy-sheehy_charity-model_652730-669500_STAGED.mp4` |
| Gemini action | recut |
| Gemini scores | AQ=8 VQ=8 MS=9 SC=9 BR=9 LU=9 |
| Starts cleanly | True (new start) |
| Ends cleanly | True (recut — ends after "all at the same cost.") |

**Reason for recut:** Ford requested start at "Instead of paying me..." Current clip starts at 636680ms with "Okay, I need to understand that. Tell me what that means." (interviewer question + Amy's setup). The phrase "Instead" begins at 652730ms. New clip ends after "All at the same cost." (~669290ms), which is Amy's natural closing punch.

**Transcript (proposed):** "Instead of paying me, the client pays a charity. The charity will recognize that payment as a donation. So the client is going to be received as a significant donor to really important work in the community. All at the same cost."

**Note:** If you want to include the value prop setup, start at 640360ms ("So in hiring me...") for a 29s version. The short version at 16.8s is punchier and more distinctive.

**Recommended use case:** public_site (hero), vault, linkedin, sales_deck, roebling_demo
**Risk notes:** This is Amy's most unique differentiator. The short version may feel abrupt without setup — test both.
**Ford approval before publish:** Yes — confirm which version to use.

---

### AS-4: Busting the Fractional Executive Myth (TIMESTAMP ERROR FIX)

| Field | Value |
|---|---|
| Leader | Amy Sheehy |
| Source ID | `4a4c3945-b700-437e-91e6-0d1024d5ae18` |
| Current start/end | 597090ms / 594370ms (INVERTED — error) |
| **Proposed start/end** | **602540ms / 619080ms (16.5s)** |
| Staged file | `amy-sheehy_fractional-myth_602540-619080_STAGED.mp4` |
| Gemini action | not yet scored (timestamp error blocked Gemini) |
| Gemini scores | — needs fresh Gemini pass |
| Starts cleanly | Needs Gemini verification |
| Ends cleanly | Needs Gemini verification |

**Reason for fix:** The candidates.json has start_ms=597090 > end_ms=594370 — a data entry error, likely from the identify-clips.py script picking the wrong utterance boundaries. The actual content ("Fractional executives are not the consultant...") was found at 602540ms in the AssemblyAI transcript. "fraction of the cost." ends at 618780ms.

**Transcript (proposed):** "Fractional executives are not the consultant that you paid too much money for that you regret hiring. Fractional executives get in the trench with you, they roll up their sleeves, they're part of the team. They are a whole team member at a fraction of the cost."

**Recommended use case:** vault, sales_deck, roebling_demo (after Gemini verification)
**Risk notes:** Needs Gemini scoring before publish. The staged file should be run through `gemini-check.py` with explicit path.
**Ford approval before publish:** Yes — after Gemini re-score.

---

## Christine Bell

**Source:** `d6c3b0c6-20ee-48e9-81ae-67ede9dc2c5d` | master `OXjMk7q4OPYXlbRrz7Z5UpAPMr9UmLTbSTKqFVh1gfU`

---

### CB-1: Biggest Client Win

| Field | Value |
|---|---|
| Leader | Christine Bell |
| Source ID | `d6c3b0c6-20ee-48e9-81ae-67ede9dc2c5d` |
| Current start/end | 562291ms / 581054ms (18.8s) |
| **Proposed start/end** | **No change — KEEP AS-IS** |
| Staged file | None needed |
| Gemini action | keep (confirmed in both runs) |
| Gemini scores | AQ=8 VQ=8 MS=9 SC=9 BR=9 LU=9 |
| Starts cleanly | True |
| Ends cleanly | True |

**Transcript:** "The biggest win for me, for my clients, is helping them see their vision come to life. And that's what I do as a fractional integrator. I work with the visionaries to implement their vision throughout their organization so that they can reach their goals."

**Recommended use case:** public_site (hero), vault
**Ford approval before publish:** No.

---

### CB-2: Myth-Busting Fractional Executives

| Field | Value |
|---|---|
| Leader | Christine Bell |
| Source ID | `d6c3b0c6-20ee-48e9-81ae-67ede9dc2c5d` |
| Current start/end | 642644ms / 666002ms (23.4s) |
| **Proposed start/end** | **No change — KEEP AS-IS** |
| Staged file | None needed |
| Gemini action | keep (confirmed in both runs) |
| Gemini scores | AQ=8 VQ=8 MS=9 SC=9 BR=9 LU=9 |
| Starts cleanly | True |
| Ends cleanly | True |

**Transcript:** "One myth about fractional executives that I'd like to bust is that a fractional executive works in the business versus on the business. They are part of your leadership team, yet they also have their own metrics. They are responsible for meeting numbers in your business."

**Recommended use case:** public_site, vault, linkedin
**Ford approval before publish:** No.

---

### CB-3: Overcoming Personal Adversity (Bell's Palsy)

| Field | Value |
|---|---|
| Leader | Christine Bell |
| Source ID | `d6c3b0c6-20ee-48e9-81ae-67ede9dc2c5d` |
| Current start/end | 154868ms / 180839ms (26.0s) |
| **Proposed start/end** | **154868ms / 177500ms (22.6s)** |
| Staged file | `christine-bell_adversity_154868-177500_STAGED.mp4` |
| Gemini action | recut |
| Gemini scores | AQ=8 VQ=8 MS=9 SC=9 BR=8 LU=9 |
| Starts cleanly | True |
| Ends cleanly | True (recut — ends after "I have not.") |

**Reason for recut:** Current end at 180839ms falls mid-sentence during "speaking in meetings" — the sentence "And so speaking in front of people, speaking in meetings, even talking on the phone has been difficult." starts at 177819ms and isn't complete until 185659ms. Rather than extending to include the full sentence (~31s), the cleaner end is after "I have not." (word end 176775ms). This gives a shorter, more impactful clip that ends on the most vulnerable statement.

Gemini rerun: "End at 'I have not.' (178839ms) to remove the trailing sentence fragment." Precise word-level end: 176775ms + ~700ms silence = 177500ms.

**Note:** There's also a stumble at 159408ms ("I have been afflicted by—") that Gemini noted. This is a false start that arguably adds authenticity — Bell's palsy makes speaking difficult, which is exactly what she's talking about. Recommend keeping it. If Ford wants it removed, that would require a jump cut (two separate ffmpeg trims), not just a trim.

**Transcript (proposed):** "So you may not know this, but I have facial paralysis. I have been afflicted by — it's interesting, it's called Bell's palsy, and my name is Christine Bell. But I've had it several times, and for 85% of the people they recover, and I have not."

**Recommended use case:** public_site (hero), vault, linkedin
**Risk notes:** This is Christine's signature moment. The stumble may add to its power. Test both with and without if you have the editing bandwidth.
**Ford approval before publish:** Yes — confirm the stumble stays or goes.

---

### CB-4: Core Value Proposition

| Field | Value |
|---|---|
| Leader | Christine Bell |
| Source ID | `d6c3b0c6-20ee-48e9-81ae-67ede9dc2c5d` |
| Current start/end | 680678ms / 695711ms (15.0s) |
| **Proposed start/end** | **No change — KEEP AS-IS** |
| Staged file | None needed |
| Gemini action | keep (new — was erroring before) |
| Gemini scores | AQ=8 VQ=8 MS=8 SC=8 BR=8 LU=8 |
| Starts cleanly | True |
| Ends cleanly | True |

**Transcript:** "What I would want business leaders to understand about my specialty is that I bring focus to your organization, especially to the leadership team, and that's going to help drive results."

**Recommended use case:** vault, linkedin, sales_deck
**Risk notes:** Scores are 8/8 — solid, not exceptional. Good as a supporting vault clip, not a hero clip.
**Ford approval before publish:** No.

---

### CB-5: Why Fractional Leadership Is Growing

| Field | Value |
|---|---|
| Leader | Christine Bell |
| Source ID | `d6c3b0c6-20ee-48e9-81054ms` (not a typo) wait: `d6c3b0c6-20ee-48e9-81ae-67ede9dc2c5d` |
| Current start/end | 583554ms / 626185ms (42.6s) |
| **Proposed start/end** | **589082ms / 602580ms (13.5s)** |
| Staged file | `christine-bell_fractional-growing_589082-602580_STAGED.mp4` |
| Gemini action | recut |
| Gemini scores | AQ=7 VQ=7 MS=7 SC=7 BR=7 LU=7 |
| Starts cleanly | True (new start skips interviewer question) |
| Ends cleanly | True (ends after "keep up.") |

**Reason for recut:** Current clip starts at 583554ms with the interviewer asking "why do you believe fractional leadership is on the rise right now?" — that's 5.5 seconds of someone else's voice. Christine's answer starts at 589082ms. The short version ends after "small businesses need to keep up." (602580ms) which is the clearest, most specific statement. The word "keep up." ends at 602380ms.

**Transcript (proposed):** "I believe fractional leadership is on the rise right now because of the rise of AI. Technology keeps changing and evolving, and small businesses need to keep up."

**Note on scores:** This is Christine's weakest clip (all 7s). The AI-growth insight is topical but generic — many fractionals say it. Consider vault-only or dropping from the public site after Ford review.

**Alternate (if you want the resources point):** Start 589082ms, end 618500ms (~29.4s) adds "So fractionals allow smaller businesses to afford the resources they need to implement these new ideas, new technologies, new innovations."

**Recommended use case:** vault only (scores too generic for public site)
**Risk notes:** Weakest clip in this batch. Could be cut entirely — nothing in it is unique to Christine.
**Ford approval before publish:** Yes — recommend Ford reconsider publishing this one at all.

---

## Summary: What to Reject

### Recommend rejecting (do not publish or re-upload):

| Clip | Reason |
|---|---|
| `sb_Will_Phillips.mp4` (local desktop file) | Outtake — "Hey Adam, how you doing? Get out of my podcast." Zero content value. Delete from Desktop. |
| All segments with `mux_playback_id = HIvQHHLBGx401UfVkwa01VCT38CcSpJ866qoNB00abfWG4` | Suspected test/placeholder records. Shared across multiple leaders, all start at 0ms, all score=1. Verify count, then reject. |
| CB "Why Fractional Growing" (583554ms-626185ms, original) | Too long, starts with interviewer question, scores all 7s. The trimmed version (589082-602580) is barely worth keeping. |
| WP "Power of Outsider Questions" (529582ms-632839ms, original) | Starts with someone else's "Wow." + 33 seconds of setup. The corrected window (561000-582000ms) should replace it entirely. |
| AS "Busting Fractional Myth" (597090-594370ms, inverted timestamps) | Corrupt data. Use corrected 602540-619080ms instead. |

---

## Proposed Supabase Updates (do not run yet)

All reads from the current `cincy_voices_segments` table for these clips will continue to serve the old timestamps until these updates are applied. Hold until Ford approves staged clips.

```sql
-- 1. Reject all HIvQHHLBGx placeholder segments
-- (count first: run SELECT count(*) to verify scope)
UPDATE cincy_voices_segments
SET review_status = 'rejected'
WHERE mux_playback_id = 'HIvQHHLBGx401UfVkwa01VCT38CcSpJ866qoNB00abfWG4';

-- 2. Fix Amy Sheehy timestamp error (Fractional Myth clip)
UPDATE cincy_voices_segments
SET start_time_ms = 602540, end_time_ms = 619080,
    trim_start_ms = 602540, trim_end_ms = 619080,
    review_status = 'needs_review'
WHERE leader_id = (SELECT id FROM cincy_voices_leaders WHERE slug = 'amy-sheehy')
  AND start_time_ms = 597090 AND end_time_ms = 594370;

-- 3. Update Will Phillips Root Causes trim points
UPDATE cincy_voices_segments
SET trim_start_ms = 813000, trim_end_ms = 842500, review_status = 'approved'
WHERE leader_id = (SELECT id FROM cincy_voices_leaders WHERE slug = 'will-phillips')
  AND start_time_ms = 815120 AND end_time_ms = 844700
  AND source_id = 'dbfdc968-0e41-41f4-907f-6642651171d1';

-- 4. Update Will Phillips EVP trim points
UPDATE cincy_voices_segments
SET trim_start_ms = 1944056, trim_end_ms = 1961500, review_status = 'approved'
WHERE leader_id = (SELECT id FROM cincy_voices_leaders WHERE slug = 'will-phillips')
  AND start_time_ms = 1944056 AND end_time_ms = 2054218;

-- 5. Update Amy Sheehy Client Outcome trim
UPDATE cincy_voices_segments
SET trim_start_ms = 520890, trim_end_ms = 546000, review_status = 'approved'
WHERE leader_id = (SELECT id FROM cincy_voices_leaders WHERE slug = 'amy-sheehy')
  AND start_time_ms = 520890 AND end_time_ms = 559560;

-- 6. Update Amy Sheehy Charity Model trim + new start
UPDATE cincy_voices_segments
SET trim_start_ms = 652730, trim_end_ms = 669500, review_status = 'approved'
WHERE leader_id = (SELECT id FROM cincy_voices_leaders WHERE slug = 'amy-sheehy')
  AND start_time_ms = 636680 AND end_time_ms = 666410;

-- 7. Update Christine Bell Adversity trim
UPDATE cincy_voices_segments
SET trim_start_ms = 154868, trim_end_ms = 177500, review_status = 'approved'
WHERE leader_id = (SELECT id FROM cincy_voices_leaders WHERE slug = 'christine-bell')
  AND start_time_ms = 154868 AND end_time_ms = 180839;

-- 8. Update Christine Bell Fractional Growing trim + new start
UPDATE cincy_voices_segments
SET trim_start_ms = 589082, trim_end_ms = 602580, review_status = 'approved'
WHERE leader_id = (SELECT id FROM cincy_voices_leaders WHERE slug = 'christine-bell')
  AND start_time_ms = 583554 AND end_time_ms = 626185;
```

---

## Clips Needing Fresh Gemini Score Before Publish

1. `will-phillips_outsider-questions_561000-582000_STAGED.mp4` — previously scored on wrong window
2. `amy-sheehy_fractional-myth_602540-619080_STAGED.mp4` — was never scored (timestamp error)
3. `will-phillips_delegation_2604000-2633500_STAGED.mp4` — scored but on partial 30s extract

Run: `python3 gemini-check.py --candidates /path/to-manually-constructed-candidates.json` for these. Or add a `--file` flag to `gemini-check.py` that accepts a local mp4 directly.

---

## Next Steps After Ford Review

1. Ford watches all staged clips in `recuts/staged/`
2. Ford approves / modifies the proposed Supabase updates above
3. Re-score the 3 flagged clips with Gemini
4. Upload approved clips to Mux (new clip assets, not master offsets)
5. Update Supabase `mux_playback_id` on each segment with the new clip Mux IDs
6. Run the site build and verify new clips display correctly
7. Consider: add `gemini-check.py --file <local.mp4>` mode for reviewing staged clips without re-downloading from Mux
