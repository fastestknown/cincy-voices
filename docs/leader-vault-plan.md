# Leader Vault - Implementation Plan

**Goal:** Build magic-link-gated content kit pages for each Cincy Voices leader, with public standalone shareable clip pages and one-click LinkedIn sharing.

**Architecture:** Token validation happens in a dedicated API route (`/api/vault/auth`) that sets a signed HMAC cookie then redirects to the vault page. The vault page (`/vault/[slug]`) reads and validates the cookie server-side. Standalone clip pages (`/vault/[slug]/clip/[segmentId]`) are fully public with OG tags for social previews.

**Tech Stack:** Next.js 14 App Router, Supabase (anon client), Mux thumbnails via `image.mux.com`, Web Crypto API (no extra packages for HMAC signing), Tailwind CSS.

---

## File Map

**New files:**
- `lib/vault-auth.ts` -- HMAC cookie sign/verify helpers
- `lib/queries.ts` -- add `getLeaderVaultClips()` and `getSegmentById()`
- `lib/types.ts` -- add `VaultSegment` type
- `app/api/vault/auth/route.ts` -- validates magic link token, sets cookie, redirects
- `app/api/vault/send-link/route.ts` -- generates magic link for a slug
- `app/vault/[slug]/page.tsx` -- vault page (reads cookie, renders content)
- `app/vault/[slug]/clip/[segmentId]/page.tsx` -- public standalone clip page
- `components/vault/vault-header.tsx` -- leader header for vault page
- `components/vault/vault-clip-card.tsx` -- clip card with share actions
- `components/vault/clip-share-bar.tsx` -- LinkedIn/copy/embed client component

**Modified files:**
- `lib/types.ts` -- add `VaultSegment`
- `lib/queries.ts` -- add two queries
- `.env.local` -- add `VAULT_SECRET`

---

## Task 1: DB Migration

**Files:**
- Run SQL via Supabase MCP

- [ ] **Step 1: Add vault_token column**

Run in Supabase:
```sql
ALTER TABLE cincy_voices_leaders
  ADD COLUMN vault_token uuid DEFAULT gen_random_uuid();
```

- [ ] **Step 2: Verify all leaders got tokens**

```sql
SELECT slug, vault_token FROM cincy_voices_leaders ORDER BY name;
```

Expected: 17 rows, each with a non-null UUID in vault_token.

---

## Task 2: Env Variable

**Files:**
- `.env.local`

- [ ] **Step 1: Generate a secret and add to .env.local**

```bash
openssl rand -base64 32
```

Copy the output, then add to `.env.local`:
```
VAULT_SECRET=<paste-output-here>
```

- [ ] **Step 2: Add to Vercel**

```bash
npx vercel env add VAULT_SECRET production
```

Paste the same value when prompted.

---

## Task 3: Vault Auth Helpers

**Files:**
- Create: `lib/vault-auth.ts`

This module signs and verifies the session cookie using HMAC-SHA256 via the Web Crypto API. No extra packages needed.

Cookie format: `slug|expiry_ts|base64_signature`

- [ ] **Step 1: Create `lib/vault-auth.ts`**

```typescript
const COOKIE_NAME = 'vault_session';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.VAULT_SECRET;
  if (!secret) throw new Error('VAULT_SECRET not set');
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signCookie(slug: string): Promise<string> {
  const expiry = Date.now() + THIRTY_DAYS_MS;
  const message = `${slug}|${expiry}`;
  const key = await getKey();
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  const b64 = Buffer.from(sig).toString('base64url');
  return `${message}|${b64}`;
}

export async function verifyCookie(cookie: string): Promise<string | null> {
  try {
    const parts = cookie.split('|');
    if (parts.length !== 3) return null;
    const [slug, expiryStr, b64] = parts;
    const expiry = parseInt(expiryStr, 10);
    if (Date.now() > expiry) return null;
    const message = `${slug}|${expiry}`;
    const key = await getKey();
    const sig = Buffer.from(b64, 'base64url');
    const valid = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(message));
    return valid ? slug : null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
```

- [ ] **Step 2: Commit**

