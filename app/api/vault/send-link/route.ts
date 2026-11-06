import { NextRequest, NextResponse } from 'next/server';
import { getVaultAdmin, verifyOperator } from '@/lib/vault-access';
import { SITE } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const denial = verifyOperator(request.headers.get('authorization'));
  if (denial) return NextResponse.json({ error: denial.error }, { status: denial.status, headers: { 'Cache-Control': 'no-store' } });
  const supabase = getVaultAdmin();
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 });
  }

  const { data: leader, error } = await supabase
    .from('cincy_voices_leaders')
    .select('name, slug, vault_token, visibility')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') return NextResponse.json({ error: 'vault unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  if (!leader || leader.visibility !== 'public') {
    return NextResponse.json({ error: 'leader not found' }, { status: 404 });
  }

  let token = leader.vault_token;

  if (!token) {
    token = crypto.randomUUID();
    const { error: updateError } = await supabase
      .from('cincy_voices_leaders')
      .update({ vault_token: token })
      .eq('slug', slug);
    if (updateError) return NextResponse.json({ error: 'vault unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  const magic_link = `${SITE.url}/vault/${slug}?token=${token}`;

  return NextResponse.json({ name: leader.name, slug, magic_link }, { headers: { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' } });
}
