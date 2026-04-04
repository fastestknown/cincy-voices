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