```bash
git add lib/vault-auth.ts .env.local
git commit -m "feat(vault): cookie signing helpers + VAULT_SECRET"
```

---

## Task 4: Types + Queries

**Files:**
- Modify: `lib/types.ts`
- Modify: `lib/queries.ts`

- [ ] **Step 1: Add `VaultSegment` to `lib/types.ts`**

Add after the existing `Segment` interface:

```typescript
export interface VaultSegment extends Segment {
  topic_name: string | null;
  topic_slug: string | null;
  topic_color: string | null;
  duration_ms: number | null;
}
```

- [ ] **Step 2: Add `getLeaderVaultClips()` to `lib/queries.ts`**

Add at the bottom of the file:

```typescript
// ── Vault ─────────────────────────────────────────────

export async function getLeaderVaultClips(leaderId: string): Promise<VaultSegment[]> {
  const { data: segments } = await supabase
    .from('cincy_voices_segments')
    .select('*')
    .eq('leader_id', leaderId)
    .not('mux_playback_id', 'is', null)
    .neq('source_id', LIVE_STREAM_SOURCE_ID)
    .gte('clip_quality_score', 5)
    .order('clip_quality_score', { ascending: false });

  if (!segments?.length) return [];

  // Get topic tags via thread_items
  const segmentIds = segments.map(s => s.id);
  const { data: threadItems } = await supabase
    .from('cincy_voices_thread_items')
    .select('segment_id, topic_id')
    .in('segment_id', segmentIds);

  const topicIds = Array.from(new Set((threadItems ?? []).map(ti => ti.topic_id)));
  const { data: topics } = await supabase
    .from('cincy_voices_topics')
    .select('id, slug, name, color')
    .in('id', topicIds);

  const topicMap = new Map((topics ?? []).map(t => [t.id, t]));
  const segmentTopicMap = new Map<string, { slug: string; name: string; color: string }>();
  (threadItems ?? []).forEach(ti => {
    if (!segmentTopicMap.has(ti.segment_id)) {
      const topic = topicMap.get(ti.topic_id);
      if (topic) segmentTopicMap.set(ti.segment_id, topic);
    }
  });

  return segments.map(s => {
    const topic = segmentTopicMap.get(s.id);
    const durationMs = s.end_time_ms && s.start_time_ms
      ? s.end_time_ms - s.start_time_ms
      : null;
    return {
      ...s,
      topic_name: topic?.name ?? null,
      topic_slug: topic?.slug ?? null,
      topic_color: topic?.color ?? null,
      duration_ms: durationMs,
    };
  });
}

export async function getSegmentById(segmentId: string): Promise<VaultSegment | null> {
  const { data: segment } = await supabase
    .from('cincy_voices_segments')
    .select('*')
    .eq('id', segmentId)
    .single();

  if (!segment) return null;

  const { data: threadItem } = await supabase
    .from('cincy_voices_thread_items')
    .select('topic_id')
    .eq('segment_id', segmentId)
    .limit(1)
    .maybeSingle();

  let topic = null;
  if (threadItem?.topic_id) {
    const { data } = await supabase
      .from('cincy_voices_topics')
      .select('id, slug, name, color')
      .eq('id', threadItem.topic_id)
      .single();
    topic = data;
  }

  const durationMs = segment.end_time_ms && segment.start_time_ms
    ? segment.end_time_ms - segment.start_time_ms
    : null;

  return {
    ...segment,
    topic_name: topic?.name ?? null,
    topic_slug: topic?.slug ?? null,
    topic_color: topic?.color ?? null,
    duration_ms: durationMs,
  };
}
```

