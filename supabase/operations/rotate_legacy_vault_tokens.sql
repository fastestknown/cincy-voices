-- Operational containment, separate from the ACL migration. Requires exact
-- production release approval. Never return tokens into logs or chat.
-- Run after deploying the repaired source and restricting token-column access.
-- Revokes existing links and v2 sessions. Retrieve replacement links only through
-- the authenticated operator route; sending them remains separately approved.
BEGIN;
UPDATE public.cincy_voices_leaders
SET vault_token = gen_random_uuid()
WHERE vault_token IS NOT NULL;
COMMIT;
