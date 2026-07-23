alter table store_settings add column if not exists promo_modal_enabled boolean not null default false;
alter table store_settings add column if not exists promo_modal_title text;
alter table store_settings add column if not exists promo_modal_message text;
alter table store_settings add column if not exists promo_modal_image text;
alter table store_settings add column if not exists promo_modal_button_text text;
alter table store_settings add column if not exists promo_modal_button_link text;
