-- Products previously held a single `category` text column, so a product
-- could only ever belong to one category. Replace with a join table so
-- admins can assign the same product to multiple categories.

create table if not exists product_categories (
  product_id  uuid not null references products(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (product_id, category_id)
);

create index if not exists product_categories_category_id_idx on product_categories (category_id);

-- Matches by name since `products.category` was free text, not an FK.
-- Products whose category text doesn't match any categories.name are left
-- uncategorized — check for these before running in production:
--   select id, name, category from products
--   where category not in (select name from categories);
insert into product_categories (product_id, category_id)
select p.id, c.id
from products p
join categories c on c.name = p.category
on conflict do nothing;

drop index if exists products_category_idx;
alter table products drop column if exists category;
