-- The Dwarica Group / Phase 3 private command center schema
-- Run this migration in the Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  entity_name text,
  accreditation_tier text,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  saved_allocations jsonb not null default '[]'::jsonb,
  inquiries jsonb not null default '[]'::jsonb,
  consignments jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.user_affinity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_budget numeric not null default 50000,
  brand_weights jsonb not null default '{}'::jsonb,
  telemetry_logs jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists vault_activity_user_id_idx on public.vault_activity (user_id);
create index if not exists user_affinity_user_id_idx on public.user_affinity (user_id);

alter table public.profiles enable row level security;
alter table public.vault_activity enable row level security;
alter table public.user_affinity enable row level security;

drop policy if exists "Profiles are self-readable" on public.profiles;
create policy "Profiles are self-readable" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Profiles are self-writable" on public.profiles;
create policy "Profiles are self-writable" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Profiles are self-updatable" on public.profiles;
create policy "Profiles are self-updatable" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Vault activity is self-readable" on public.vault_activity;
create policy "Vault activity is self-readable" on public.vault_activity for select using (auth.uid() = user_id);
drop policy if exists "Vault activity is self-writable" on public.vault_activity;
create policy "Vault activity is self-writable" on public.vault_activity for insert with check (auth.uid() = user_id);
drop policy if exists "Vault activity is self-updatable" on public.vault_activity;
create policy "Vault activity is self-updatable" on public.vault_activity for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "User affinity is self-readable" on public.user_affinity;
create policy "User affinity is self-readable" on public.user_affinity for select using (auth.uid() = user_id);
drop policy if exists "User affinity is self-writable" on public.user_affinity;
create policy "User affinity is self-writable" on public.user_affinity for insert with check (auth.uid() = user_id);
drop policy if exists "User affinity is self-updatable" on public.user_affinity;
create policy "User affinity is self-updatable" on public.user_affinity for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.sync_profile_from_auth()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_profile on auth.users;
create trigger on_auth_user_profile
  after insert or update of email on auth.users
  for each row execute procedure public.sync_profile_from_auth();

insert into public.profiles (id, email, full_name)
select id, email, coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name')
from auth.users
on conflict (id) do update set email = excluded.email;

-- Co-principal material is isolated from client-facing tables and routes.
create table if not exists public.principal_operations (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  deal_notes text,
  seller_finance_structure jsonb,
  wholesale_baseline numeric,
  created_at timestamptz not null default now()
);

alter table public.principal_operations enable row level security;
drop policy if exists "Co-principals only" on public.principal_operations;
create policy "Co-principals only" on public.principal_operations
  for all using (
    (auth.jwt()->'app_metadata'->>'role') = 'co_principal'
    or lower(auth.jwt()->>'email') in ('dwaricawill@gmail.com', 'diondwarica@gmail.com')
  )
  with check (
    (auth.jwt()->'app_metadata'->>'role') = 'co_principal'
    or lower(auth.jwt()->>'email') in ('dwaricawill@gmail.com', 'diondwarica@gmail.com')
  );
