create table if not exists coupons (
  id              uuid primary key default uuid_generate_v4(),
  code            text unique not null,
  discount_type   text not null default 'percent' check (discount_type in ('percent', 'flat')),
  discount_value  integer not null check (discount_value > 0),
  expires_at      timestamptz,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists coupons_code_idx on coupons (code);

create or replace trigger coupons_updated_at
  before update on coupons
  for each row execute function set_updated_at();

-- Coupons: writes/reads via service role only — codes are checked through
-- the /api/coupons/validate endpoint, never queried directly by clients.
alter table coupons enable row level security;

alter table store_settings
  add column if not exists first_purchase_discount_percent integer not null default 0
  check (first_purchase_discount_percent >= 0 and first_purchase_discount_percent <= 100);

alter table orders add column if not exists coupon_code text;
alter table orders add column if not exists discount_amount integer not null default 0 check (discount_amount >= 0);
