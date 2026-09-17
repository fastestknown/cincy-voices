-- Private moderation inbox. Apply to production only as part of an approved release.
create table public.cv_recommendation_submissions (
  id uuid primary key,
  leader_slug text not null check (leader_slug in ('amy-connor', 'kevin-lawson')),
  email text not null,
  submission jsonb not null check (coalesce(submission->>'consent' = 'true' and submission->>'consentVersion' = '2026-09-17-v1', false)),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending','approved','rejected','withdrawn')),
  reviewed_at timestamptz,
  review_note text
);
alter table public.cv_recommendation_submissions enable row level security;
revoke all on public.cv_recommendation_submissions from public, anon, authenticated;
grant select, insert, update, delete on public.cv_recommendation_submissions to service_role;
create index cv_recommendation_email_time on public.cv_recommendation_submissions(email, created_at);
create function public.cv_submit_recommendation(p_submission jsonb) returns uuid
language plpgsql security invoker set search_path = '' as $$
declare
  existing jsonb;
  request_id uuid := (p_submission->>'id')::uuid;
  contributor_email text := lower(p_submission->>'email');
begin
  perform pg_advisory_xact_lock(hashtextextended(contributor_email, 0));
  select submission into existing from public.cv_recommendation_submissions where id = request_id;
  if found then
    if existing = p_submission then return request_id; end if;
    raise exception 'id_conflict';
  end if;
  if (select count(*) from public.cv_recommendation_submissions where email = contributor_email and created_at > now() - interval '24 hours') >= 3 then
    raise exception 'rate_limit';
  end if;
  insert into public.cv_recommendation_submissions(id, leader_slug, email, submission)
  values (request_id, p_submission->>'leaderSlug', contributor_email, p_submission);
  return request_id;
end;
$$;
revoke all on function public.cv_submit_recommendation(jsonb) from public, anon, authenticated;
grant execute on function public.cv_submit_recommendation(jsonb) to service_role;
