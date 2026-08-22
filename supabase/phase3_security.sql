-- Phase 3 security and realtime hardening.
-- Run this migration in Supabase SQL Editor after phase2.sql.

alter table accounts enable row level security;

drop policy if exists "account owners can create their account" on accounts;
create policy "account owners can create their account"
  on accounts for insert
  with check (auth.uid() = id);

drop policy if exists "account owners can update their account" on accounts;
create policy "account owners can update their account"
  on accounts for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "account owners can read their activity" on account_activity;
create policy "account owners can read their activity"
  on account_activity for select
  using (auth.uid() = account_id);

drop policy if exists "account owners can create their activity" on account_activity;
create policy "account owners can create their activity"
  on account_activity for insert
  with check (auth.uid() = account_id);

do $$
begin
  alter publication supabase_realtime add table favorites;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table account_activity;
exception when duplicate_object then null;
end $$;

-- Authenticated account provisioning trigger. The client-side ensureAccount()
-- remains in place for magic-link metadata and anonymous handoff continuity.
create or replace function public.provision_account_for_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.accounts (id, email, account_type)
  values (new.id, lower(new.email), 'client')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_provision_account on auth.users;
create trigger on_auth_user_provision_account
  after insert on auth.users
  for each row execute procedure public.provision_account_for_auth_user();
