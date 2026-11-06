-- Disposable PostgreSQL only; never run fixture setup on a real project.
CREATE ROLE anon;
CREATE ROLE authenticated;
CREATE ROLE service_role BYPASSRLS;
CREATE TABLE public.cincy_voices_leaders (
  id uuid DEFAULT gen_random_uuid(), name text, role text, company text,
  leader_profile_id uuid, headshot_drive_folder_id text, expertise_tags text[],
  bio_summary text, created_at timestamptz, updated_at timestamptz, slug text,
  hero_quote text, hero_segment_id uuid, micro_clip_url text, website_url text,
  linkedin_url text, vault_token uuid DEFAULT gen_random_uuid(),
  downloads_enabled boolean, visibility text, cohort text
);
ALTER TABLE public.cincy_voices_leaders ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_read ON public.cincy_voices_leaders FOR SELECT USING (visibility = 'public');
GRANT ALL ON public.cincy_voices_leaders TO anon, authenticated, service_role;
INSERT INTO public.cincy_voices_leaders (name,slug,visibility,downloads_enabled)
VALUES ('Synthetic public','synthetic-public','public',true),('Synthetic private','synthetic-private','private',false);
-- Apply the candidate migration here before executing the assertions below.
-- ASSERTIONS
SET ROLE anon;
DO $$ BEGIN
  IF (SELECT count(name) FROM public.cincy_voices_leaders) <> 1 THEN RAISE EXCEPTION 'public read regression'; END IF;
  BEGIN PERFORM vault_token FROM public.cincy_voices_leaders; RAISE EXCEPTION 'token disclosed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN EXECUTE 'SELECT * FROM public.cincy_voices_leaders'; RAISE EXCEPTION 'wildcard disclosed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN UPDATE public.cincy_voices_leaders SET vault_token=gen_random_uuid(); RAISE EXCEPTION 'token writable'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SET ROLE authenticated;
DO $$ BEGIN
  IF (SELECT count(name) FROM public.cincy_voices_leaders) <> 1 THEN RAISE EXCEPTION 'authenticated read regression'; END IF;
  BEGIN PERFORM vault_token FROM public.cincy_voices_leaders; RAISE EXCEPTION 'authenticated token disclosed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SET ROLE service_role;
DO $$ BEGIN
  IF (SELECT count(vault_token) FROM public.cincy_voices_leaders) <> 2 THEN RAISE EXCEPTION 'server read regression'; END IF;
  UPDATE public.cincy_voices_leaders SET vault_token=gen_random_uuid() WHERE slug='synthetic-public';
END $$;
RESET ROLE;
