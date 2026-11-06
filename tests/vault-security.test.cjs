const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
const crypto = require('node:crypto').webcrypto;

function load(file, mocks = {}) {
  const exports = {};
  const js = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(js, { exports, Buffer, crypto, process, Date, URL, TextEncoder,
    require: name => name in mocks ? mocks[name] : require(name) }, { filename: file });
  return exports;
}
const response = { json: (body, init = {}) => ({ body, status: init.status || 200, headers: init.headers || {} }) };

test('operator rejects missing, wrong, malformed and URL-only authority; separate credential required', () => {
  const access = load('lib/vault-access.ts', { 'server-only': {}, '@supabase/supabase-js': {} });
  delete process.env.VAULT_OPERATOR_SECRET;
  assert.equal(access.verifyOperator(null).status, 503);
  process.env.VAULT_OPERATOR_SECRET = 'short';
  assert.equal(access.verifyOperator('Bearer short').status, 503);
  process.env.VAULT_OPERATOR_SECRET = 'x'.repeat(40);
  for (const value of [null, '', 'Basic xxxx', 'Bearer wrong', 'Bearer ' + 'x'.repeat(41)]) {
    assert.equal(access.verifyOperator(value).status, 401);
  }
  assert.equal(access.verifyOperator('Bearer ' + 'x'.repeat(40)), null);
});

test('link route denies before database access, including credential in query string', async () => {
  let calls = 0;
  const route = load('app/api/vault/send-link/route.ts', {
    'next/server': { NextResponse: response }, '@/lib/constants': { SITE: { url: 'https://example.test' } },
    '@/lib/vault-access': { verifyOperator: () => ({ status: 401, error: 'unauthorized' }), getVaultAdmin: () => { calls++; throw Error('must not query'); } },
  });
  const result = await route.GET({ url: 'https://example.test/api/vault/send-link?slug=alice&secret=anything', headers: new Headers() });
  assert.equal(result.status, 401);
  assert.equal(result.headers['Cache-Control'], 'no-store');
  assert.equal(calls, 0);
  assert.equal(JSON.stringify(result).includes('magic_link'), false);
});

test('authorized operator preserves existing link, creates missing token, and never returns link on database failure', async () => {
  for (const mode of ['existing', 'missing', 'read-error', 'write-error', 'private']) {
    let writes = 0;
    const query = { select() { return this; }, eq() { return this; }, async single() {
      return { data: { name: 'Alice', vault_token: mode === 'existing' ? 'synthetic-token' : null, visibility: mode === 'private' ? 'private' : 'public' }, error: mode === 'read-error' ? { code: 'XX000' } : null };
    }, update() { writes++; return { eq: async () => ({ error: mode === 'write-error' ? {} : null }) }; } };
    const route = load('app/api/vault/send-link/route.ts', {
      'next/server': { NextResponse: response }, '@/lib/constants': { SITE: { url: 'https://example.test' } },
      '@/lib/vault-access': { verifyOperator: () => null, getVaultAdmin: () => ({ from: () => query }) },
    });
    const result = await route.GET({ url: 'https://example.test/api/vault/send-link?slug=alice', headers: new Headers() });
    if (['read-error', 'write-error', 'private'].includes(mode)) {
      assert.notEqual(result.status, 200);
      assert.equal('magic_link' in result.body, false);
    } else {
      assert.equal(result.status, 200);
      assert.match(result.body.magic_link, /^https:\/\/example.test\/vault\/alice\?token=/);
      assert.equal(result.headers['Cache-Control'], 'private, no-store');
      assert.equal(writes, mode === 'missing' ? 1 : 0);
    }
  }
});

test('cookies are scoped, authenticated, expiring and invalidated by token rotation', async () => {
  process.env.VAULT_SECRET = 'synthetic-hmac-key-for-tests-only';
  const auth = load('lib/vault-auth.ts');
  const cookie = await auth.signCookie('alice', 'token-a');
  assert.equal(await auth.verifyCookie(cookie, 'token-a'), 'alice');
  assert.equal(await auth.verifyCookie(cookie, 'token-b'), null);
  assert.equal(await auth.verifyCookie(cookie.replace('alice', 'bob'), 'token-a'), null);
  assert.equal(await auth.verifyCookie(cookie + 'tamper', 'token-a'), null);
  assert.equal(await auth.verifyCookie('alice|9999999999999|old-signature', 'token-a'), null);
  const parts = cookie.split('|');
  parts[2] = 'Infinity';
  assert.equal(await auth.verifyCookie(parts.join('|'), 'token-a'), null);
  const realNow = Date.now;
  try { Date.now = () => realNow() - 31 * 86400000; const expired = await auth.signCookie('alice', 'token-a'); Date.now = realNow; assert.equal(await auth.verifyCookie(expired, 'token-a'), null); }
  finally { Date.now = realNow; }
});

test('public leader paths use explicit allowlist, preserve downloads flag and omit private columns', () => {
  const { PUBLIC_LEADER_COLUMNS } = load('lib/public-leader-columns.ts');
  assert.equal(PUBLIC_LEADER_COLUMNS.includes('vault_token'), false);
  assert.ok(PUBLIC_LEADER_COLUMNS.split(',').includes('downloads_enabled'));
  const source = fs.readFileSync(path.join(__dirname, '../lib/queries.ts'), 'utf8');
  const projections = [...source.matchAll(/\.from\('cincy_voices_leaders'\)\s*\.select\(([^)]*)\)/g)].map(m => m[1]);
  assert.equal(projections.filter(p => p === 'PUBLIC_LEADER_COLUMNS').length, 5);
  assert.ok(projections.every(p => !p.includes('*') && !p.includes('vault_token')));
});
