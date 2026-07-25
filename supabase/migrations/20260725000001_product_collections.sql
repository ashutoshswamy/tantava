-- Products previously held a single `collection_id` FK, so a product could
-- only ever belong to one collection. Replace with a join table so admins
-- can assign the same product to multiple collections.

create table if not exists product_collections (
  product_id    uuid not null references products(id) on delete cascade,
  collection_id uuid not null references collections(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (product_id, collection_id)
);

create index if not exists product_collections_collection_id_idx on product_collections (collection_id);

insert into product_collections (product_id, collection_id)
select id, collection_id from products where collection_id is not null
on conflict do nothing;

drop index if exists products_collection_id_idx;
alter table products drop column if exists collection_id;
