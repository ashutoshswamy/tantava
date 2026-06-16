-- Tantava — canonical schema
-- Run once on a fresh database.
-- price / total / subtotal stored in paise (₹1 = 100 paise)

-- ─────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- AUTO-UPDATE updated_at (must be defined first so triggers can reference it)
-- ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────
-- COLLECTIONS
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

create or replace trigger collections_updated_at
  before update on collections
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────
-- PRODUCTS
-- size_inventory: {"XS":0,"S":0,"M":5,"L":3,"XL":0,"XXL":0}
-- ─────────────────────────────────────────────
create table if not exists products (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  description     text,
  price           integer not null check (price >= 0),
  category        text not null,
  fabric          text,
  images          text[] not null default '{}',
  size_inventory  jsonb not null default '{}',
  sku             text unique,
  badge           text,
  is_active       boolean not null default true,
  collection_id   uuid references collections(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists products_category_idx  on products (category);
create index if not exists products_is_active_idx on products (is_active);

create or replace trigger products_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────
-- ORDERS
-- user_id: Clerk user ID
-- items JSONB: [{product_id, name, price, quantity, size, image}]
-- shipping_address JSONB: {name, phone, line1, line2?, city, state, pincode}
-- ─────────────────────────────────────────────
create table if not exists orders (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              text not null,
  user_email           text,
  user_name            text,
  items                jsonb not null default '[]',
  subtotal             integer not null default 0 check (subtotal >= 0),
  total                integer not null check (total >= 0),
  status               text not null default 'pending'
                         check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address     jsonb,
  razorpay_order_id    text unique,
  razorpay_payment_id  text unique,
  razorpay_signature   text,
  admin_notes          text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists orders_user_id_idx    on orders (user_id);
create index if not exists orders_status_idx     on orders (status);
create index if not exists orders_created_at_idx on orders (created_at desc);

create or replace trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────
-- INVENTORY LOGS
-- change > 0 = stock added, change < 0 = stock removed
-- ─────────────────────────────────────────────
create table if not exists inventory_logs (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products (id) on delete cascade,
  size        text,
  change      integer not null,
  reason      text,
  created_at  timestamptz not null default now()
);

create index if not exists inventory_logs_product_id_idx  on inventory_logs (product_id);
create index if not exists inventory_logs_created_at_idx  on inventory_logs (created_at desc);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

-- Collections: public read of active collections; writes via service role only
alter table collections enable row level security;
create policy "collections_public_read" on collections
  for select using (is_active = true);

-- Products: public read of active items; writes via service role only
alter table products enable row level security;
create policy "products_public_read" on products
  for select using (is_active = true);

-- Orders: users read their own; inserts/updates via service role only
alter table orders enable row level security;
create policy "orders_user_read" on orders
  for select using (auth.uid()::text = user_id);

-- Inventory logs: admin only via service role — no client access
alter table inventory_logs enable row level security;

-- ─────────────────────────────────────────────
-- FEEDBACKS
-- ─────────────────────────────────────────────
create table if not exists feedbacks (
  id         uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  name       text not null,
  phone      text,
  email      text,
  state      text,
  city       text,
  about      text not null
);

create index if not exists feedbacks_created_at_idx on feedbacks (created_at desc);

alter table feedbacks enable row level security;
create policy "feedbacks_public_insert" on feedbacks
  for insert with check (true);

-- ─────────────────────────────────────────────
-- INQUIRIES
-- ─────────────────────────────────────────────
create table if not exists inquiries (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  subject    text not null default 'other',
  message    text not null,
  created_at timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on inquiries (created_at desc);

alter table inquiries enable row level security;
create policy "inquiries_public_insert" on inquiries
  for insert with check (true);