Also add `VaultSegment` to the import at the top of `lib/queries.ts`:
```typescript
import type { Leader, Topic, Segment, Quote, LeaderWithTopics, ThreadItemWithContent, TopicWithStats, VaultSegment } from './types';
```

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts lib/queries.ts
git commit -m "feat(vault): add VaultSegment type and vault queries"
```

---

## Task 5: API Routes

**Files:**
- Create: `app/api/vault/auth/route.ts`
- Create: `app/api/vault/send-link/route.ts`

### `/api/vault/auth` -- validates token, sets cookie, redirects

- [ ] **Step 1: Create `app/api/vault/auth/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { signCookie, COOKIE_NAME } from '@/lib/vault-auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const token = searchParams.get('token');

  if (!slug || !token) {
    return NextResponse.redirect(new URL('/vault/invalid', request.url));
  }

  const { data: leader } = await supabase
    .from('cincy_voices_leaders')
    .select('slug, vault_token')
    .eq('slug', slug)
    .single();

  if (!leader || leader.vault_token !== token) {
    return NextResponse.redirect(new URL('/vault/invalid', request.url));
  }

  const cookieValue = await signCookie(slug);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    path: '/',
  });

  return NextResponse.redirect(new URL(`/vault/${slug}`, request.url));
}
```

### `/api/vault/send-link` -- generates magic link for Ford to send

- [ ] **Step 2: Create `app/api/vault/send-link/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SITE } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 });
  }

  const { data: leader } = await supabase
    .from('cincy_voices_leaders')
    .select('name, slug, vault_token')
    .eq('slug', slug)
    .single();

  if (!leader) {
    return NextResponse.json({ error: 'leader not found' }, { status: 404 });
  }

  let token = leader.vault_token;

  // Generate token if missing
  if (!token) {
    token = crypto.randomUUID();
    await supabase
      .from('cincy_voices_leaders')
      .update({ vault_token: token })
      .eq('slug', slug);
  }

  const magic_link = `${SITE.url}/api/vault/auth?slug=${slug}&token=${token}`;

  return NextResponse.json({ name: leader.name, slug, magic_link });
}
```

- [ ] **Step 3: Create the invalid token page `app/vault/invalid/page.tsx`**

```typescript
import Link from 'next/link';

