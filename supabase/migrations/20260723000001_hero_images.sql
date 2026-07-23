alter table store_settings add column if not exists hero_images text[] not null default '{}'::text[];

update store_settings
set hero_images = array[hero_image]
where hero_image is not null and hero_images = '{}';
