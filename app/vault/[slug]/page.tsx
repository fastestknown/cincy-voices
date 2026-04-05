import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getLeaderBySlug, getLeaderVaultClips, getLeaderSources } from '@/lib/queries';
import { verifyCookie, COOKIE_NAME } from '@/lib/vault-auth';
import { VaultHeader } from '@/components/vault/vault-header';
import { VaultClipCard } from '@/components/vault/vault-clip-card';

export const dynamic = 'force-dynamic';

function formatDuration(secs: number | null): string {
  if (!secs) return '';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

export default async function VaultPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token } = await searchParams;

  if (token) {
    redirect(`/api/vault/auth?slug=${slug}&token=${token}`);
  }

  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(COOKIE_NAME)?.value;
  const authorizedSlug = rawCookie ? await verifyCookie(rawCookie) : null;

  if (authorizedSlug !== slug) {
    redirect('/vault/invalid');
  }

  const leader = await getLeaderBySlug(slug);
  if (!leader) redirect('/vault/invalid');

  const downloadsEnabled = (leader as unknown as { downloads_enabled: boolean }).downloads_enabled ?? false;

  const [allClips, sources] = await Promise.all([
    getLeaderVaultClips(leader.id),
    downloadsEnabled ? getLeaderSources(leader.id) : Promise.resolve([]),
  ]);

  const featured = allClips.filter(s => s.clip_quality_score === 10);
  const library = allClips.filter(s => (s.clip_quality_score ?? 0) < 10);

  const soloSources = sources.filter(s => s.source_type === 'solo_clip');
  const panelSources = sources.filter(s => s.source_type === 'panel' || s.source_type === 'pre_show');

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
                  downloadsEnabled={downloadsEnabled}
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
                  downloadsEnabled={downloadsEnabled}
                />
              ))}
            </div>
          </section>
        )}

        {downloadsEnabled && sources.length > 0 && (
          <section>
            <p className="font-mono-label text-cv-gold text-xs tracking-widest mb-2">RAW SOURCE FILES</p>
            <h2 className="font-display text-2xl text-white font-bold mb-2">Download Full Episodes</h2>
            <p className="text-white/50 font-body text-sm mb-6">
              These are the complete, unedited recordings. Large files -- best downloaded on Wi-Fi.
            </p>
            <div className="space-y-3">
              {soloSources.length > 0 && soloSources.map(source => (
                <a
                  key={source.id}
                  href={`https://stream.mux.com/${source.mux_master_playback_id}/highest.mp4`}
                  download
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:bg-white/10 transition-colors group"
                >
                  <div>
                    <p className="font-mono-label text-cv-gold text-xs tracking-widest mb-0.5">SOLO SESSION</p>
                    <p className="font-body text-white font-medium">{source.title}</p>
                    {source.duration_seconds && (
                      <p className="text-white/40 text-xs font-body mt-0.5">{formatDuration(source.duration_seconds)}</p>
                    )}
                  </div>
                  <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current text-white/40 group-hover:text-cv-gold transition-colors shrink-0 ml-4">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              ))}
              {panelSources.map(source => (
                <a
                  key={source.id}
                  href={`https://stream.mux.com/${source.mux_master_playback_id}/highest.mp4`}
                  download
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:bg-white/10 transition-colors group"
                >
                  <div>
                    <p className="font-mono-label text-white/30 text-xs tracking-widest mb-0.5">PANEL EPISODE</p>
                    <p className="font-body text-white font-medium">{source.title}</p>
                    {source.duration_seconds && (
                      <p className="text-white/40 text-xs font-body mt-0.5">{formatDuration(source.duration_seconds)}</p>
                    )}
                  </div>
                  <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current text-white/40 group-hover:text-cv-gold transition-colors shrink-0 ml-4">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
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