export default function VaultInvalidPage() {
  return (
    <div className="min-h-screen bg-cv-dark flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-mono-label text-cv-gold text-xs tracking-widest mb-4">CINCY VOICES</p>
        <h1 className="font-display text-3xl text-white mb-4">Link expired or invalid</h1>
        <p className="text-white/60 font-body mb-8">
          This link is no longer valid. Contact Ford at{' '}
          <a href="mailto:ford@workwithmean.ing" className="text-cv-gold underline">
            ford@workwithmean.ing
          </a>{' '}
          to get a fresh one.
        </p>
        <Link href="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">
          Back to Cincy Voices
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/api/vault/ app/vault/invalid/
git commit -m "feat(vault): auth route, send-link route, invalid page"
```

---

## Task 6: Vault Components

**Files:**
- Create: `components/vault/vault-header.tsx`
- Create: `components/vault/clip-share-bar.tsx`
- Create: `components/vault/vault-clip-card.tsx`

### `vault-header.tsx` -- leader identity block at top of vault page

- [ ] **Step 1: Create `components/vault/vault-header.tsx`**

```typescript
import Link from 'next/link';
import type { Leader } from '@/lib/types';

interface VaultHeaderProps {
  leader: Leader;
  clipCount: number;
}

export function VaultHeader({ leader, clipCount }: VaultHeaderProps) {
  const headshotUrl = leader.headshot_drive_folder_id
    ? `https://drive.google.com/thumbnail?id=${leader.headshot_drive_folder_id}&sz=w400`
    : null;

  return (
    <div className="bg-cv-dark border-b border-white/10 px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start gap-6">
          {headshotUrl && (
            <img
              src={headshotUrl}
              alt={leader.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-cv-gold/30 shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-mono-label text-cv-gold text-xs tracking-widest mb-1">
              YOUR CINCY VOICES CONTENT KIT
            </p>
            <h1 className="font-display text-2xl sm:text-3xl text-white font-bold">
              {leader.name}
            </h1>
            {(leader.role || leader.company) && (
              <p className="text-white/60 font-body mt-1">
                {[leader.role, leader.company].filter(Boolean).join(', ')}
              </p>
            )}
            <p className="text-white/40 font-body text-sm mt-2">
              {clipCount} clips available to share
            </p>
          </div>
        </div>
        <p className="text-white/50 font-body text-sm mt-6 max-w-2xl">
          These are your clips from Cincy Voices. Share them on LinkedIn, embed them on your website,
          or use them in newsletters. Each clip links back to your full profile.
        </p>
      </div>
    </div>
  );
}
```

### `clip-share-bar.tsx` -- client component for share actions

- [ ] **Step 2: Create `components/vault/clip-share-bar.tsx`**

```typescript
'use client';

import { useState } from 'react';

interface ClipShareBarProps {
  clipUrl: string;
  pullQuote: string;
  leaderSlug: string;
  segmentId: string;
}

export function ClipShareBar({ clipUrl, pullQuote }: ClipShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(clipUrl)}`;
  const embedCode = `<iframe src="${clipUrl}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(clipUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-2 flex-wrap">
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0077B5] text-white text-xs font-body font-medium hover:bg-[#006097] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Share to LinkedIn
        </a>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 text-white text-xs font-body font-medium hover:bg-white/20 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy link'}
        </button>

        <button
          onClick={() => setShowEmbed(e => !e)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 text-white text-xs font-body font-medium hover:bg-white/20 transition-colors"
        >
          {showEmbed ? 'Hide embed' : 'Embed'}
        </button>
      </div>

      {showEmbed && (
        <div className="bg-black/40 rounded-md p-3 border border-white/10">
          <p className="text-white/50 text-xs font-body mb-2">Paste this on your website:</p>
          <code className="text-white/80 text-xs font-mono break-all block mb-2">{embedCode}</code>
          <button
            onClick={handleCopyEmbed}
            className="text-cv-gold text-xs hover:text-cv-gold/80 transition-colors"
          >
            {embedCopied ? 'Copied!' : 'Copy embed code'}
          </button>
        </div>
      )}
    </div>
  );
}
```

### `vault-clip-card.tsx` -- clip card combining player + share bar

- [ ] **Step 3: Create `components/vault/vault-clip-card.tsx`**

```typescript
import { CinematicPlayer } from '@/components/video/cinematic-player';
import { ClipShareBar } from './clip-share-bar';
import { extractPullQuote } from '@/lib/pull-quote';
import { SITE } from '@/lib/constants';
import type { VaultSegment } from '@/lib/types';

interface VaultClipCardProps {
  segment: VaultSegment;
  leaderSlug: string;
  featured?: boolean;
}

function formatDuration(ms: number | null): string {
  if (!ms) return '';
  const secs = Math.round(ms / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VaultClipCard({ segment, leaderSlug, featured = false }: VaultClipCardProps) {
  const pullQuote = extractPullQuote(segment.text);
  const clipUrl = `${SITE.url}/vault/${leaderSlug}/clip/${segment.id}`;

  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden ${featured ? 'col-span-full sm:col-span-1' : ''}`}>
      <div className={featured ? 'aspect-video' : ''}>
        <CinematicPlayer
          playbackId={segment.mux_playback_id!}
          trimStartMs={segment.trim_start_ms}
          trimEndMs={segment.trim_end_ms}
          muted={false}
          className="w-full"
        />
      </div>

      <div className="p-4">
        {segment.topic_name && (
          <span
            className="inline-block text-xs font-mono-label tracking-widest px-2 py-0.5 rounded-full mb-2"
            style={{ backgroundColor: `${segment.topic_color}22`, color: segment.topic_color ?? '#d4a843' }}
          >
            {segment.topic_name.toUpperCase()}
          </span>
        )}

        <p className={`font-body text-white/80 leading-snug ${featured ? 'text-base' : 'text-sm'}`}>
          "{pullQuote}"
        </p>

        {segment.duration_ms && (
          <p className="text-white/30 text-xs font-body mt-1">
            {formatDuration(segment.duration_ms)}
          </p>
        )}

        <ClipShareBar
          clipUrl={clipUrl}
          pullQuote={pullQuote}
          leaderSlug={leaderSlug}
          segmentId={segment.id}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/vault/
git commit -m "feat(vault): vault-header, clip-share-bar, vault-clip-card components"
```

---

## Task 7: Vault Page

**Files:**
- Create: `app/vault/[slug]/page.tsx`

The page reads the signed cookie, validates it matches this slug, and renders the content. If no valid cookie, redirects to the auth route (which checks for a `?token=` param) or shows an error.

- [ ] **Step 1: Create `app/vault/[slug]/page.tsx`**

```typescript
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getLeaderBySlug, getLeaderVaultClips } from '@/lib/queries';
import { verifyCookie, COOKIE_NAME } from '@/lib/vault-auth';
import { VaultHeader } from '@/components/vault/vault-header';
import { VaultClipCard } from '@/components/vault/vault-clip-card';

export const dynamic = 'force-dynamic';

export default async function VaultPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token } = await searchParams;

  // If token in URL, redirect to auth route to validate + set cookie
  if (token) {
    redirect(`/api/vault/auth?slug=${slug}&token=${token}`);
  }

  // Validate cookie
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(COOKIE_NAME)?.value;
  const authorizedSlug = rawCookie ? await verifyCookie(rawCookie) : null;

  if (authorizedSlug !== slug) {
    redirect('/vault/invalid');
  }

  const leader = await getLeaderBySlug(slug);
  if (!leader) redirect('/vault/invalid');

  const allClips = await getLeaderVaultClips(leader.id);
  const featured = allClips.filter(s => s.clip_quality_score === 10);
  const library = allClips.filter(s => (s.clip_quality_score ?? 0) < 10);

  return (
    <div className="min-h-screen bg-cv-dark">
      <VaultHeader leader={leader} clipCount={allClips.length} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {featured.length > 0 && (
          <section>
            <p className="font-mono-label text-cv-gold text-xs tracking-widest mb-2">FEATURED</p>
            <h2 className="font-display text-2xl text-white font-bold mb-6">Your Best Moments</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {featured.map(segment => (
                <VaultClipCard
                  key={segment.id}
                  segment={segment}
                  leaderSlug={slug}
                  featured
                />
              ))}
            </div>
          </section>
        )}

        {library.length > 0 && (
          <section>
            <p className="font-mono-label text-cv-gold text-xs tracking-widest mb-2">FULL LIBRARY</p>
            <h2 className="font-display text-2xl text-white font-bold mb-6">All Your Clips</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {library.map(segment => (
                <VaultClipCard
                  key={segment.id}
                  segment={segment}
                  leaderSlug={slug}
                />
              ))}
            </div>
          </section>
        )}

        {allClips.length === 0 && (
          <p className="text-white/40 font-body text-center py-20">
            No clips found. Check back after the launch.
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/vault/[slug]/page.tsx"
git commit -m "feat(vault): vault page with cookie auth and clip grid"
```

---

## Task 8: Standalone Clip Page

**Files:**
- Create: `app/vault/[slug]/clip/[segmentId]/page.tsx`

Public page. Full OG tags for LinkedIn/Slack previews.

- [ ] **Step 1: Create `app/vault/[slug]/clip/[segmentId]/page.tsx`**

```typescript
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLeaderBySlug, getSegmentById } from '@/lib/queries';
import { CinematicPlayer } from '@/components/video/cinematic-player';
import { extractPullQuote } from '@/lib/pull-quote';
import { SITE } from '@/lib/constants';

export const revalidate = 3600;

export async function generateMetadata({ params }: {
  params: Promise<{ slug: string; segmentId: string }>;
}): Promise<Metadata> {
  const { slug, segmentId } = await params;
  const [leader, segment] = await Promise.all([
    getLeaderBySlug(slug),
    getSegmentById(segmentId),
  ]);
  if (!leader || !segment || !segment.mux_playback_id) return {};

  const pullQuote = extractPullQuote(segment.text);
  const topic = segment.topic_name ? ` on ${segment.topic_name}` : '';
  const title = `${leader.name}${topic}`;
  const thumbnailUrl = `https://image.mux.com/${segment.mux_playback_id}/thumbnail.jpg?width=1280&height=720&fit_mode=smartcrop`;

  return {
    title,
    description: pullQuote,
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description: pullQuote,
      url: `${SITE.url}/vault/${slug}/clip/${segmentId}`,
      images: [{ url: thumbnailUrl, width: 1280, height: 720, alt: title }],
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: pullQuote,
      images: [thumbnailUrl],
    },
  };
}

export default async function StandaloneClipPage({ params }: {
  params: Promise<{ slug: string; segmentId: string }>;
}) {
  const { slug, segmentId } = await params;
  const [leader, segment] = await Promise.all([
    getLeaderBySlug(slug),
    getSegmentById(segmentId),
  ]);

  if (!leader || !segment || !segment.mux_playback_id) notFound();

  const pullQuote = extractPullQuote(segment.text);
  const headshotUrl = leader.headshot_drive_folder_id
    ? `https://drive.google.com/thumbnail?id=${leader.headshot_drive_folder_id}&sz=w200`
    : null;

  return (
    <div className="min-h-screen bg-cv-dark">
      {/* Minimal nav */}
      <div className="px-4 sm:px-6 py-4 border-b border-white/10">
        <Link href="/" className="font-display text-lg text-white font-bold tracking-tight">
          Cincy Voices
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <CinematicPlayer
          playbackId={segment.mux_playback_id}
          trimStartMs={segment.trim_start_ms}
          trimEndMs={segment.trim_end_ms}
          muted={false}
          autoPlay={false}
          className="w-full mb-8"
        />

        {/* Leader identity */}
        <div className="flex items-center gap-4 mb-6">
          {headshotUrl && (
            <img
              src={headshotUrl}
              alt={leader.name}
              className="w-12 h-12 rounded-full object-cover border border-white/20"
            />
          )}
          <div>
            <p className="font-display text-white font-bold text-lg">{leader.name}</p>
            {(leader.role || leader.company) && (
              <p className="text-white/50 font-body text-sm">
                {[leader.role, leader.company].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Pull quote */}
        <blockquote className="border-l-2 border-cv-gold pl-5 mb-8">
          <p className="font-display text-xl sm:text-2xl text-white/90 leading-snug italic">
            "{pullQuote}"
          </p>
        </blockquote>

        {segment.topic_name && (
          <span
            className="inline-block text-xs font-mono-label tracking-widest px-2 py-0.5 rounded-full mb-6"
            style={{ backgroundColor: `${segment.topic_color}22`, color: segment.topic_color ?? '#d4a843' }}
          >
            {segment.topic_name.toUpperCase()}
          </span>
        )}

        <Link
          href={`/leaders/${slug}`}
          className="inline-flex items-center gap-2 text-cv-gold font-body text-sm hover:text-cv-gold/80 transition-colors"
        >
          Explore more from {leader.name}
          <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/vault/[slug]/clip/"
git commit -m "feat(vault): standalone public clip page with OG tags"
```

---

## Task 9: Test + Deploy

- [ ] **Step 1: Generate magic links for all leaders**

Hit the endpoint for each leader slug:
```
https://voices.workwithmean.ing/api/vault/send-link?slug=meredith-arlinghaus
https://voices.workwithmean.ing/api/vault/send-link?slug=amy-sheehy
(etc. for all 17)
```

Or locally: `http://localhost:3000/api/vault/send-link?slug=meredith-arlinghaus`

Save the `magic_link` values -- these are what you send to each leader.

- [ ] **Step 2: Test the auth flow locally**

```bash
cd ~/cincy-voices && npm run dev
```

1. Open a magic link in browser -- should redirect to `/vault/[slug]` and show clips
2. Close and reopen the vault URL (no token) -- should still work (cookie)
3. Open `/vault/invalid` directly -- should show error page
4. Open `/vault/[slug]/clip/[segmentId]` directly -- should work without auth

- [ ] **Step 3: Test OG tags**

Paste a clip URL into https://www.opengraph.xyz to verify the thumbnail, title, and description render correctly for LinkedIn.

- [ ] **Step 4: Deploy**

```bash
cd ~/cincy-voices && npx vercel deploy --prod --yes
```

- [ ] **Step 5: Generate all magic links on production and save them**

Collect all 17 magic links from the production endpoint. Keep them in a doc to send to each leader in the launch kit emails.
