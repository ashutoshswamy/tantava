-- Adds per-product care instructions, discount price, free delivery flag,
-- and a singleton store_settings table for site-wide delivery & returns copy.
-- Safe to run against an existing database (idempotent).

alter table products add column if not exists discount_price integer check (discount_price >= 0);
alter table products add column if not exists care           text;
alter table products add column if not exists free_delivery  boolean not null default false;

create table if not exists store_settings (
  id             boolean primary key default true check (id),
  delivery_info  text,
  returns_info   text,
  updated_at     timestamptz not null default now()
);

insert into store_settings (id) values (true) on conflict (id) do nothing;

create or replace trigger store_settings_updated_at
  before update on store_settings
  for each row execute function set_updated_at();

alter table store_settings enable row level security;

drop policy if exists "store_settings_public_read" on store_settings;
create policy "store_settings_public_read" on store_settings
  for select using (true);
