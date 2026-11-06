-- Apply only alongside the explicit public projections and server-only vault client.
-- RLS row visibility alone does not hide the vault_token column.
BEGIN;
REVOKE SELECT, INSERT, UPDATE, REFERENCES ON public.cincy_voices_leaders FROM PUBLIC, anon, authenticated;
REVOKE SELECT (vault_token), INSERT (vault_token), UPDATE (vault_token), REFERENCES (vault_token)
  ON public.cincy_voices_leaders FROM PUBLIC, anon, authenticated;
GRANT SELECT (id,name,role,company,leader_profile_id,headshot_drive_folder_id,
  expertise_tags,bio_summary,created_at,updated_at,slug,hero_quote,hero_segment_id,
  micro_clip_url,website_url,linkedin_url,downloads_enabled,visibility,cohort)
  ON public.cincy_voices_leaders TO anon, authenticated;
-- Keep privileged reads/writes on the server. Existing row policies are unchanged.
GRANT SELECT, UPDATE (vault_token) ON public.cincy_voices_leaders TO service_role;
COMMIT;
