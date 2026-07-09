# Day 1 Live Bug Verification

Checked 2026-07-09 against production Supabase via the Cincy Voices app anon key. No production writes were made.

## Findings

### Shared placeholder Mux ID

Live scope is **3 rows**, not dozens.

Affected rows:

| Segment ID | Leader | Source ID | Quality | Review status | Public leader page | Standalone clip URL |
|---|---|---|---:|---|---|---|
| `5d18916e-72d8-4184-b95d-a08f54eac552` | Will Phillips | `dbfdc968-0e41-41f4-907f-6642651171d1` | 1 | approved | Hidden by score filter | HTTP 200 |
| `b3dcb6c7-7c91-43bf-92a4-4e19c71dc872` | Will Phillips | `dbfdc968-0e41-41f4-907f-6642651171d1` | 1 | approved | Hidden by score filter | HTTP 200 |
| `7f0001d5-0f86-4359-a58e-08a925062363` | Dan Keck | `5105f83e-9964-4ffd-91b4-f257444bbd62` | 1 | approved | Hidden by score filter | HTTP 200 |

No `cincy_voices_thread_items` rows reference these three placeholder segments. They do not render on the public Will Phillips or Dan Keck leader pages because those query paths filter `clip_quality_score >= 5`.

However, `/vault/[slug]/clip/[segmentId]` was publicly accessible without a vault token and did not filter quality, review status, live-stream source, or invalid trims. Each placeholder segment returned HTTP 200 by direct URL before the local code guard added in this pass.

### Inverted timestamps

Live scope is **2 rows**:

| Segment ID | Leader | Source ID | Start | End | Trim start | Trim end | Quality | Review status | Public risk |
|---|---|---|---:|---:|---:|---:|---:|---|---|
| `f79c1039-3518-44de-872b-4de9bcf0b0fc` | Amy Sheehy | `4a4c3945-b700-437e-91e6-0d1024d5ae18` | 597090 | 594370 | 597090 | 594370 | 9 | approved | Direct standalone clip URL returned HTTP 200 |
| `90b0a108-25e5-4331-ba38-c728633788fb` | none | `4a9daf4b-35ff-4529-b72d-7ced6245ffdb` | 652330 | 120000 | null | null | 1 | needs_review | Lower. This is the live-stream source excluded by app display queries. |

Amy's inverted row did not appear in the public Amy Sheehy leader page top-five clip list during this check, but the direct standalone clip URL returned HTTP 200 before the local code guard.

## Local code guard added

`lib/queries.ts#getSegmentById` now filters direct standalone clip fetches to:

- require `mux_playback_id`
- exclude the live-stream source
- require `clip_quality_score >= 5`
- return `null` when `trim_start_ms > trim_end_ms`

This is local only until deployed.

## Production write applied 2026-07-09

Ford approved the production data correction in chat with "go ahead."

The first attempted update used `review_status = 'rejected'`, but production rejected it because the live check constraint only allows `pending`, `needs_review`, `reviewed`, and `approved`. The transaction rolled back.

Applied replacement:

- Placeholder rows: `mux_playback_id = null`, `clip_candidate = false`, `review_status = 'needs_review'`.
- Amy Sheehy row: `start_time_ms = 602540`, `end_time_ms = 619080`, `trim_start_ms = 602540`, `trim_end_ms = 619080`, `review_status = 'needs_review'`.

Verified database state after write:

| Segment ID | Quality | Clip candidate | Review status | Mux playback ID | Start | End | Trim start | Trim end |
|---|---:|---|---|---|---:|---:|---:|---:|
| `5d18916e-72d8-4184-b95d-a08f54eac552` | 1 | false | needs_review | null | 0 | 40000 | null | null |
| `b3dcb6c7-7c91-43bf-92a4-4e19c71dc872` | 1 | false | needs_review | null | 0 | 33000 | null | null |
| `7f0001d5-0f86-4359-a58e-08a925062363` | 1 | false | needs_review | null | 0 | 40000 | null | null |
| `f79c1039-3518-44de-872b-4de9bcf0b0fc` | 9 | true | needs_review | `QBDNExdzMo00vYKi1JySs3W5U8BIXsqSC6bitHzlsPJ8` | 602540 | 619080 | 602540 | 619080 |

Post-write URL check: the direct clip URLs still returned HTTP 200 with stale rendered HTML containing the old playback IDs immediately after the database update. This appears to be deployed Next.js page cache/static regeneration behavior, not live database state. Immediate URL-level closure still requires a Vercel redeploy/cache invalidation or waiting for the `revalidate = 3600` window. The local code guard in `lib/queries.ts` should be deployed before relying on direct clip URLs as safe.

## Production deploy applied 2026-07-09

Ford approved the deploy in chat with "i approve."

Committed and pushed:

- Commit: `b8dca12` (`Guard standalone Cincy Voices clips`)
- File shipped: `lib/queries.ts`
- Vercel deployment: `https://cincy-voices-10z0k02uf-work-with-meaning.vercel.app`
- Production aliases confirmed: `https://voices.workwithmean.ing`, `https://cincyvoices.com`, `https://www.cincyvoices.com`, `https://cincy-voices.vercel.app`

Post-deploy URL verification on `https://voices.workwithmean.ing`:

| URL | Result |
|---|---|
| `/vault/will-phillips/clip/5d18916e-72d8-4184-b95d-a08f54eac552` | HTTP 404 |
| `/vault/will-phillips/clip/b3dcb6c7-7c91-43bf-92a4-4e19c71dc872` | HTTP 404 |
| `/vault/dan-keck/clip/7f0001d5-0f86-4359-a58e-08a925062363` | HTTP 404 |
| `/vault/amy-sheehy/clip/f79c1039-3518-44de-872b-4de9bcf0b0fc` | HTTP 200 with `trimStartMs=602540` and `trimEndMs=619080` |

No stale placeholder Mux ID remained in the verified placeholder responses after deploy.
