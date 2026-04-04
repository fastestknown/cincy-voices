# Leader Vault - Spec

## Overview

Password-free, magic-link-gated content kit pages for each Cincy Voices leader. Leaders get a private URL giving them access to all their clips, organized for easy browsing and one-click sharing to LinkedIn, social, or their own website.

---

## Routes

| Route | Auth | Purpose |
|---|---|---|
| `/vault/[slug]` | Magic link token (cookie session) | Leader's private content kit |
| `/vault/[slug]/clip/[segmentId]` | Public (no auth) | Standalone shareable clip page |
| `/api/vault/send-link` | Internal (server-only) | Generate + return magic link for a leader |

---

## Database Change

Add one column to `cincy_voices_leaders`:

```sql
ALTER TABLE cincy_voices_leaders ADD COLUMN vault_token uuid DEFAULT gen_random_uuid();
```

The magic link is: `voices.workwithmean.ing/vault/[slug]?token=[vault_token]`

---

## Auth Flow

1. Leader opens their magic link (`/vault/[slug]?token=...`)
2. Server validates token against `cincy_voices_leaders.vault_token` for that slug
3. On match: set a signed `vault_session` cookie (30-day expiry) and redirect to `/vault/[slug]` (no token in URL)
4. On subsequent visits: cookie is validated server-side, leader stays in without the link
5. On mismatch: show a friendly "Invalid or expired link" page with instructions to contact Ford

Cookie is signed using `VAULT_SECRET` env var (add to `.env.local` and Vercel).

No email infrastructure needed. Ford copies the link from the API response and pastes it into his email to each leader.

---

## `/vault/[slug]` - Leader Content Kit Page

### Header
- Leader headshot, name, role, company
- Cincy Voices logo (small, top left)
- Dark background, gold accents, matches public site design language
- Tagline: "Your Cincy Voices Content Kit"

### Clip Sections

**Featured Clips** (clip_quality_score = 10)
- Shown first
- Larger cards with video player prominent, pull quote in large type below
- "Your best moments" framing

**Full Library** (clip_quality_score 5-9)
- Grid of smaller cards below featured section
- Filterable by topic tag (Trust & Relationships, Client Impact, etc.)
- Sorted by quality score descending

### Clip Card (both sections)
- Mux thumbnail with play-on-hover
- Pull quote (from segment `text` field via `extractPullQuote()`)
- Topic tag badge(s)
- Duration
- Three actions:
  - **Share to LinkedIn** -- opens `linkedin.com/sharing/share-offsite/?url=[clip-url]&summary=[encoded-quote]`
  - **Copy link** -- copies `/vault/[slug]/clip/[segmentId]` to clipboard, button text changes to "Copied!"
  - **Embed** -- expands inline to show copyable `<iframe>` snippet

---

## `/vault/[slug]/clip/[segmentId]` - Standalone Clip Page

**Public. No auth.**

Layout:
- Full-width MuxPlayer (16:9, with controls, unmuted)
- Leader headshot + name + role below player
- Pull quote in large serif type
- "Explore more from [Name]" link to public `/leaders/[slug]` page
- Minimal nav -- just Cincy Voices wordmark, no site menu

OG tags (for LinkedIn/Slack/email previews):
- `og:title` -- "[Leader Name] on [topic]"
- `og:description` -- pull quote
- `og:image` -- Mux thumbnail URL (`image.mux.com/[playbackId]/thumbnail.jpg`)
- `og:url` -- canonical clip URL

Embed snippet (shown on vault page, not this page):
```html
<iframe src="https://voices.workwithmean.ing/vault/[slug]/clip/[segmentId]" width="100%" height="400" frameborder="0" allowfullscreen></iframe>
```

---

## `/api/vault/send-link` - Magic Link Generator

Internal endpoint. GET request with `?slug=meredith-arlinghaus`.

1. Looks up leader by slug
2. If `vault_token` is null, generates one with `crypto.randomUUID()` and writes to DB
3. Returns JSON: `{ name, slug, magic_link }`

Ford copies the `magic_link` value and sends it to the leader directly.

No authentication on this endpoint (internal use only, not linked from anywhere public). Can add a simple `ADMIN_KEY` header check if desired.

---

## New Files

```
app/
  vault/
    [slug]/
      page.tsx          -- vault page (server component, validates cookie)
      clip/
        [segmentId]/
          page.tsx      -- standalone clip page (public, SSG-friendly)
app/
  api/
    vault/
      send-link/
        route.ts        -- magic link generator
lib/
  vault-auth.ts         -- cookie validation helpers
components/
  vault/
    vault-clip-card.tsx -- clip card with share/copy/embed actions
    vault-header.tsx    -- leader header for vault page
    clip-share-bar.tsx  -- LinkedIn share + copy link + embed actions
    standalone-clip.tsx -- layout for /vault/[slug]/clip/[segmentId]
```

---

## Queries Needed

- `getLeaderBySlug(slug)` -- already exists
- `getLeaderVaultClips(leaderId)` -- all segments with `mux_playback_id`, `clip_quality_score >= 5`, ordered by score desc. Returns topic tags joined.
- `getSegmentById(segmentId)` -- for standalone clip page

---

## Environment Variables

| Var | Purpose |
|---|---|
| `VAULT_SECRET` | Signs session cookies (32+ char random string) |

---

## Out of Scope

- Email delivery of magic links (Ford sends manually)
- Analytics on vault page views (future)
- Leader ability to download video files (future)
- Admin dashboard to manage tokens (future)
