create extension if not exists pgcrypto;

create table if not exists accounts (id uuid default gen_random_uuid() primary key, email text unique not null, created_at timestamptz default now(), account_type text default 'client', notes text);
create table if not exists inquiries (id uuid default gen_random_uuid() primary key, account_id uuid references accounts(id), item_name text, item_category text, message text, status text default 'received', created_at timestamptz default now());
create table if not exists favorites (id uuid default gen_random_uuid() primary key, account_id uuid references accounts(id), item_id text not null, item_name text, item_category text, item_price numeric, item_image text, notes text, created_at timestamptz default now());
create table if not exists consignment_submissions (id uuid default gen_random_uuid() primary key, account_id uuid references accounts(id), item_description text, asking_price numeric, photos text[], status text default 'received', view_count integer default 0, created_at timestamptz default now());
create table if not exists account_activity (id uuid default gen_random_uuid() primary key, account_id uuid references accounts(id), action text, item_id text, detail text, created_at timestamptz default now());
create table if not exists closed_deals (id uuid default gen_random_uuid() primary key, account_id uuid references accounts(id), item_name text, item_category text, sale_price numeric, closed_at timestamptz default now());
create table if not exists firm_pulse (id uuid default gen_random_uuid() primary key, content text not null, created_at timestamptz default now(), published boolean default false);

insert into firm_pulse (content, published) values
('Capital markets desk maintained active positioning across equities and prediction markets through the current cycle. Multi-instrument approach continues to generate consistent returns on deployed capital.', true),
('Real estate pipeline active across Nassau and Suffolk County. Two pre-foreclosure targets under review. Commercial pipeline expanding into Florida and Georgia corridors.', true),
('Private equity acquisition pipeline: three targets currently under diligence in the $300K–$800K SDE range. Seller financing structures being evaluated on all three.', true)
on conflict do nothing;

alter table accounts enable row level security;
alter table inquiries enable row level security;
alter table favorites enable row level security;
alter table consignment_submissions enable row level security;
alter table account_activity enable row level security;
alter table closed_deals enable row level security;
alter table firm_pulse enable row level security;

drop policy if exists "account owners can read their account" on accounts;
create policy "account owners can read their account" on accounts for select using (auth.uid() = id);
drop policy if exists "account owners can read their inquiries" on inquiries;
create policy "account owners can read their inquiries" on inquiries for select using (auth.uid() = account_id);
drop policy if exists "account owners can create inquiries" on inquiries;
create policy "account owners can create inquiries" on inquiries for insert with check (auth.uid() = account_id);
drop policy if exists "account owners can manage favorites" on favorites;
create policy "account owners can manage favorites" on favorites for all using (auth.uid() = account_id) with check (auth.uid() = account_id);
drop policy if exists "account owners can manage consignments" on consignment_submissions;
create policy "account owners can manage consignments" on consignment_submissions for all using (auth.uid() = account_id) with check (auth.uid() = account_id);
drop policy if exists "account owners can read activity" on account_activity;
create policy "account owners can read activity" on account_activity for select using (auth.uid() = account_id);
drop policy if exists "account owners can read closed deals" on closed_deals;
create policy "account owners can read closed deals" on closed_deals for select using (auth.uid() = account_id);
drop policy if exists "published pulse is public" on firm_pulse;
create policy "published pulse is public" on firm_pulse for select using (published = true);
