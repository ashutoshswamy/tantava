-- Tantava Supabase Schema
-- Run this in the Supabase SQL editor to set up all tables

-- ─────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- PRODUCTS
-- price stored in paise (₹1 = 100 paise)
-- ─────────────────────────────────────────────
create table if not exists products (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  description      text,
  price            integer not null check (price >= 0),
  category         text not null check (category in ('sarees', 'lehengas', 'fusion', 'gowns', 'jewellery')),
  fabric           text,
  images           text[] not null default '{}',
  stock_quantity   integer not null default 0 check (stock_quantity >= 0),
  sku              text unique,
  badge            text,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists products_category_idx on products (category);
create index if not exists products_is_active_idx on products (is_active);

-- ─────────────────────────────────────────────
-- APPOINTMENTS
-- user_id is a Clerk user ID (nullable for guest bookings)
-- ─────────────────────────────────────────────
create table if not exists appointments (
  id        uuid primary key default uuid_generate_v4(),
  user_id   text,
  name      text not null,
  phone     text not null,
  email     text,
  date      date not null,
  occasion  text check (occasion in ('office', 'festive', 'everyday', 'custom')),
  message   text,
  status    text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists appointments_status_idx on appointments (status);
create index if not exists appointments_user_id_idx on appointments (user_id);
create index if not exists appointments_date_idx on appointments (date);

-- ─────────────────────────────────────────────
-- ORDERS
-- user_id is a Clerk user ID
-- items JSONB: [{product_id, name, price, quantity, size?, image?}]
-- shipping_address JSONB: {name, phone, line1, line2?, city, state, pincode}
-- total stored in paise
-- ─────────────────────────────────────────────
create table if not exists orders (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              text not null,
  user_email           text,
  user_name            text,
  items                jsonb not null default '[]',
  total                integer not null check (total >= 0),
  status               text not null default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address     jsonb,
  razorpay_order_id    text unique,
  razorpay_payment_id  text unique,
  razorpay_signature   text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists orders_user_id_idx on orders (user_id);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_created_at_idx on orders (created_at desc);

-- ─────────────────────────────────────────────
-- INVENTORY LOGS
-- change > 0 = stock added, change < 0 = stock removed
-- ─────────────────────────────────────────────
create table if not exists inventory_logs (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products (id) on delete cascade,
  change      integer not null,
  reason      text,
  created_at  timestamptz not null default now()
);

create index if not exists inventory_logs_product_id_idx on inventory_logs (product_id);
create index if not exists inventory_logs_created_at_idx on inventory_logs (created_at desc);

-- ─────────────────────────────────────────────
-- AUTO-UPDATE updated_at
-- ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger products_updated_at
  before update on products
  for each row execute function set_updated_at();

create or replace trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

-- Products: public read, no direct client writes (all writes go through service role API)
alter table products enable row level security;
create policy "products_public_read" on products
  for select using (is_active = true);

-- Appointments: anyone can insert, no client reads (admin reads via service role)
alter table appointments enable row level security;
create policy "appointments_insert" on appointments
  for insert with check (true);

-- Orders: users can read their own orders; inserts via service role only
alter table orders enable row level security;
create policy "orders_user_read" on orders
  for select using (auth.uid()::text = user_id);

-- Inventory logs: no client access (admin only via service role)
alter table inventory_logs enable row level security;
