import { NextRequest, NextResponse } from 'next/server';
import { getVaultAdmin } from '@/lib/vault-access';
import { signCookie, COOKIE_NAME } from '@/lib/vault-auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const token = searchParams.get('token');

  if (!slug || !token) {
    return NextResponse.redirect(new URL('/vault/invalid', request.url));
  }

  const { data: leader } = await getVaultAdmin()
    .from('cincy_voices_leaders')
    .select('slug, vault_token, visibility')
    .eq('slug', slug)
    .single();

  if (!leader || leader.visibility !== 'public' || leader.vault_token !== token) {
    return NextResponse.redirect(new URL('/vault/invalid', request.url));
  }

  const cookieValue = await signCookie(slug, token);

  // In Route Handlers, cookies must be set on the response object directly
  const response = NextResponse.redirect(new URL(`/vault/${slug}`, request.url));
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.cookies.set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

  return response;
}
