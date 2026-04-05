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

  if (!token) {
    token = crypto.randomUUID();
    await supabase
      .from('cincy_voices_leaders')
      .update({ vault_token: token })
      .eq('slug', slug);
  }

  const magic_link = `${SITE.url}/vault/${slug}?token=${token}`;

  return NextResponse.json({ name: leader.name, slug, magic_link });
}
