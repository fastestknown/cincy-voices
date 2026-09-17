-- Durable fan-out. Existing submissions are deliberately not emailed retroactively.
alter table public.cv_recommendation_submissions add column sheet_row bigint generated always as identity (start with 2) unique;
create table public.cv_recommendation_deliveries (
  submission_id uuid not null references public.cv_recommendation_submissions(id),
  kind text not null check (kind in ('owner_email','thank_you','sheet')),
  state text not null default 'pending' check (state in ('pending','processing','accepted','needs_review')),
  attempts integer not null default 0,
  first_attempt_at timestamptz,
  next_attempt_at timestamptz not null default now(),
  lease_until timestamptz,
  lease_token uuid,
  provider_receipt text,
  last_error text,
  accepted_at timestamptz,
  primary key (submission_id,kind)
);
alter table public.cv_recommendation_deliveries enable row level security;
revoke all on public.cv_recommendation_deliveries from public,anon,authenticated;
grant select,insert,update on public.cv_recommendation_deliveries to service_role;
grant usage,select on sequence public.cv_recommendation_submissions_sheet_row_seq to service_role;
create function public.cv_queue_recommendation_delivery() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  insert into public.cv_recommendation_deliveries(submission_id,kind)
  select new.id,kind from unnest(array['owner_email','thank_you','sheet']) kind;
  return new;
end;
$$;
revoke all on function public.cv_queue_recommendation_delivery() from public,anon,authenticated;
create trigger cv_queue_recommendation_delivery after insert on public.cv_recommendation_submissions
for each row execute function public.cv_queue_recommendation_delivery();

create function public.cv_claim_recommendation_deliveries(p_id uuid default null) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare result jsonb;
begin
  -- Resend keeps idempotency keys for 24h. Hold uncertain old sends for reconciliation.
  update public.cv_recommendation_deliveries set state='needs_review',last_error='email_retry_window_expired'
  where kind <> 'sheet' and state in ('pending','processing')
    and first_attempt_at < now()-interval '23 hours'
    and (lease_until is null or lease_until < now());
  with candidates as (
    select submission_id,kind from public.cv_recommendation_deliveries
    where (p_id is null or submission_id=p_id)
      and ((state='pending' and next_attempt_at<=now()) or (state='processing' and lease_until<now()))
    order by next_attempt_at for update skip locked limit 3
  ), claimed as (
    update public.cv_recommendation_deliveries d set state='processing',attempts=d.attempts+1,
      first_attempt_at=coalesce(d.first_attempt_at,now()),lease_until=now()+interval '5 minutes',lease_token=gen_random_uuid()
    from candidates c where d.submission_id=c.submission_id and d.kind=c.kind returning d.*
  ) select coalesce(jsonb_agg(to_jsonb(c)||jsonb_build_object('submission',s.submission,'created_at',s.created_at,'sheet_row',s.sheet_row)),'[]'::jsonb)
  into result from claimed c join public.cv_recommendation_submissions s on s.id=c.submission_id;
  return result;
end;
$$;
create function public.cv_finish_recommendation_delivery(p_id uuid,p_kind text,p_token uuid,p_receipt text default null,p_error text default null,p_hold boolean default false) returns boolean
language plpgsql security invoker set search_path = '' as $$
begin
  update public.cv_recommendation_deliveries set
    state=case when p_receipt is not null then 'accepted' when p_hold or attempts>=12 then 'needs_review' else 'pending' end,
    provider_receipt=p_receipt,last_error=p_error,accepted_at=case when p_receipt is not null then now() end,
    next_attempt_at=now()+make_interval(secs=>least(3600,30*power(2,least(attempts,7)))::int),lease_until=null
  where submission_id=p_id and kind=p_kind and state='processing' and lease_token=p_token;
  return found;
end;
$$;
revoke all on function public.cv_claim_recommendation_deliveries(uuid) from public,anon,authenticated;
revoke all on function public.cv_finish_recommendation_delivery(uuid,text,uuid,text,text,boolean) from public,anon,authenticated;
grant execute on function public.cv_claim_recommendation_deliveries(uuid) to service_role;
grant execute on function public.cv_finish_recommendation_delivery(uuid,text,uuid,text,text,boolean) to service_role;

create function public.cv_recommendation_delivery_health() returns jsonb
language sql security invoker set search_path='' as $$
 select jsonb_build_object('needs_review',count(*) filter(where state='needs_review'),
 'pending',count(*) filter(where state='pending'),'processing',count(*) filter(where state='processing'),
 'accepted',count(*) filter(where state='accepted')) from public.cv_recommendation_deliveries;
$$;
revoke all on function public.cv_recommendation_delivery_health() from public,anon,authenticated;
grant execute on function public.cv_recommendation_delivery_health() to service_role;
