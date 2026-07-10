-- Adds sort_order to products so admins can manually reorder them.
-- Backfilled from current created_at desc order so existing display order is preserved.

alter table products add column if not exists sort_order integer;

update products set sort_order = t.rn - 1
from (select id, row_number() over (order by created_at desc) as rn from products) t
where products.id = t.id and products.sort_order is null;

alter table products alter column sort_order set default 0;
alter table products alter column sort_order set not null;
