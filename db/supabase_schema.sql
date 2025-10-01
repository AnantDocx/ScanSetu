-- Supabase schema for ScanSetu (development-friendly defaults)
-- Run this in Supabase SQL editor

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique,
  created_at timestamptz not null default now()
);

-- Individual items belonging to a product
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  code text unique not null, -- e.g., objA1
  status text not null default 'in_stock' check (status in ('in_stock','issued','lost','damaged')),
  created_at timestamptz not null default now()
);

-- Users (lightweight directory)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique,
  created_at timestamptz not null default now()
);

-- Assignments/transactions: when an item is issued to a user
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete restrict,
  status text not null default 'issued' check (status in ('issued','returned')),
  issued_at timestamptz not null default now(),
  returned_at timestamptz,
  due_at timestamptz
);

-- Convenience view for dashboard recent activity
create or replace view public.recent_activity as
select
  it.code as code,
  p.name as product,
  u.full_name as holder,
  case when a.status = 'issued' then 'issued' else 'in_stock' end as status,
  coalesce(a.returned_at, a.issued_at) as updated
from public.items it
join public.products p on p.id = it.product_id
left join lateral (
  select *
  from public.assignments a2
  where a2.item_id = it.id
  order by a2.issued_at desc nulls last
  limit 1
) a on true
left join public.users u on u.id = a.user_id
order by updated desc nulls last;

-- Enable RLS
alter table public.products enable row level security;
alter table public.items enable row level security;
alter table public.users enable row level security;
alter table public.assignments enable row level security;

-- Development policies: allow read to anon; writes are open for now (limit in prod)
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='products' and policyname='Allow read for anon'
  ) then
    create policy "Allow read for anon" on public.products for select to anon using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='items' and policyname='Allow read for anon'
  ) then
    create policy "Allow read for anon" on public.items for select to anon using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='users' and policyname='Allow read for anon'
  ) then
    create policy "Allow read for anon" on public.users for select to anon using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='assignments' and policyname='Allow read for anon'
  ) then
    create policy "Allow read for anon" on public.assignments for select to anon using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='products' and policyname='Allow insert for anon'
  ) then
    create policy "Allow insert for anon" on public.products for insert to anon with check (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='items' and policyname='Allow insert for anon'
  ) then
    create policy "Allow insert for anon" on public.items for insert to anon with check (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='users' and policyname='Allow insert for anon'
  ) then
    create policy "Allow insert for anon" on public.users for insert to anon with check (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='assignments' and policyname='Allow insert for anon'
  ) then
    create policy "Allow insert for anon" on public.assignments for insert to anon with check (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='items' and policyname='Allow update for anon'
  ) then
    create policy "Allow update for anon" on public.items for update to anon using (true) with check (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='assignments' and policyname='Allow update for anon'
  ) then
    create policy "Allow update for anon" on public.assignments for update to anon using (true) with check (true);
  end if;
end $$;

-- Sample seed data (optional)
insert into public.products (name, sku) values
  ('Spanner Set A', 'SPN-A')
  on conflict (sku) do nothing;

insert into public.items (product_id, code, status)
select p.id, 'objA1', 'in_stock' from public.products p where p.sku='SPN-A'
on conflict (code) do nothing;
insert into public.items (product_id, code, status)
select p.id, 'objA2', 'issued' from public.products p where p.sku='SPN-A'
on conflict (code) do nothing;

insert into public.users (full_name, email) values
  ('Rohan Kumar', 'rohan@example.com')
  on conflict (email) do nothing;
insert into public.users (full_name, email) values
  ('Priya Singh', 'priya@example.com')
  on conflict (email) do nothing;

-- If objA2 is issued to Rohan
insert into public.assignments (item_id, user_id, status, issued_at, due_at)
select i.id, u.id, 'issued', now() - interval '1 day', now() + interval '2 days'
from public.items i
join public.products p on p.id = i.product_id and p.sku='SPN-A'
join public.users u on u.email='rohan@example.com'
where i.code='objA2'
ON CONFLICT DO NOTHING;
