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
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

  return NextResponse.redirect(new URL(`/vault/${slug}`, request.url));
}
