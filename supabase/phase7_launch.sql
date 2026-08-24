-- Phase 7 launch contract. Review and run in Supabase SQL editor.
-- Privileged access is granted only through auth.jwt() app_metadata claims.

alter table public.inquiries add column if not exists updated_at timestamptz default now();
alter table public.inquiries add column if not exists status text default 'received';
alter table public.listings add column if not exists status text default 'Available';
alter table public.listings add column if not exists image_urls text[] default '{}';
alter table public.listings add column if not exists updated_at timestamptz default now();

create table if not exists public.lp_memberships (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, status text not null default 'pending' check (status in ('pending', 'approved', 'suspended')), commitment numeric default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (user_id));
create table if not exists public.lp_documents (id uuid primary key default gen_random_uuid(), title text not null, category text not null, storage_path text not null unique, classification text not null default 'LP confidential', published_at timestamptz, updated_at timestamptz not null default now(), published boolean not null default false);
create table if not exists public.lp_distributions (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, amount numeric not null default 0, distribution_date date not null, status text not null default 'scheduled', reference text, created_at timestamptz not null default now());
create table if not exists public.lp_capital_calls (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, amount numeric not null default 0, due_date date not null, status text not null default 'projected', purpose text, created_at timestamptz not null default now());
create table if not exists public.audit_logs (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null, action text not null, resource_type text, resource_id text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());

create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_user_id_idx on public.audit_logs (user_id);
create index if not exists lp_distributions_user_id_idx on public.lp_distributions (user_id, distribution_date desc);
create index if not exists lp_capital_calls_user_id_idx on public.lp_capital_calls (user_id, due_date asc);

alter table public.lp_memberships enable row level security;
alter table public.lp_documents enable row level security;
alter table public.lp_distributions enable row level security;
alter table public.lp_capital_calls enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_operations_user() returns boolean language sql stable security definer set search_path = public as $$ select coalesce(auth.jwt()->'app_metadata'->>'role', '') in ('admin', 'principal', 'co_principal'); $$;

drop policy if exists "LP members read own membership" on public.lp_memberships;
create policy "LP members read own membership" on public.lp_memberships for select using (auth.uid() = user_id or public.is_operations_user());
drop policy if exists "Operations manage memberships" on public.lp_memberships;
create policy "Operations manage memberships" on public.lp_memberships for all using (public.is_operations_user()) with check (public.is_operations_user());
drop policy if exists "Approved LPs read published documents" on public.lp_documents;
create policy "Approved LPs read published documents" on public.lp_documents for select using ((published = true and exists (select 1 from public.lp_memberships m where m.user_id = auth.uid() and m.status = 'approved')) or public.is_operations_user());
drop policy if exists "Operations manage documents" on public.lp_documents;
create policy "Operations manage documents" on public.lp_documents for all using (public.is_operations_user()) with check (public.is_operations_user());
drop policy if exists "LPs read own distributions" on public.lp_distributions;
create policy "LPs read own distributions" on public.lp_distributions for select using (auth.uid() = user_id or public.is_operations_user());
drop policy if exists "Operations manage distributions" on public.lp_distributions;
create policy "Operations manage distributions" on public.lp_distributions for all using (public.is_operations_user()) with check (public.is_operations_user());
drop policy if exists "LPs read own capital calls" on public.lp_capital_calls;
create policy "LPs read own capital calls" on public.lp_capital_calls for select using (auth.uid() = user_id or public.is_operations_user());
drop policy if exists "Operations manage capital calls" on public.lp_capital_calls;
create policy "Operations manage capital calls" on public.lp_capital_calls for all using (public.is_operations_user()) with check (public.is_operations_user());
drop policy if exists "Operations read audit logs" on public.audit_logs;
create policy "Operations read audit logs" on public.audit_logs for select using (public.is_operations_user());
drop policy if exists "Authenticated users create own audit logs" on public.audit_logs;
create policy "Authenticated users create own audit logs" on public.audit_logs for insert with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('lp-documents', 'lp-documents', false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('marketplace-media', 'marketplace-media', false) on conflict (id) do nothing;
drop policy if exists "LP users read approved documents" on storage.objects;
create policy "LP users read approved documents" on storage.objects for select using (bucket_id = 'lp-documents' and (public.is_operations_user() or exists (select 1 from public.lp_memberships m where m.user_id = auth.uid() and m.status = 'approved')));
drop policy if exists "Operations manage private media" on storage.objects;
create policy "Operations manage private media" on storage.objects for all using (public.is_operations_user()) with check (public.is_operations_user());

create or replace function public.touch_inquiry_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists inquiries_touch_updated_at on public.inquiries;
create trigger inquiries_touch_updated_at before update on public.inquiries for each row execute function public.touch_inquiry_updated_at();
