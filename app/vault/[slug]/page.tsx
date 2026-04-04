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
