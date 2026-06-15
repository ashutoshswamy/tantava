-- Migration: collections table + product enhancements
-- Run on an existing database that has the base schema applied.

-- ─────────────────────────────────────────────
-- 1. COLLECTIONS TABLE
-- ─────────────────────────────────────────────
create table if not exists collections (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text unique not null,
  description text,
  cover_image text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists collections_slug_idx      on collections (slug);
create index if not exists collections_is_active_idx on collections (is_active);

-- updated_at trigger (reuse existing set_updated_at function)
create or replace trigger collections_updated_at
  before update on collections
  for each row execute function set_updated_at();

-- RLS
alter table collections enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'collections' and policyname = 'collections_public_read'
  ) then
    create policy "collections_public_read" on collections
      for select using (is_active = true);
  end if;
end
$$;

-- ─────────────────────────────────────────────
-- 2. PRODUCTS — drop old category CHECK constraint
-- ─────────────────────────────────────────────
do $$
declare
  constraint_name text;
begin
  select conname into constraint_name
  from pg_constraint
  where conrelid = 'products'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%category%';

  if constraint_name is not null then
    execute format('alter table products drop constraint %I', constraint_name);
  end if;
end
$$;

-- ─────────────────────────────────────────────
-- 3. PRODUCTS — add new columns
-- ─────────────────────────────────────────────
alter table products
  add column if not exists collection_id uuid references collections(id) on delete set null;

create index if not exists products_collection_id_idx on products (collection_id);
