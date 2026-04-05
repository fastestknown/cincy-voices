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
    <div className="bg-cv-vault border-b border-white/10 px-4 sm:px-6 py-8">
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
