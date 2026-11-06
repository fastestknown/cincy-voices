# WWM-215 release checklist

This patch is based on the exact older-site production commit
`1c3f2ab5842c015808dbdd519606dcf8ba5d4a39`. It does not deploy the 2026 portal candidate.

## Verified local repair

- `send-link` requires a dedicated server-side `VAULT_OPERATOR_SECRET` bearer
  credential of at least 32 characters before any database call. Query-string
  credentials and attendee cookies do not authorize the operator.
- Five public leader queries use an explicit projection without `vault_token`.
- Token reads and writes use a server-only service-role client. Existing public
  visibility restrictions remain explicit even with this privileged client.
- Cookies bind to the current token digest. Rotation invalidates old links and
  sessions; legacy cookies fail closed. No change to intentionally public clip pages.
- ACL migration removes table-level and token-column access from PUBLIC, anon
  and authenticated, preserves explicit public fields and existing RLS policies.

## Exact production approval still required

Target older Vercel project `prj_ys0cnPdfrf6ppFrJ0pry0ZMpqBpG`, domain
`voices.workwithmean.ing`. Observed deployment before repair:
`dpl_DGJH8MfxcRQyYBzn8gH2j91R1Cqt`.

1. Confirm no parallel older-site writer and refresh the current deployment pin.
2. Configure a new strong `VAULT_OPERATOR_SECRET` and the existing project's
   `SUPABASE_SERVICE_ROLE_KEY` only as server-side Vercel environment variables.
   Keep `VAULT_SECRET`. Do not print, commit or expose any secret with NEXT_PUBLIC.
3. Deploy only this exact repaired older-site source, with public projection
   changes present before applying column ACLs. This deployment alone does not
   close direct database access, so complete the following steps together.
4. Recheck shared-table consumers for wildcard leader queries, including the
   current 2026 portal's deployed source, before changing shared database ACLs.
5. Apply `20261106180000_protect_vault_credentials.sql` to the existing shared
   project `ugjoexqisnustucbdbqe`. Verify anon/authenticated cannot select or modify
   `vault_token`, public profile fields still render, privileged vault reads work,
   and unrelated portal flows remain healthy.
6. Run `supabase/operations/rotate_legacy_vault_tokens.sql`. Retain a protected
   operational count receipt, never old/new token values in logs, chat or issues.
   Tokens must not be restored by rollback because old values may be compromised.
7. Verify unauthenticated/wrong-credential send-link denies without a link; valid
   operator returns a usable replacement link. Test with an authorized synthetic
   or staff-owned leader, never impersonate an attendee. Confirm old token and
   cookie rejection, new authorized access, and public profile/clip compatibility.
8. Ensure old cached pages and deployment URLs cannot restore effective access.
   Old static pages may contain revoked tokens; do not re-enable token-column reads.
9. Obtain separate exact recipient/content approval before any leader resend.
   Keep WWM-215 open until live denial, rotation and authorized new-link delivery
   are verified. This code patch alone is not a live-incident closure.

Operator request after deployment: GET `/api/vault/send-link?slug=<leader>`
with `Authorization: Bearer <dedicated operator credential>`. Its response is
sensitive; never paste it into a public issue, chat, analytics or shared logs.

## Verification commands

- `node --test tests/vault-security.test.cjs`
- `node node_modules/typescript/bin/tsc --noEmit --incremental false`
- Targeted Next ESLint on changed application files
- `node --env-file=<existing-local-environment> node_modules/next/dist/bin/next build`
- `tests/vault-credentials.sql`: fixture setup, candidate migration, then assertions
  in a disposable network-none PostgreSQL 17 container only

The prior deployment is a recovery reference, not a safe security rollback.
On release failure, fail vault access closed and retain restrictive ACLs plus
rotated tokens. Do not reactivate vulnerable token disclosure to restore service.
