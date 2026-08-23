-- Phase 4 House View, Track Record, and LP inventory support.
create table if not exists public.house_view_posts (
  id uuid primary key default gen_random_uuid(), title text not null, body text not null,
  category text check (category in ('macro', 'acquisition', 'trade', 'asset')),
  published boolean not null default false, created_at timestamptz not null default now()
);
alter table public.house_view_posts enable row level security;
drop policy if exists "Authenticated users can read published posts" on public.house_view_posts;
create policy "Authenticated users can read published posts" on public.house_view_posts for select using (auth.role() = 'authenticated' and published = true);

create table if not exists public.track_record (
  id uuid primary key default gen_random_uuid(), date text not null, category text,
  description text not null, return_label text, published boolean not null default true, created_at timestamptz not null default now()
);
alter table public.track_record enable row level security;
drop policy if exists "Published track record is public" on public.track_record;
create policy "Published track record is public" on public.track_record for select using (published = true);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(), brand text not null, model text not null, reference text,
  price numeric, category text not null, listing_type text, available boolean not null default true,
  ship_days integer, condition text, created_at timestamptz not null default now()
);
alter table public.listings enable row level security;
drop policy if exists "Available listings are public" on public.listings;
create policy "Available listings are public" on public.listings for select using (available = true);

insert into public.house_view_posts (title, body, category, published) values
('Service Business Acquisitions: The Underpriced Vertical', 'HVAC, residential cleaning, and home care businesses in the $500K-$1.5M SDE range represent the most consistently undervalued acquisition targets in the current market. Seller financing remains widely available as aging owner-operators seek clean exits. The Dwarica Group is actively acquiring in this corridor.', 'acquisition', true),
('Capital Markets Desk: Current Positioning', 'Maintaining systematic exposure to volatility premium across equity indices while prediction market positioning continues to generate positive expected value on event-driven outcomes. Position sizing is unit-based. Every thesis is documented before execution.', 'trade', true),
('Luxury Asset Margins: Why Physical Assets Outperform in Inflationary Regimes', 'Reference-grade timepieces from AP, Patek, and Richard Mille have historically outperformed traditional inflation hedges over 5-year horizons. Our dealer network access creates consistent arbitrage between wholesale and secondary market pricing.', 'asset', true)
on conflict do nothing;

insert into public.track_record (date, category, description, return_label, published) values
('Q2 2025', 'asset', 'Acquired reference-grade Audemars Piguet Royal Oak at wholesale. Exited via private client placement.', '+16% in 22 days', true),
('Q3 2025', 'trade', 'Systematic prediction market positioning across economic event schedule. 14 consecutive positive outcomes.', 'Consistent positive EV', true),
('Q4 2025', 'acquisition', 'Executed proprietary sourcing of service business target in Nassau County. Currently under LOI.', 'Pending close', true),
('Q1 2026', 'asset', 'Luxury automotive brokerage closed: Rolls-Royce Ghost matched to qualified buyer via private network.', 'Fee captured at close', true)
on conflict do nothing;
