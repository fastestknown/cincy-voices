import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';

// Separate operator credential. A leader token or signed leader cookie is never
// authority to generate links for other leaders. Fail closed until configured.
export function verifyOperator(authorization: string | null): { status: number; error: string } | null {
  const expected = process.env.VAULT_OPERATOR_SECRET;
  if (!expected || expected.length < 32) return { status: 503, error: 'vault operator unavailable' };
  const provided = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b) ? null : { status: 401, error: 'unauthorized' };
}

export function getVaultAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Vault server credentials not configured');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    // Credential revocation must take effect immediately. Supabase's fetches
    // otherwise participate in Next's server Data Cache across requests/builds.
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
  });
}
